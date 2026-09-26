import { useEffect, useRef, useState } from 'react';
import { useWallet } from '../hooks/useWallet.jsx';
import { SOLSCAN_CLUSTER, detectWallets, shortenAddress, PHANTOM_DOWNLOAD_URL } from '../lib/wallet.js';
import { LogoMarkIcon, XIcon, PhantomIcon, ChevronDownIcon } from './Icons.jsx';

export default function Header({ onApplyOpen }){
  const { address, connecting, connectWallet, disconnectWallet, connectToProvider } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    function onDocClick(e){
      if(widgetRef.current && !widgetRef.current.contains(e.target)){
        setMenuOpen(false);
        setPickerOpen(false);
      }
    }
    function onKeyDown(e){
      if(e.key === 'Escape'){
        setMenuOpen(false);
        setPickerOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  async function handleCopy(){
    if(!address) return;
    try{
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }catch(err){}
  }

  const detected = pickerOpen ? detectWallets() : [];

  async function handlePickWallet(provider){
    setMenuOpen(false);
    setPickerOpen(false);
    if(address){
      try{ await disconnectWallet(); }catch(_e){}
    }
    await connectToProvider(provider);
  }

  function handleChangeWallet(e){
    e.stopPropagation();
    setMenuOpen(false);
    if(detectWallets().length === 0){
      window.open(PHANTOM_DOWNLOAD_URL, '_blank', 'noopener');
      return;
    }
    setPickerOpen(true);
  }

  return (
    <header>
      <div className="header-inner">
        <div className="logo">
          <LogoMarkIcon />
          NEXAPAY <span className="divider"></span>
        </div>
        <nav>
          <a href="#" className="active">Home</a>
          <a href="#apply" onClick={(e) => { e.preventDefault(); onApplyOpen(); }}>Card</a>
          <a href="#security">Security</a>
          <a href="#" onClick={(e) => e.preventDefault()}>How It Works</a>
          <a href="#why">Features</a>
          <a href="#reviews">Reviews</a>
        </nav>
        <div className="nav-right">
          <a href="https://x.com/TryNexapay" target="_blank" rel="noopener" className="btn btn-x" aria-label="Follow on X">
            <XIcon />
          </a>
          <div className="wallet-widget" id="walletWidget" ref={widgetRef}>
            {!address ? (
              <button
                type="button"
                className="btn btn-phantom"
                aria-busy={connecting ? 'true' : 'false'}
                title="Connect a Solana wallet"
                disabled={connecting}
                onClick={connectWallet}
              >
                <PhantomIcon />
                <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            ) : (
              <div className={'wallet-connected' + (menuOpen ? ' menu-open' : '')}>
                <button
                  type="button"
                  className="wallet-pill"
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? 'true' : 'false'}
                  title={address}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPickerOpen(false);
                    setMenuOpen((v) => !v);
                  }}
                >
                  <span className="wallet-dot"></span>
                  <PhantomIcon />
                  <span id="walletAddress">{shortenAddress(address)}</span>
                  <ChevronDownIcon />
                </button>
                <div className="wallet-menu" role="menu">
                  <button type="button" role="menuitem" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
                    {copied ? 'Copied!' : 'Copy address'}
                  </button>
                  <a
                    role="menuitem"
                    href={'https://solscan.io/account/' + address + (SOLSCAN_CLUSTER ? '?cluster=' + SOLSCAN_CLUSTER : '')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Solscan
                  </a>
                  <button type="button" role="menuitem" onClick={handleChangeWallet}>Change wallet</button>
                  <button
                    type="button"
                    role="menuitem"
                    className="danger"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); disconnectWallet(); }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}

            {pickerOpen && (
              <div className="wallet-picker" role="menu">
                {detected.map((w) => (
                  <button
                    key={w.name}
                    type="button"
                    role="menuitem"
                    onClick={(e) => { e.stopPropagation(); handlePickWallet(w.provider); }}
                  >
                    <span className="wallet-picker-dot"></span>{w.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
