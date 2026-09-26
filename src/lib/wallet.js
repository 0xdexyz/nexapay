export const PHANTOM_DOWNLOAD_URL = 'https://phantom.app/download';
export const SOLSCAN_CLUSTER = ''; // '' = mainnet-beta, keep in sync with PAY_CLUSTER in solanaPay.js

// ---- Wallet detection (Wallet Standard-style: check every known injection point) ----
export function detectWallets(){
  const found = [];

  const phantom = (window.phantom && window.phantom.solana && window.phantom.solana.isPhantom)
    ? window.phantom.solana
    : ((window.solana && window.solana.isPhantom) ? window.solana : null);
  if(phantom) found.push({ name: 'Phantom', provider: phantom });

  if(window.solflare && window.solflare.isSolflare){
    found.push({ name: 'Solflare', provider: window.solflare });
  }
  if(window.backpack && window.backpack.isBackpack){
    found.push({ name: 'Backpack', provider: window.backpack });
  }
  const coinbase = window.coinbaseSolana || (window.coinbaseWalletExtension && window.coinbaseWalletExtension.solana);
  if(coinbase){ found.push({ name: 'Coinbase Wallet', provider: coinbase }); }

  if(window.trustwallet && window.trustwallet.solana){
    found.push({ name: 'Trust Wallet', provider: window.trustwallet.solana });
  }

  // Generic Wallet-Standard-only providers that aren't one of the above but still
  // exposed a Solana-shaped object on window.solana (and aren't Phantom, already handled).
  if(window.solana && !window.solana.isPhantom){
    const already = found.some((w) => w.provider === window.solana);
    if(!already) found.push({ name: window.solana.name || 'Detected wallet', provider: window.solana });
  }

  return found;
}

export function shortenAddress(addr){
  if(!addr) return '';
  return addr.slice(0, 4) + '..' + addr.slice(-4);
}

function buildAuthMessage(){
  const lines = [
    'Sign to authorize connection to this website.',
    'Site: ' + window.location.host,
    'Timestamp: ' + new Date().toISOString()
  ];
  return new TextEncoder().encode(lines.join('\n'));
}

// NOTE: connecting a wallet here only proves the visitor holds the keypair
// at the moment they sign the authorization message below. It is NOT a
// login/auth system on its own — if this is ever used to authenticate a
// user, the signed message must be verified server-side against a
// server-issued, single-use, expiring nonce to prevent replay attacks.
export async function requestSignedAuth(provider){
  if(typeof provider.signMessage !== 'function') return;
  const message = buildAuthMessage();
  await provider.signMessage(message, 'utf8');
}
