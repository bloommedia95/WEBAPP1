import React, { useState } from "react";
import "./PageStyles.css";
import Footer from "./footer";
import Navbar from "./navbar";

export default function NoRefundPolicy() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const noRefundData = [
    {
      title: "General Refund Policy",
      content: "All sales are final. Once an order is placed and payment is processed, refunds will not be provided except in specific circumstances outlined in this policy. This applies to all products and services purchased through our platform."
    },
    {
      title: "Non-Refundable Items",
      content: "The following items are not eligible for refunds under any circumstances: Digital products and downloads, Personalized or custom-made items, Perishable goods, Items damaged due to misuse or normal wear, Products used beyond the trial period, Services already rendered."
    },
    {
      title: "Exceptions to No Refund Policy",
      content: "Refunds may be considered only in the following exceptional cases: Products received are significantly different from description, Items arrive damaged due to shipping issues (with photo evidence), Duplicate orders placed in error (within 24 hours), Technical errors on our end resulting in incorrect charges."
    },
    {
      title: "Exchange Policy",
      content: "While refunds are not available, we may offer exchanges for defective products within 7 days of delivery. Exchanges are subject to product availability and condition. The customer is responsible for return shipping costs unless the item was defective upon arrival."
    },
    {
      title: "Store Credit Option",
      content: "In lieu of refunds, we may offer store credit at our discretion for certain situations. Store credit is non-transferable, has no cash value, and expires 12 months from the date of issue. Store credit cannot be combined with other offers or discounts."
    },
    {
      title: "Dispute Resolution Process",
      content: "If you believe your situation qualifies for an exception, contact our customer service within 7 days of delivery. Provide order details, photos (if applicable), and detailed explanation. All refund requests are reviewed case-by-case and decisions are final."
    },
    {
      title: "Chargeback Policy",
      content: "Initiating a chargeback instead of contacting us first may result in account suspension. We reserve the right to dispute any chargeback that violates our stated policies. Customers who file illegitimate chargebacks may be banned from future purchases."
    },
    {
      title: "Contact for Disputes",
      content: "Before initiating any payment disputes, please contact our customer service team. We are committed to resolving issues fairly and promptly. Most concerns can be addressed through direct communication."
    }
  ];

  return (
    <div className="page-container">
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <div className="page-banner no-refund-banner">
        <div className="banner-content">
          <h1>No Refund Policy</h1>
          <p>Please read our refund policy carefully before making any purchases. All sales are final.</p>
        </div>
        <div className="banner-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* Content */}
      <div className="page-content">
        <div className="content-intro">
          <div className="policy-highlight">
            <h3>⚠️ Important Notice</h3>
            <p>
              By completing your purchase, you acknowledge and accept that all sales are final. 
              Refunds are not provided except in very limited circumstances as outlined below.
            </p>
          </div>
          <p>
            This No Refund Policy is effective as of the date of purchase and applies to all 
            products and services offered by Bloom E-commerce. Please review this policy 
            carefully before making any purchase.
          </p>
          <p className="last-updated">Last Updated: September 29, 2025</p>
        </div>

        <div className="accordion">
          {noRefundData.map((item, index) => (
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
          <h3>Questions About Our Policy?</h3>
          <p>If you have concerns about this policy or need to report an issue with your order, please contact us at support@bloom-ecommerce.com or call +91-XXXX-XXXXXX</p>
          <div className="policy-reminder">
            <p><strong>Remember:</strong> Contact us before initiating any payment disputes. We're here to help resolve any legitimate concerns.</p>
          </div>
        </div> */}
      </div>

      <Footer />
    </div>
  );
}