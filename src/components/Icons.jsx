export function LogoMarkIcon(props){
  return <img className="logo-mark" src="/assets/logo.png" alt="Nexapay" {...props} />;
}

export function CardMarkIcon(){
  return (
    <svg viewBox="0 0 2500 2500" fill="#ffffff">
      <path d="M200 200L1150 200L1150 1150L200 1150Z M1350 1350L2300 1350L2300 2300L1350 2300Z M1350 200L2300 200L2300 1150L1750 1150L1350 750Z M1150 2300L200 2300L200 1350L750 1350L1150 1750Z M1350 750L1750 1150L1150 1750L750 1350Z"/>
    </svg>
  );
}

export function XIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L1 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 4h-2l12.3 16z"/>
    </svg>
  );
}

export function PhantomIcon(){
  return (
    <svg viewBox="0 0 34 34" fill="none">
      <path fill="currentColor" d="M17.5 3C9.9 3 4 9 4 16.4c0 3.1 1.1 5.9 2.9 8.1.3.4.9.3 1.1-.1 1.6-2.9 4.6-4.9 8.1-4.9h.3c.6 0 1 .5.9 1.1-.1.7-.2 1.4-.2 2.1 0 3.6 2.9 6.4 6.6 6 3.3-.3 5.9-3.2 5.9-6.6 0-.4 0-.8-.1-1.2 1-1.9 1.5-4 1.5-6.3C31 9 25 3 17.5 3z"/>
      <circle cx="13" cy="16" r="1.7" fill="#0a2a34"/>
      <circle cx="19.5" cy="16" r="1.7" fill="#0a2a34"/>
    </svg>
  );
}

export function ChevronDownIcon(){
  return (
    <svg className="wallet-chevron" viewBox="0 0 12 12" fill="currentColor">
      <path d="M2 4l4 4 4-4"/>
    </svg>
  );
}

export function CopyIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>
    </svg>
  );
}

export function BackArrowIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
}

export function CheckIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
}

export function ExplorerIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>
    </svg>
  );
}

export function DownloadIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>
    </svg>
  );
}

export function MailIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
    </svg>
  );
}

export function ClockIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>
    </svg>
  );
}

export function InstagramIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/>
    </svg>
  );
}

export function LinkedInIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9.5 9H13v1.7h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6V21h-4v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4z"/>
    </svg>
  );
}

// ---- security section icons ----
export const secIcons = [
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a5 5 0 0110 0v3"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M4.5 8.5a9 9 0 0015 0M4.5 15.5a9 9 0 0115 0" opacity=".45"/><path d="M9 3.5v17M15 3.5v17" opacity=".45"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" opacity=".45"/><path d="M3 3l18 18"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 016 6c0 6-2 9-2 9"/><path d="M12 3a6 6 0 00-6 6c0 2 .3 3.6.8 5"/><path d="M9 21c-1-2-1.5-4-1.5-6M15 21c.7-1.5 1.2-3 1.3-4.5"/><path d="M12 9v6"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M12 12l6-3" opacity=".6"/>
    </svg>
  )
];

// ---- why section icons ----
export const whyIcons = [
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8" opacity=".5"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a5 5 0 0110 0v3"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2.5 4.65-9.5 9-9.5 9z"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l3 8 4-16 3 8h4"/>
    </svg>
  ),
  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/>
    </svg>
  )
];
