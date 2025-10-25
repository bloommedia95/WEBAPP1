import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const footerData = {
    quickLinks: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Blog", path: "/blog" },
      { name: "Contact Us", path: "/helpcenter" },
    ],
    customerSupport: [
      { name: "FAQ", path: "/faq" },
      { name: "Shipping & Delivery", path: "/shipping-delivery" },
      { name: "Returns & Exchanges", path: "/no-refund-policy" },
      { name: "Order Tracking", path: "/order-tracking" },
      { name: "Payment Options", path: "/save-card" },
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms & Conditions", path: "/terms-conditions" },
    ],
    categories: [
      { name: "Fashion", path: "/categories/Clothing" },
      { name: "Footwear", path: "/categories/Footwear" },
      { name: "Bags", path: "/categories/Bags" },
      { name: "Beauty", path: "/categories/Cosmetic" },
      { name: "Accessories", path: "/categories/Acessiories" },
    ],
    followUs: [
      { name: "Instagram", icon: "/img/insta.png", url: "https://instagram.com" },
      { name: "Facebook", icon: "/img/facebook.png", url: "https://facebook.com" },
      { name: "Youtube", icon: "/img/youtube.png", url: "https://youtube.com" },
      { name: "Twitter", icon: "/img/twitter.png", url: "https://twitter.com" },
    ],
    trustBadges: [
      "/img/footer1(1).png",
      "/img/footer1(2).png",
      "/img/footer1(3).png",
    ],
    paymentIcons: [
      "/img/visa.jpg",
      "/img/razorpay.jpg",
      "/img/paypal.jpg",
      "/img/mastercard.jpg",
    ],
  };

  return (
    <div>
      <footer className="footer">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              {footerData.quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4>Customer Support</h4>
            <ul>
              {footerData.customerSupport.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4>Categories</h4>
            <ul>
              {footerData.categories.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column follow">
            <h4>Follow Us</h4>
            <ul>
              {footerData.followUs.map((social, i) => (
                <li key={i}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="social-icon"
                    />{" "}
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-icons">
          {footerData.trustBadges.map((badge, i) => (
            <img key={i} src={badge} alt={`Trust Badge ${i + 1}`} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© 2025 Bloom Media. All Rights Reserved.</p>
            <div className="payment-icons">
              {footerData.paymentIcons.map((icon, i) => (
                <img key={i} src={icon} alt={`Payment ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
