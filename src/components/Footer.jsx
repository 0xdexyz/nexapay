import { XIcon, InstagramIcon, LinkedInIcon, MailIcon, ClockIcon } from './Icons.jsx';

export default function Footer({ onApplyOpen }){
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo">NEXAPAY <span className="divider"></span></div>
          <p>A crypto-native card built to make everyday spending with digital assets simple.</p>
          <div className="footer-social">
            <a href="https://x.com/TryNexapay" target="_blank" rel="noopener" aria-label="X (Twitter)"><XIcon /></a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#apply" onClick={(e) => { e.preventDefault(); onApplyOpen(); }}>Card</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Virtual Card</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Physical Card</a></li>
            <li><a href="#why">Features</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Pricing</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#" onClick={(e) => e.preventDefault()}>About</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>How It Works</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Blog</a></li>
          </ul>
        </div>

        <div className="footer-col footer-support">
          <h4>Support</h4>
          <div className="row" style={{ fontWeight: 600 }}>Need help with your card or wallet?</div>
          <div className="row">
            <MailIcon />
            <a href="mailto:support@nexapay.io">support@nexapay.io</a>
          </div>
          <div className="row">
            <ClockIcon />
            <span>Live chat, 24/7</span>
          </div>
          <a href="#" className="btn btn-gold footer-mini-btn" onClick={(e) => e.preventDefault()}>Get support</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Nexapay Card. All rights reserved.</span>
        <div className="legal">
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Cookies</a>
        </div>
      </div>
    </footer>
  );
}
