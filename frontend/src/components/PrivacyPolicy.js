import React, { useState } from "react";
import "./PageStyles.css";
import Footer from "./footer";
import Navbar from "./navbar";

export default function PrivacyPolicy() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const privacyData = [
    {
      title: "Information We Collect",
      content: "We collect personal information such as your name, email address, phone number, shipping address, and payment details when you create an account, make a purchase, or contact us. We also collect non-personal information like browser type, IP address, and browsing behavior to improve our services."
    },
    {
      title: "How We Use Your Information",
      content: "We use your information to process orders, communicate with you about purchases, provide customer support, send promotional emails (with your consent), improve our website and services, and comply with legal obligations."
    },
    {
      title: "Information Sharing",
      content: "We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers (payment processors, shipping companies) only to fulfill your orders. We may also disclose information when required by law or to protect our rights."
    },
    {
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your personal information. This includes SSL encryption for data transmission, secure payment processing, regular security audits, and restricted access to your data within our organization."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can opt-out of promotional emails at any time. For any privacy-related requests, please contact our customer support team."
    },
    {
      title: "Cookies and Tracking",
      content: "We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can manage cookie preferences through your browser settings. Some features may not work properly if cookies are disabled."
    }
  ];

  return (
    <div className="page-container">
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <div className="page-banner">
        <div className="banner-content">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us. Learn how we collect, use, and protect your information.</p>
        </div>
        <div className="banner-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* Content */}
      <div className="page-content">
        {/* <div className="content-intro">
          <p>
            At Bloom E-commerce, we are committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy explains how we 
            collect, use, and safeguard your data when you use our services.
          </p>
          <p className="last-updated">Last Updated: September 29, 2025</p>
        </div> */}

        <div className="accordion">
          {privacyData.map((item, index) => (
            <div className="accordion-item" key={index}>
              <div
                className={`accordion-header ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => toggleAccordion(index)}
              >
                {item.title}
              </div>
              <div
                className="accordion-content"
                style={{
                  maxHeight: activeIndex === index ? "400px" : "0",
                }}
              >
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="contact-section">
          <h3>Questions About Privacy?</h3>
          <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us at privacy@bloom-ecommerce.com or call +91-XXXX-XXXXXX</p>
        </div> */}
      </div>

      <Footer />
    </div>
  );
}