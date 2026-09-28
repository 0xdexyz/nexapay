import { useEffect, useRef, useState } from 'react';
import { PublicKey, VersionedTransaction, TransactionMessage, SystemProgram, ComputeBudgetProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '../hooks/useWallet.jsx';
import { shortenAddress } from '../lib/wallet.js';
import {
  connection, PAY_CLUSTER, RECEIVING_ADDRESS, USD_AMOUNT,
  verifyConfirmedPayment, waitForConfirmation, describePaymentError,
  solscanTxUrl, explorerTxUrl
} from '../lib/solanaPay.js';
import { PhantomIcon, CopyIcon, BackArrowIcon, CheckIcon, DownloadIcon, ExplorerIcon } from './Icons.jsx';

export default function ApplyModal({ open, onClose }){
  const { address, connecting, connectWallet, changeWallet, provider, connectHint } = useWallet();

  const [step, setStep] = useState('form'); // 'form' | 'payment' | 'success'
  const [cardType, setCardType] = useState('virtual');
  const [nickname, setNickname] = useState('');

  const [solPrice, setSolPrice] = useState(null);
  const [solAmount, setSolAmount] = useState(null);
  const [addrCopied, setAddrCopied] = useState(false);

  const [payBusy, setPayBusy] = useState(false);
  const [payBtnLabel, setPayBtnLabel] = useState(`Pay $${USD_AMOUNT} with connected wallet`);
  const [payStatus, setPayStatus] = useState({ text: '', kind: '' });
  const [payStatusLink, setPayStatusLink] = useState(null);

  const [receiptOpen, setReceiptOpen] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [lastTxSignature, setLastTxSignature] = useState(null);
  const [txCopyLabel, setTxCopyLabel] = useState('Copy');

  const firstFieldRef = useRef(null);

  useEffect(() => {
    if(!open) return;
    function onKeyDown(e){
      if(e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if(!open) return;
    document.body.classList.add('apply-open');
    setStep('form');
    setCardType('virtual');
    setNickname('');
    setPayStatus({ text: '', kind: '' });
    setPayStatusLink(null);
    setReceipt(null);
    setLastTxSignature(null);
    setReceiptOpen(true);
    const t = setTimeout(() => { firstFieldRef.current && firstFieldRef.current.focus(); }, 200);
    return () => {
      document.body.classList.remove('apply-open');
      clearTimeout(t);
    };
  }, [open]);

  // ---- SOL price + QR ----
  useEffect(() => {
    let cancelled = false;
    async function loadSolPrice(){
      try{
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await res.json();
        const price = data && data.solana && data.solana.usd ? data.solana.usd : null;
        if(!price) throw new Error('no price');
        if(cancelled) return;
        setSolPrice(price);
        setSolAmount(Number((USD_AMOUNT / price).toFixed(4)));
      }catch(err){
        if(!cancelled) setSolPrice(null);
      }
    }
    loadSolPrice();
    return () => { cancelled = true; };
  }, []);

  function handleBack(){
    onClose();
  }

  function handleFormSubmit(e){
    e.preventDefault();
    setStep('payment');
    setLastTxSignature(null);
    setReceipt(null);
    setPayStatus({ text: '', kind: '' });
    setPayStatusLink(null);
  }

  async function handleCopyAddress(){
    try{
      await navigator.clipboard.writeText(RECEIVING_ADDRESS);
      setAddrCopied(true);
      setPayStatus({ text: 'Address copied.', kind: '' });
      setTimeout(() => { setPayStatus({ text: '', kind: '' }); setAddrCopied(false); }, 2000);
    }catch(err){}
  }

  function buildReceipt(txSignature){
    const wallet = address || '';
    const shortWallet = wallet ? shortenAddress(wallet) : '';
    const now = new Date();
    const voucher = 'REC-' + now.getTime() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const typeLabel = cardType.charAt(0).toUpperCase() + cardType.slice(1) + (nickname.trim() ? ` — "${nickname.trim()}"` : '');

    return {
      status: 'Paid',
      receiptId: voucher,
      amountUsd: USD_AMOUNT,
      amountSol: solAmount,
      cardType: typeLabel,
      shortWallet: shortWallet || 'you',
      wallet,
      network: PAY_CLUSTER === 'mainnet-beta' ? 'mainnet' : PAY_CLUSTER,
      dateDisplay: now.toLocaleString() + ' | ' + now.toISOString(),
      dateIso: now.toISOString(),
      tx: txSignature,
      txHref: solscanTxUrl(txSignature),
      explorerHref: explorerTxUrl(txSignature)
    };
  }

  async function payWithWallet(){
    const providerObj = provider.current;
    if(!address || !providerObj){
      setPayStatus({ text: 'Connect your wallet first.', kind: 'error' });
      return;
    }
    if(!solAmount){
      setPayStatus({ text: 'Still fetching the SOL price — try again in a moment.', kind: 'error' });
      return;
    }

    setPayBusy(true);
    setPayBtnLabel('Confirming in Phantom...');
    setPayStatus({ text: 'Waiting for approval in your wallet…', kind: 'pending' });
    setPayStatusLink(null);

    // Local test mode: on localhost, simulate a successful payment so the
    // flow can be tested without moving real SOL. Never runs on the live site.
    if(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'){
      await new Promise(r => setTimeout(r, 900));
      setPayBtnLabel('Verifying on Solana Blockchain...');
      setPayStatus({ text: 'Verifying on Solana Blockchain…', kind: 'pending' });
      await new Promise(r => setTimeout(r, 700));
      const demoTx = 'DEMOTX' + Date.now();
      setLastTxSignature(demoTx);
      setReceipt(buildReceipt(demoTx));
      setStep('success');
      setReceiptOpen(true);
      setPayStatus({ text: '', kind: '' });
      setPayBtnLabel('Payment Verified');
      setPayBusy(false);
      return;
    }

    let signature = null;
    try{
      const fromPubkey = new PublicKey(address);
      const toPubkey = new PublicKey(RECEIVING_ADDRESS);
      const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);

      if(toPubkey.toBase58() !== RECEIVING_ADDRESS){
        throw new Error('Payment recipient validation failed. No transaction was sent.');
      }

      const connectedKey = providerObj.publicKey && providerObj.publicKey.toString();
      if(connectedKey && connectedKey !== fromPubkey.toBase58()){
        throw new Error('Wallet account changed. Reconnect your wallet before paying.');
      }

      const latest = await connection.getLatestBlockhash();
      const transferInstruction = SystemProgram.transfer({ fromPubkey, toPubkey, lamports });
      const messageV0 = new TransactionMessage({
        payerKey: fromPubkey,
        recentBlockhash: latest.blockhash,
        instructions: [
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50000 }),
          transferInstruction
        ]
      }).compileToV0Message();
      const tx = new VersionedTransaction(messageV0);

      if(typeof providerObj.signAndSendTransaction === 'function'){
        const sent = await providerObj.signAndSendTransaction(tx);
        signature = sent.signature || sent;
      } else if(typeof providerObj.signTransaction === 'function'){
        const signed = await providerObj.signTransaction(tx);
        signature = await connection.sendRawTransaction(signed.serialize());
      } else {
        throw new Error('Wallet does not support signing transactions');
      }

      setPayBtnLabel('Verifying on Solana Blockchain...');
      setPayStatus({ text: 'Verifying on Solana Blockchain…', kind: 'pending' });
      const outcome = await waitForConfirmation(signature, latest.blockhash, latest.lastValidBlockHeight);

      if(outcome === 'confirmed'){
        const verified = await verifyConfirmedPayment(signature, fromPubkey.toBase58(), RECEIVING_ADDRESS, lamports);
        if(!verified){
          throw new Error('The transaction was confirmed, but the registered payment recipient could not be verified.');
        }
        setLastTxSignature(signature);
        const rec = buildReceipt(signature);
        setReceipt(rec);
        setStep('success');
        setReceiptOpen(true);
        setPayStatus({ text: '', kind: '' });
        setPayBtnLabel('Payment Verified');
      } else if(outcome === 'failed'){
        setPayStatus({ text: 'The transaction was rejected on-chain — no funds were moved. You can try again.', kind: 'error' });
      } else {
        // outcome === 'unknown': the RPC never confirmed it in time, but the
        // transaction may still land. Do NOT prompt a retry here — retrying
        // a payment that's actually still in flight risks paying twice.
        setLastTxSignature(signature);
        setPayStatus({ text: 'Still confirming — this can take a bit longer than usual. Check the status before paying again:', kind: 'error' });
        setPayStatusLink(explorerTxUrl(signature));
      }
    }catch(err){
      console.info('Payment was rejected or failed.', err);
      setPayStatus({ text: describePaymentError(err), kind: 'error' });
    }finally{
      setPayBusy(false);
      if(!signature) setPayBtnLabel(`Pay $${USD_AMOUNT} with connected wallet`);
    }
  }

  function handleReceiptDownload(){
    if(!receipt) return;
    window.print();
  }

  async function handleReceiptCopy(){
    if(!lastTxSignature) return;
    try{
      await navigator.clipboard.writeText(lastTxSignature);
      setTxCopyLabel('Copied');
      setTimeout(() => setTxCopyLabel('Copy'), 1800);
    }catch(err){
      setTxCopyLabel('Copy failed');
    }
  }

  return (
    <div className={'apply-page' + (open ? ' open' : '')} role="dialog" aria-modal="true" aria-labelledby="applyHeading">
      <a href="#" className="apply-back" onClick={(e) => { e.preventDefault(); handleBack(); }}>
        <BackArrowIcon />
        Back
      </a>

      <div className="apply-card">
        <div className="apply-head">
          <div className="badge">✦ No traditional KYC</div>
          <h2 id="applyHeading">Request your <em>on-chain</em> card</h2>
          <p>Wallet-native. No paperwork. Connect your wallet and choose the card that fits you.</p>
        </div>

        {step === 'form' && (
          <form className="apply-form" onSubmit={handleFormSubmit}>
            <div className="apply-field">
              <label>Wallet</label>
              <div className="apply-wallet-box">
                {!address ? (
                  <button
                    type="button"
                    ref={firstFieldRef}
                    className="btn btn-phantom apply-wallet-connect"
                    disabled={connecting}
                    onClick={connectWallet}
                  >
                    <PhantomIcon />
                    <span>{connecting ? 'Connecting...' : 'Connect wallet'}</span>
                  </button>
                ) : (
                  <div className="apply-wallet-connected">
                    <span className="wallet-dot"></span>
                    <span>{shortenAddress(address)}</span>
                    <button type="button" className="apply-wallet-change" onClick={changeWallet}>Change</button>
                  </div>
                )}
              </div>
              <p className="apply-hint">
                {connectHint || 'Your wallet is used to identify your account and power your card experience.'}
              </p>
            </div>

            <div className="apply-field">
              <label>Card type</label>
              <div className="apply-toggle" role="radiogroup" aria-label="Card type">
                <button
                  type="button"
                  className={'apply-toggle-opt' + (cardType === 'virtual' ? ' active' : '')}
                  role="radio"
                  aria-checked={cardType === 'virtual'}
                  onClick={() => setCardType('virtual')}
                >
                  Virtual
                </button>
                <button
                  type="button"
                  className={'apply-toggle-opt' + (cardType === 'physical' ? ' active' : '')}
                  role="radio"
                  aria-checked={cardType === 'physical'}
                  onClick={() => setCardType('physical')}
                >
                  Physical
                </button>
              </div>
            </div>

            <div className="apply-field">
              <label htmlFor="applyNickname">Card nickname <span className="apply-optional">(optional)</span></label>
              <input
                type="text"
                id="applyNickname"
                name="nickname"
                placeholder="e.g. Main Card"
                maxLength={24}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-gold apply-submit" disabled={!address}>
              <span className="spark">✦</span> Continue
            </button>
          </form>
        )}

        {step === 'payment' && (
          <div className="apply-payment show">
            <div className="apply-receipt show" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', marginBottom: 18 }}>
              <div className="apply-receipt-row"><span>Item</span><b>Nexapay {cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card{nickname.trim() ? ` — "${nickname.trim()}"` : ''}</b></div>
              <div className="apply-receipt-row"><span>Quantity</span><b>1</b></div>
              <div className="apply-receipt-row"><span>Total</span><b>${USD_AMOUNT.toFixed(2)} {solAmount ? `(≈ ${solAmount} SOL)` : ''}</b></div>
            </div>

            <div className="apply-pay-amount">
              <span className="apply-pay-label">One-time card fee</span>
              <span className="apply-pay-usd">${USD_AMOUNT.toFixed(2)}</span>
              <span className="apply-pay-sol">{solAmount ? `≈ ${solAmount} SOL` : 'Loading SOL price…'}</span>
            </div>

            <p className="apply-pay-caption">Pay directly with your connected wallet below.</p>

            <div className="apply-pay-address">
              <span title="Recipient address hidden for privacy">{shortenAddress(RECEIVING_ADDRESS)}</span>
              <button type="button" aria-label="Copy address" onClick={handleCopyAddress}>
                <CopyIcon />
              </button>
            </div>

            <button type="button" className="btn btn-gold apply-submit" disabled={payBusy} onClick={payWithWallet}>
              <span className="spark">✦</span> <span>{payBtnLabel}</span>
            </button>

            <p className={'apply-pay-status' + (payStatus.kind ? ' ' + payStatus.kind : '')} aria-live="polite">
              {payStatus.text}
              {payStatusLink && (
                <a href={payStatusLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}> View on Solana Explorer</a>
              )}
            </p>
          </div>
        )}

        {step === 'success' && receipt && (
          <div className="apply-success show">
            <div className="apply-check"><CheckIcon /></div>
            <h3>Payment <em>Successful</em></h3>
            <p>Payment verified on the Solana blockchain for <strong>{receipt.shortWallet}</strong>.</p>
            <button type="button" className="btn btn-ghost apply-receipt-toggle" onClick={() => setReceiptOpen((v) => !v)}>
              {receiptOpen ? 'Hide receipt' : 'View receipt'}
            </button>

            {receiptOpen && (
              <div className="apply-receipt show">
                <div className="apply-receipt-row"><span>Status</span><b>Payment Verified!</b></div>
                <div className="apply-receipt-row"><span>Receipt ID</span><b>{receipt.receiptId}</b></div>
                <div className="apply-receipt-row"><span>Amount</span><b>${receipt.amountUsd.toFixed(2)} {receipt.amountSol ? `(${receipt.amountSol} SOL)` : ''}</b></div>
                <div className="apply-receipt-row"><span>Card type</span><b>{receipt.cardType}</b></div>
                <div className="apply-receipt-row"><span>Wallet</span><b title={receipt.wallet}>{receipt.wallet}</b></div>
                <div className="apply-receipt-row"><span>Recipient</span><b>{shortenAddress(RECEIVING_ADDRESS)}</b></div>
                <div className="apply-receipt-row"><span>Network</span><b>{receipt.network}</b></div>
                <div className="apply-receipt-row"><span>Date</span><b title={receipt.dateIso}>{receipt.dateDisplay}</b></div>
                <div className="apply-receipt-row">
                  <span>Transaction</span>
                  <b className="apply-receipt-tx">
                    <a href={receipt.txHref} target="_blank" rel="noreferrer">
                      {receipt.tx.slice(0, 8)}...{receipt.tx.slice(-8)}
                    </a>
                    <button type="button" className="apply-receipt-copy" aria-label="Copy transaction hash" onClick={handleReceiptCopy}>
                      {txCopyLabel}
                    </button>
                  </b>
                </div>
                <a
                  className="btn btn-ghost apply-receipt-download"
                  href={receipt.explorerHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExplorerIcon />
                  View on Solana Explorer
                </a>
                <button type="button" className="btn btn-ghost apply-receipt-download" onClick={handleReceiptDownload}>
                  <DownloadIcon />
                  Download / Print Receipt
                </button>
                <button type="button" className="btn btn-ghost apply-receipt-done" onClick={handleBack}>Done</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
