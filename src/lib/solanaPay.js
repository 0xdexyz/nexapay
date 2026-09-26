import { Connection, clusterApiUrl } from '@solana/web3.js';

// LIVE: mainnet-beta — every payment now moves real SOL.
export const PAY_CLUSTER = (localStorage.getItem('solana_network') === 'devnet') ? 'devnet' : 'mainnet-beta';
export const RECEIVING_ADDRESS = '2Uyf1kyHqagmedutdVHeHQR55W1vpdUk6nochgcD92Qg';
export const USD_AMOUNT = 1;

export function solscanTxUrl(signature){
  return 'https://solscan.io/tx/' + signature + (PAY_CLUSTER === 'mainnet-beta' ? '' : '?cluster=' + PAY_CLUSTER);
}

export function explorerTxUrl(signature){
  return 'https://explorer.solana.com/tx/' + signature + (PAY_CLUSTER === 'mainnet-beta' ? '' : '?cluster=' + PAY_CLUSTER);
}

function getRpcEndpoint(){
  const envEndpoint = (import.meta.env && (import.meta.env.VITE_SOLANA_RPC_URL || import.meta.env.NEXT_PUBLIC_SOLANA_RPC_URL)) || '';
  if(envEndpoint) return envEndpoint;
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const proxyEndpoint = (import.meta.env && import.meta.env.VITE_SOLANA_RPC_PROXY_URL) || '';
  if(isLocal && proxyEndpoint) return proxyEndpoint + '?network=' + (PAY_CLUSTER === 'devnet' ? 'devnet' : 'mainnet');
  // Connection() derives a ws:// endpoint from this URL, which requires an
  // absolute URL — a bare "/api/rpc" path throws at construction time.
  if(isLocal) return window.location.origin + '/api/rpc?network=' + (PAY_CLUSTER === 'devnet' ? 'devnet' : 'mainnet');
  // Use a browser-compatible public endpoint when no dedicated RPC is configured.
  // Production deployments should set VITE_SOLANA_RPC_URL to their provider.
  return PAY_CLUSTER === 'devnet' ? 'https://solana-devnet.publicnode.com' : 'https://solana-rpc.publicnode.com';
}

function createConnection(){
  try{
    return new Connection(getRpcEndpoint(), 'confirmed');
  }catch(err){
    console.info('Falling back to default cluster RPC endpoint.', err);
    return new Connection(clusterApiUrl(PAY_CLUSTER), 'confirmed');
  }
}

export const connection = createConnection();

export async function verifyConfirmedPayment(signature, payer, recipient, expectedLamports){
  const parsed = await connection.getParsedTransaction(signature, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0
  });
  if(!parsed || (parsed.meta && parsed.meta.err)) return false;

  const instructions = parsed.transaction.message.instructions || [];
  return instructions.some((instruction) => {
    const info = instruction.parsed && instruction.parsed.info;
    return instruction.program === 'system' && instruction.parsed.type === 'transfer' &&
      info && info.source === payer && info.destination === recipient &&
      Number(info.lamports) === expectedLamports;
  });
}

// Polls signature status directly instead of relying on a single
// confirmTransaction() call, which times out purely from RPC slowness
// (common on the free public endpoint) even when the tx did land.
// Returns 'confirmed' | 'failed' | 'unknown'.
export async function waitForConfirmation(signature, blockhash, lastValidBlockHeight){
  async function readSignatureStatus(){
    const result = await connection.getSignatureStatus(signature, { searchTransactionHistory: true });
    return result && result.value;
  }

  try{
    const beforeConfirmation = await readSignatureStatus();
    if(beforeConfirmation){
      if(beforeConfirmation.err) return 'failed';
      if(beforeConfirmation.confirmationStatus === 'confirmed' || beforeConfirmation.confirmationStatus === 'finalized') return 'confirmed';
    }

    const confirmation = await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      'confirmed'
    );
    if(!confirmation.value.err) return 'confirmed';
    return 'failed';
  }catch(confirmErr){
    // A slow RPC can reject confirmation after the transaction has landed.
    // Poll the signature before reporting a failure to the payer.
  }

  const start = Date.now();
  const maxWaitMs = 90000;
  const intervalMs = 1500;

  while(Date.now() - start < maxWaitMs){
    try{
      const info = await readSignatureStatus();
      if(info){
        if(info.err) return 'failed';
        if(info.confirmationStatus === 'confirmed' || info.confirmationStatus === 'finalized'){
          return 'confirmed';
        }
      }
    }catch(pollErr){
      // transient RPC hiccup while polling — keep trying until maxWaitMs
    }

    let height = null;
    try{ height = await connection.getBlockHeight(); }catch(_e){}
    if(height !== null && lastValidBlockHeight && height > lastValidBlockHeight){
      // The blockhash window has expired, but a lagging RPC can still
      // discover a landed signature from transaction history.
      try{
        const finalInfo = await readSignatureStatus();
        if(finalInfo && !finalInfo.err && (finalInfo.confirmationStatus === 'confirmed' || finalInfo.confirmationStatus === 'finalized')){
          return 'confirmed';
        }
        if(finalInfo && finalInfo.err) return 'failed';
      }catch(_e){}
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return 'unknown';
}

export function describePaymentError(err){
  const raw = (err && (err.message || err.toString())) || '';
  const lower = raw.toLowerCase();

  if(lower.indexOf('user rejected') !== -1 || lower.indexOf('rejected the request') !== -1 || (err && err.code === 4001)){
    return 'You declined the request in your wallet.';
  }
  if(lower.indexOf('insufficient') !== -1 || lower.indexOf('not enough') !== -1){
    return 'Your wallet doesn’t have enough SOL to cover this payment plus the network fee.';
  }
  if(lower.indexOf('blockhash') !== -1 || lower.indexOf('expired') !== -1){
    return 'The request timed out before it confirmed — please try again.';
  }
  if(lower.indexOf('failed to fetch') !== -1 || lower.indexOf('network') !== -1 || lower.indexOf('429') !== -1 || lower.indexOf('timeout') !== -1){
    return 'Could not reach the Solana network right now — please try again in a moment.';
  }
  return raw ? ('Payment did not go through: ' + raw) : 'Payment did not go through — you can try again.';
}
