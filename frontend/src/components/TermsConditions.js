import React, { useState } from "react";
import "./PageStyles.css";
import Footer from "./footer";
import Navbar from "./navbar";

export default function TermsConditions() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const termsData = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using our website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all users, including browsers, vendors, customers, and content contributors."
    },
    {
      title: "Account Registration",
      content: "To make purchases, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account. You must notify us immediately of any unauthorized use."
    },
    {
      title: "Product Information & Pricing",
      content: "We strive to provide accurate product descriptions, images, and pricing. However, we do not guarantee that all information is error-free. Prices are subject to change without notice. In case of pricing errors, we reserve the right to cancel orders at any time."
    },
    {
      title: "Order Processing & Payment",
      content: "All orders are subject to acceptance and product availability. Payment must be completed at the time of purchase. We accept various payment methods including credit/debit cards, UPI, and digital wallets. Failed payments may result in order cancellation."
    },
    {
      title: "Shipping & Delivery",
      content: "Shipping times are estimates and may vary based on location and product availability. Risk of loss passes to you upon delivery. We are not responsible for delays caused by third-party shipping services or circumstances beyond our control."
    },
    {
      title: "Returns & Refunds",
      content: "Returns are accepted within 7 days of delivery for eligible products in original condition. Refunds will be processed to the original payment method within 5-10 business days after we receive the returned item. Shipping charges are non-refundable except in cases of our error."
    },
    {
      title: "User Conduct",
      content: "You agree not to use our services for any unlawful purpose or in violation of these terms. Prohibited activities include fraud, harassment, spam, or any action that could harm our systems or other users. We reserve the right to terminate accounts for violations."
    },
    {
      title: "Intellectual Property",
      content: "All content on our website, including text, images, logos, and software, is protected by intellectual property rights. You may not copy, modify, distribute, or use our content without written permission. User-generated content grants us a license to use as needed for our services."
    },
    {
      title: "Limitation of Liability",
      content: "Our liability is limited to the maximum extent permitted by law. We are not responsible for indirect, incidental, or consequential damages. Our total liability for any claim shall not exceed the amount you paid for the product or service in question."
    }
  ];

  return (
    <div className="page-container">
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <div className="page-banner">
        <div className="banner-content">
          <h1>Terms & Conditions</h1>
          <p>Please read these terms carefully before using our services. Your use constitutes acceptance of these terms.</p>
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
            These Terms and Conditions govern your use of Bloom E-commerce website and services. 
            By accessing or using our platform, you agree to comply with and be bound by these terms. 
            Please review them carefully.
          </p>
          <p className="last-updated">Last Updated: September 29, 2025</p>
        </div> */}

        <div className="accordion">
          {termsData.map((item, index) => (
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
          <h3>Need Clarification?</h3>
          <p>If you have questions about these Terms and Conditions, please contact us at legal@bloom-ecommerce.com or call +91-XXXX-XXXXXX</p>
        </div> */}
      </div>

      <Footer />
    </div>
  );
}