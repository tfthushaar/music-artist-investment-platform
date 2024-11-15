import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">MusicInvest</h3>
          <p className="footer__description">
            Connecting artists with investors to create sustainable music careers.
          </p>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Quick Links</h4>
          <ul className="footer__list">
            <li><Link to="/market">Market</Link></li>
            <li><Link to="/artists">Artists</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Resources</h4>
          <ul className="footer__list">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Connect</h4>
          <div className="footer__social">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} MusicInvest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;