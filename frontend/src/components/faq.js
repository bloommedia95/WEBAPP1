import React, { useState } from "react";
import "./PageStyles.css";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit/debit cards (Visa, MasterCard, RuPay), UPI payments (Google Pay, PhonePe, Paytm), net banking from all major banks, and popular digital wallets. All payments are processed securely through encrypted channels.",
    },
    {
      q: "Can I return a product?",
      a: "Yes, most products are eligible for return within 7 days of delivery. Items must be in original condition with tags and packaging intact. Some items like personalized products, perishables, and intimate wear are non-returnable for hygiene reasons.",
    },
    {
      q: "How long does delivery take?",
      a: "Standard delivery usually takes 3–5 business days within major cities and 5–7 days for other locations. Express delivery (1-2 days) is available in select metro cities for an additional charge. Delivery times may vary during festive seasons.",
    },
    {
      q: "Do you charge for shipping?",
      a: "Shipping is absolutely free on orders above ₹499. For orders below ₹499, we charge a nominal shipping fee of ₹49. Premium customers and members enjoy free shipping on all orders regardless of amount.",
    },
    {
      q: "How do I track my order?",
      a: "You can track your order in real-time from the 'My Orders' section in your account dashboard. We also send tracking information via SMS and email once your order is dispatched. You'll receive live updates on pickup, transit, and delivery status.",
    },
    {
      q: "What if I receive a damaged product?",
      a: "If you receive a damaged or defective product, please contact us within 48 hours with photos of the item and packaging. We'll arrange for immediate replacement or refund. Our customer service team is available 24/7 to assist you.",
    },
    {
      q: "Do you offer customer support?",
      a: "Yes, we provide 24/7 customer support through multiple channels including live chat, email, and phone. Our dedicated support team is trained to help with orders, returns, product queries, and technical issues. We aim to resolve all queries within 24 hours.",
    },
    {
      q: "Can I cancel my order?",
      a: "Orders can be cancelled within 2 hours of placement if they haven't been dispatched. Once dispatched, you can refuse delivery or opt for return after receiving the product. Cancelled orders are refunded within 3-5 business days.",
    },
    {
      q: "Is it safe to shop on your website?",
      a: "Absolutely! Our website uses SSL encryption and follows industry-standard security protocols. We're PCI DSS compliant and partner with trusted payment gateways. Your personal and financial information is completely secure with us.",
    },
    {
      q: "Do you offer bulk discounts?",
      a: "Yes, we offer attractive bulk discounts for orders above certain quantities. Corporate clients and resellers can contact our sales team for special pricing. We also have seasonal sales, festival offers, and exclusive member discounts throughout the year.",
    }
  ];

  return (
    <div className="page-container">
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <div className="page-banner">
        <div className="banner-content">
          <h1>Frequently Asked Questions</h1>
          <p>Find quick answers to common questions about shopping, delivery, returns, and more.</p>
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
            We've compiled answers to the most frequently asked questions to help you have 
            the best shopping experience. If you can't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </div> */}

        <div className="accordion">
          {faqData.map((item, index) => (
            <div className="accordion-item" key={index}>
              <div
                className={`accordion-header ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => toggleAccordion(index)}
              >
                {item.q}
              </div>
              <div
                className="accordion-content"
                style={{
                  maxHeight: activeIndex === index ? "400px" : "0",
                }}
              >
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="contact-section">
          <h3>Still Have Questions?</h3>
          <p>Our customer support team is here to help! Contact us at support@bloom-ecommerce.com or call +91-XXXX-XXXXXX. We're available 24/7 to assist you.</p>
        </div> */}
      </div>

      <Footer />
    </div>
  );
}
