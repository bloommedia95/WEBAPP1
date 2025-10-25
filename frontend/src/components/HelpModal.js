// src/components/HelpModal.js
import React, { useState } from 'react';
import { X, Search, MessageCircle, Phone, Mail, ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import './HelpCenter.css';

const HelpModal = ({ onClose, returnToLogin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // FAQ Data
  const faqCategories = [
    {
      id: 'login',
      title: 'Login & Account Issues',
      icon: '🔐',
      faqs: [
        {
          id: 1,
          question: 'I am not receiving OTP on my email/phone',
          answer: 'Please check your spam/junk folder for emails. For phone numbers, ensure you have good network coverage. You can also try resending the OTP after 60 seconds.'
        },
        {
          id: 2,
          question: 'OTP expired or invalid',
          answer: 'OTP is valid for 10 minutes only. If it expires, please request a new OTP. Make sure you enter the latest OTP received.'
        },
        {
          id: 3,
          question: 'Cannot login to my account',
          answer: 'Ensure you are using the correct email/phone number. Try clearing browser cache or use incognito mode. If issue persists, contact support.'
        },
        {
          id: 4,
          question: 'How to change my registered email/phone?',
          answer: 'Go to Profile Settings → Contact Information → Update your email or phone number. You will need to verify the new contact through OTP.'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Orders & Delivery',
      icon: '📦',
      faqs: [
        {
          id: 5,
          question: 'How to track my order?',
          answer: 'Go to "My Orders" section in your account. Click on the order to view detailed tracking information with real-time updates.'
        },
        {
          id: 6,
          question: 'Can I cancel or modify my order?',
          answer: 'You can cancel orders before they are shipped. Modifications are not possible once order is confirmed. Check order status for cancellation options.'
        },
        {
          id: 7,
          question: 'Delivery charges and time',
          answer: 'Free delivery on orders above ₹999. Standard delivery takes 5-7 business days. Express delivery available at additional cost.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      icon: '💳',
      faqs: [
        {
          id: 8,
          question: 'Payment failed but amount deducted',
          answer: 'If payment fails but amount is deducted, it will be automatically refunded within 5-7 business days. Contact bank if delay occurs.'
        },
        {
          id: 9,
          question: 'How long does refund take?',
          answer: 'Refunds are processed within 7-10 business days to your original payment method. UPI/Wallet refunds are faster (1-3 days).'
        },
        {
          id: 10,
          question: 'Available payment methods',
          answer: 'We accept Credit/Debit Cards, UPI, Net Banking, Wallets (PayTM, PhonePe), and Cash on Delivery (COD).'
        }
      ]
    },
    {
      id: 'general',
      title: 'General Support',
      icon: '❓',
      faqs: [
        {
          id: 11,
          question: 'How to use coupons and offers?',
          answer: 'Apply coupon code at checkout. Check "My Coupons" section for available offers. Some offers auto-apply based on cart value.'
        },
        {
          id: 12,
          question: 'Size exchange and returns',
          answer: 'Easy returns within 30 days. Size exchange available for most products. Check product page for return policy details.'
        },
        {
          id: 13,
          question: 'Product warranty information',
          answer: 'Warranty varies by product and brand. Check product description for warranty details. Keep purchase invoice for warranty claims.'
        }
      ]
    }
  ];

  // Contact options
  const contactOptions = [
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: 'Get instant help',
      icon: <MessageCircle size={24} />,
      color: '#00d4aa',
      action: () => alert('Live chat feature coming soon! 💬\n\nFor now, please email us at support@bloom.com')
    },
    {
      id: 'phone',
      title: 'Call Us',
      subtitle: '1800-123-BLOOM',
      icon: <Phone size={24} />,
      color: '#ff6b9d',
      action: () => window.open('tel:1800123256669')
    },
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'support@bloom.com',
      icon: <Mail size={24} />,
      color: '#c471ed',
      action: () => window.open('mailto:support@bloom.com?subject=Help%20Required%20-%20Bloom%20E-Commerce')
    }
  ];

  // Filter FAQs based on search
  const filteredFAQs = selectedCategory 
    ? faqCategories.find(cat => cat.id === selectedCategory)?.faqs || []
    : faqCategories.flatMap(cat => 
        cat.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="modal-overlay">
      <div className="help-center-modal">
        {/* Header */}
        <div className="help-header">
          {selectedCategory && (
            <button 
              className="back-btn" 
              onClick={() => setSelectedCategory(null)}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="header-content">
            <h2>🌸 Help Center</h2>
            <p>How can we help you today?</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="help-content">
          {!selectedCategory && !searchQuery ? (
            <>
              {/* Categories */}
              <div className="categories-section">
                <h3>Browse Topics</h3>
                <div className="categories-grid">
                  {faqCategories.map(category => (
                    <div
                      key={category.id}
                      className="category-card"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="category-icon">{category.icon}</div>
                      <h4>{category.title}</h4>
                      <p>{category.faqs.length} articles</p>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Options */}
              <div className="contact-section">
                <h3>Contact Support</h3>
                <div className="contact-grid">
                  {contactOptions.map(option => (
                    <div
                      key={option.id}
                      className="contact-card"
                      onClick={option.action}
                      style={{ borderLeft: `4px solid ${option.color}` }}
                    >
                      <div className="contact-icon" style={{ color: option.color }}>
                        {option.icon}
                      </div>
                      <div className="contact-info">
                        <h4>{option.title}</h4>
                        <p>{option.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* FAQ List */
            <div className="faq-section">
              {selectedCategory && (
                <div className="category-header">
                  <h3>
                    {faqCategories.find(cat => cat.id === selectedCategory)?.icon}
                    {faqCategories.find(cat => cat.id === selectedCategory)?.title}
                  </h3>
                </div>
              )}
              
              {searchQuery && (
                <div className="search-results">
                  <p>Search results for "{searchQuery}"</p>
                </div>
              )}

              <div className="faq-list">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map(faq => (
                    <div key={faq.id} className="faq-item">
                      <button
                        className="faq-question"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <HelpCircle size={18} />
                        <span>{faq.question}</span>
                        <ChevronRight 
                          size={16} 
                          className={expandedFAQ === faq.id ? 'rotated' : ''}
                        />
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <HelpCircle size={48} />
                    <h4>No results found</h4>
                    <p>Try searching with different keywords or browse categories above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="help-footer">
          <div className="footer-content">
            <p>Still need help?</p>
            <div className="footer-actions">
              <button 
                className="back-to-login-btn"
                onClick={returnToLogin}
              >
                Back to Login
              </button>
              <button 
                className="contact-support-btn"
                onClick={contactOptions[0].action}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;