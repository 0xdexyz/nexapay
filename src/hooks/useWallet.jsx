import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { PHANTOM_DOWNLOAD_URL, detectWallets } from '../lib/wallet.js';

const WalletContext = createContext(null);

export function useWalletState(){
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connectHint, setConnectHint] = useState('');
  const providerRef = useRef(null);
  const connectInFlightRef = useRef(false);

  const bindProviderEvents = useCallback((provider) => {
    if(!provider || !provider.on) return;
    provider.on('disconnect', () => {
      providerRef.current = null;
      setAddress(null);
    });
    provider.on('accountChanged', (publicKey) => {
      if(publicKey){
        setAddress(publicKey.toString());
      } else {
        providerRef.current = null;
        setAddress(null);
      }
    });
  }, []);

  const connectToProvider = useCallback(async (provider) => {
    setConnecting(true);
    try{
      const resp = await provider.connect();
      const addr = resp && resp.publicKey ? resp.publicKey.toString() : (provider.publicKey ? provider.publicKey.toString() : '');
      if(!addr){ throw new Error('No public key returned'); }

      bindProviderEvents(provider);
      providerRef.current = provider;
      setAddress(addr);
    }catch(err){
      console.info('Wallet connection was rejected or closed.', err);
      setConnectHint('Wallet connection was cancelled. Try again when your wallet is ready.');
      try{ if(provider.disconnect) await provider.disconnect(); }catch(_e){}
    }finally{
      setConnecting(false);
    }
  }, [bindProviderEvents]);

  const connectWallet = useCallback(async () => {
    if(connectInFlightRef.current) return; // ignore repeated clicks while a connection is already in progress
    connectInFlightRef.current = true;
    try{
      const detected = detectWallets();

      if(detected.length === 0){
        setConnectHint('No Solana wallet detected. Install Phantom or open this page in a wallet browser, then try again.');
        window.open(PHANTOM_DOWNLOAD_URL, '_blank', 'noopener');
        return;
      }

      const phantomEntry = detected.find((w) => w.name === 'Phantom');
      const target = phantomEntry || detected[0];
      await connectToProvider(target.provider);
    } finally {
      connectInFlightRef.current = false;
    }
  }, [connectToProvider]);

  const disconnectWallet = useCallback(async () => {
    const provider = providerRef.current;
    try{
      if(provider && provider.disconnect){ await provider.disconnect(); }
    }catch(err){}
    providerRef.current = null;
    setAddress(null);
  }, []);

  const changeWallet = useCallback(async () => {
    await disconnectWallet();
    await connectWallet();
  }, [disconnectWallet, connectWallet]);

  return {
    address,
    provider: providerRef,
    connecting,
    connectHint,
    connectWallet,
    disconnectWallet,
    changeWallet,
    connectToProvider
  };
}

export function WalletProvider({ children }){
  const wallet = useWalletState();
  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
}

export function useWallet(){
  const ctx = useContext(WalletContext);
  if(!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
