import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Phone, Mail, ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import "./first.css";
import "./HelpCenter.css";
import Navbar from "./navbar";
import Footer from "./footer";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";

function HelpCenter() {
  const [showLogin, setShowLogin] = useState(false);
  // FAQ related states from HelpModal
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpCategories, setHelpCategories] = useState([]);
  const [queryButtons, setQueryButtons] = useState([]);
  // ⭐ State for storing ratings
  const [ratings, setRatings] = useState({});
  // ⭐ Dynamic state variables
  const [loadingFAQs, setLoadingFAQs] = useState(false);
  const [contactMethods, setContactMethods] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // FAQ Data from HelpModal
  const faqCategories = [
    {
      id: 'cancel-return-exchange',
      title: 'Cancel, Return & Exchange',
      icon: '�',
      faqs: [
        {
          id: 1,
          question: 'How to cancel my order?',
          answer: 'You can cancel your order from "My Orders" section if it hasn\'t been shipped yet. Click on the order → "Cancel Order" → Select reason → Confirm cancellation. Refund will be processed within 5-7 business days.'
        },
        {
          id: 2,
          question: 'Return policy and process',
          answer: 'Items can be returned within 7 days of delivery. Go to "My Orders" → Select item → "Return" → Choose reason → Schedule pickup. Items should be unused, with original tags and packaging.'
        },
        {
          id: 3,
          question: 'How to exchange an item?',
          answer: 'Go to "My Orders" → Select item → "Exchange" → Choose new size/color → Schedule pickup. Exchange is free for size/color issues. New item will be shipped after we receive the original item.'
        },
        {
          id: 4,
          question: 'Return pickup not available in my area',
          answer: 'If return pickup is not available, you can ship the item to our return address. Contact customer support for return shipping label and detailed instructions.'
        },
        {
          id: 5,
          question: 'Damaged or wrong item received',
          answer: 'Report damaged or wrong items within 24 hours of delivery. Go to "My Orders" → "Report Issue" → Upload photos → We\'ll arrange immediate replacement or full refund.'
        },
        {
          id: 6,
          question: 'Exchange vs Return - What\'s the difference?',
          answer: 'Return: Get full refund to original payment method. Exchange: Get same item in different size/color. Returns take 7-10 days for refund. Exchanges take 5-7 days for new item delivery.'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Orders & Delivery',
      icon: '📦',
      faqs: [
        {
          id: 7,
          question: 'How to track my order?',
          answer: 'Go to "My Orders" section in your account. Click on the order to view detailed tracking information with real-time updates.'
        },
        {
          id: 8,
          question: 'Can I cancel or modify my order?',
          answer: 'You can cancel orders before they are shipped. Modifications are not possible once order is confirmed. Check order status for cancellation options.'
        },
        {
          id: 9,
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
          id: 10,
          question: 'Payment failed but amount deducted',
          answer: 'If payment fails but amount is deducted, it will be automatically refunded within 5-7 business days. Contact bank if delay occurs.'
        },
        {
          id: 11,
          question: 'How long does refund take?',
          answer: 'Refunds are processed within 7-10 business days to your original payment method. UPI/Wallet refunds are faster (1-3 days).'
        },
        {
          id: 12,
          question: 'Available payment methods',
          answer: 'We accept Credit/Debit Cards, UPI, Net Banking, Wallets (PayTM, PhonePe), and Cash on Delivery (COD).'
        }
      ]
    }
  ];

  // Helper functions from HelpModal
  const filteredFAQs = selectedCategory
    ? faqCategories.find(cat => cat.id === selectedCategory)?.faqs || []
    : faqCategories.flatMap(cat => cat.faqs)
        .filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // ⭐ Dynamic search function with real-time results
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Real-time search across all content
      const results = faqCategories.flatMap(cat => 
        cat.faqs.filter(faq => 
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
        ).map(faq => ({ 
          ...faq, 
          category: cat.title,
          categoryId: cat.id,
          categoryIcon: cat.icon
        }))
      );
      
      setSearchResults(results);
      
      // Add to recent searches only if we have results
      if (results.length > 0) {
        const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('helpCenterSearches', JSON.stringify(updatedSearches));
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // ⭐ Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // ⭐ Initialize dynamic data
  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('helpCenterSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // Initialize contact methods dynamically
    setContactMethods([
      {
        icon: MessageCircle,
        title: 'Live Chat',
        description: 'Chat with our support team',
        action: 'chat',
        color: '#4CAF50',
        available: true,
        responseTime: 'Usually responds in 2-3 minutes'
      },
      {
        icon: Phone,
        title: 'Call Us',
        description: '+91 8983-XXX-XXX',
        action: 'call',
        color: '#2196F3',
        available: true,
        responseTime: 'Available 24/7'
      },
      {
        icon: Mail,
        title: 'Email Support',
        description: 'support@bloom.com',
        action: 'email',
        color: '#FF9800',
        available: true,
        responseTime: 'Usually responds within 2-4 hours'
      }
    ]);
  }, []);

  // ⭐ Debug user info and load user-specific data
  useEffect(() => {
    console.log('Current user:', user);
    console.log('User ID:', user?._id || user?.id);
    console.log('Auth token:', user?.token || localStorage.getItem('authToken'));
    
    // Load user-specific support data
    if (user) {
      loadUserSupportData();
    }
  }, [user]);

  // ⭐ Load user-specific support data
  const loadUserSupportData = async () => {
    try {
      // Load support tickets count
      const ticketsResponse = await fetch(`http://localhost:5000/api/support/tickets/user/${user._id || user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token || localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json();
        setSupportTickets(ticketsData.tickets || []);
        setNotificationCount(ticketsData.unreadCount || 0);
      }
    } catch (error) {
      console.log('Could not load user support data:', error);
    }
  };

  // ⭐ Fetch user orders from API
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log('Fetching orders for user:', user._id || user.id);
        
        const response = await fetch(`http://localhost:5000/api/orders/user/${user._id || user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token || localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          setOrders(data.orders || data || []);
        } else {
          console.error('Failed to fetch orders, using sample data');
          // Fallback sample data for testing
          setSampleOrders();
        }
      } catch (error) {
        console.error('Error fetching orders, using sample data:', error);
        // Fallback sample data for testing
        setSampleOrders();
      } finally {
        setLoading(false);
      }
    };

    const setSampleOrders = () => {
      const sampleOrders = [
        {
          _id: 'sample1',
          orderStatus: 'Delivered',
          createdAt: '2025-08-05T10:30:00Z',
          deliveredAt: '2025-08-08T14:20:00Z',
          totalAmount: 2999,
          items: [
            {
              product: {
                _id: 'prod1',
                title: 'Women Open Toe Flats',
                brand: 'Bata Store',
                img: ['/img/footwear1.png']
              },
              selectedSize: 'UK7',
              quantity: 1
            }
          ],
          rating: 0
        },
        {
          _id: 'sample2',
          orderStatus: 'Shipped',
          createdAt: '2025-08-15T09:15:00Z',
          totalAmount: 1599,
          items: [
            {
              product: {
                _id: 'prod2',
                title: 'Floral Print Midi Dress',
                brand: 'Lifestyle Store',
                img: ['/img/clothing6.png']
              },
              selectedSize: 'L',
              quantity: 1
            }
          ],
          rating: 0
        },
        {
          _id: 'sample3',
          orderStatus: 'Processing',
          createdAt: '2025-09-20T16:45:00Z',
          totalAmount: 2499,
          items: [
            {
              product: {
                _id: 'prod3',
                title: 'High-Rise Wide Leg Jeans',
                brand: 'H&M',
                img: ['/img/clothing7.png']
              },
              selectedSize: '32',
              quantity: 1
            }
          ],
          rating: 0
        }
      ];
      setOrders(sampleOrders);
    };

    fetchUserOrders();
  }, [user]);

  // ⭐ Fetch help categories and query buttons
  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        // Set default data first
        setHelpCategories([
          {
            id: 1,
            icon: "/img/profile (5).png",
            title: "Track, Cancel, Return, Exchange",
            description: "Manage Your Purchase",
            buttonText: "Orders",
            action: "orders"
          }
        ]);
        
        setQueryButtons([
          { id: 1, text: "Order Related Queries", action: "order-queries" },
          { id: 2, text: "Non-Order Related Queries", action: "general-queries" },
          { id: 3, text: "Recent Issues", action: "recent-issues" }
        ]);

        // Try to fetch from API
        try {
          const categoriesResponse = await fetch('http://localhost:5000/api/help/categories');
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            setHelpCategories(categoriesData.categories || []);
          }

          const queryResponse = await fetch('http://localhost:5000/api/help/query-buttons');
          if (queryResponse.ok) {
            const queryData = await queryResponse.json();
            setQueryButtons(queryData.buttons || []);
          }
        } catch (apiError) {
          console.log('API not available, using default data');
        }
      } catch (error) {
        console.error('Error setting help data:', error);
      }
    };

    fetchHelpData();
  }, []);

  // ⭐ Rating submission to API
  const handleRating = async (orderId, stars) => {
    setRatings((prev) => ({ ...prev, [orderId]: stars }));
    
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/rating`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token || localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: stars })
      });

      if (response.ok) {
        console.log('Rating submitted successfully');
      } else {
        console.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // ⭐ Dynamic action handlers
  const handleActionClick = async (action) => {
    try {
      // Track user interaction
      await fetch('http://localhost:5000/api/analytics/help-action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token || localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, userId: user?._id || user?.id, timestamp: new Date() })
      });

      // Handle different actions dynamically
      switch (action) {
        case 'orders':
          window.location.href = '/order-details';
          break;
        case 'size-guide':
          // Show size guide modal or navigate
          console.log('Opening size guide...');
          break;
        case 'offers':
          window.location.href = '/coupons';
          break;
        case 'delivery':
          // Show delivery tracking
          console.log('Opening delivery tracking...');
          break;
        case 'chat':
          // Start live chat
          startLiveChat();
          break;
        case 'call':
          // Show call modal with number
          showCallModal();
          break;
        case 'email':
          // Open email compose
          window.location.href = 'mailto:support@bloom.com';
          break;
        default:
          console.log('Action:', action);
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };

  // ⭐ Start live chat function
  const startLiveChat = () => {
    // Simulate starting live chat
    alert('Live chat is starting... Please wait while we connect you to a support agent.');
    // In real implementation, this would open a chat widget
  };

  // ⭐ Show call modal
  const showCallModal = () => {
    const callNow = window.confirm('Call us at +91 8983-XXX-XXX\n\nOur support team is available 24/7 to help you.');
    if (callNow) {
      window.location.href = 'tel:+918983XXXXXX';
    }
  };

  // ⭐ Handle FAQ category selection with analytics
  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Track category selection
    try {
      await fetch('http://localhost:5000/api/analytics/faq-category', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token || localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryId, userId: user?._id || user?.id, timestamp: new Date() })
      });
    } catch (error) {
      console.log('Analytics tracking failed:', error);
    }
  };

  // ⭐ Handle search with recent searches
  const handleSearchSelect = (searchTerm) => {
    setSearchQuery(searchTerm);
    setShowSearchDropdown(false);
    
    // Find and expand the first matching FAQ
    const matchingFAQ = faqCategories.flatMap(cat => 
      cat.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )[0];
    
    if (matchingFAQ) {
      // Find which category this FAQ belongs to
      const category = faqCategories.find(cat => 
        cat.faqs.some(faq => faq.id === matchingFAQ.id)
      );
      
      if (category) {
        // Set the category first
        setSelectedCategory(category.id);
        // Then expand the specific FAQ
        setExpandedFAQ(matchingFAQ.id);
        
        // Scroll to FAQ section after a short delay
        setTimeout(() => {
          const faqElement = document.querySelector(`[data-faq-id="${matchingFAQ.id}"]`);
          if (faqElement) {
            faqElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  };

  // ⭐ Handle search result click
  const handleSearchResultClick = (result) => {
    // Find which category this FAQ belongs to
    const category = faqCategories.find(cat => 
      cat.faqs.some(faq => faq.id === result.id)
    );
    
    if (category) {
      // Set the category first
      setSelectedCategory(category.id);
      // Then expand the specific FAQ
      setExpandedFAQ(result.id);
    }
    
    // Clear search
    setSearchQuery('');
    setShowSearchDropdown(false);
    setSearchResults([]);
    
    // Scroll to FAQ section after a short delay
    setTimeout(() => {
      const faqElement = document.querySelector(`[data-faq-id="${result.id}"]`);
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // ⭐ Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setShowSearchDropdown(false);
    setExpandedFAQ(null);
  };

  // ⭐ Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ⭐ Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    return date.toLocaleDateString('en-GB', options);
  };

  // ⭐ Calculate return window
  const getReturnStatus = (orderDate, deliveredDate) => {
    if (!deliveredDate) return '';
    const delivered = new Date(deliveredDate);
    const returnWindow = new Date(delivered);
    returnWindow.setDate(returnWindow.getDate() + 7); // 7 days return window
    
    const now = new Date();
    if (now > returnWindow) {
      return `• Exchange and return window closed on ${formatDate(returnWindow)}`;
    } else {
      return `• Return/Exchange available until ${formatDate(returnWindow)}`;
    }
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div style={{ padding: '40px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Help Center</h1>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '30px', 
              borderRadius: '10px', 
              marginTop: '30px' 
            }}>
              <h3>Please Login to Get Support</h3>
              <p style={{ margin: '20px 0', color: '#666' }}>
                You need to be logged in to access personalized help and support.
              </p>
              <button 
                onClick={() => setShowLogin(true)}
                style={{
                  background: '#FF0004',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Login / Signup
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="order-container">
        {/* Sidebar */}
        <aside className="order-sidebar">
          <h3>Account</h3>
          <p className="username">{user?.name || user?.email}</p>
          <ul>
            <li><Link to="/order-details">Order Detail</Link></li>
            <li><Link to="/saved-address">Saved Address</Link></li>
            <li><Link to="/save-card">Saved Cards & UPI</Link></li>
            <li><Link to="/coupons">Coupons</Link></li>
            <li className="active">Help Center</li>
            <li><Link to="/editprofile">Edit Profile</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </aside>
        <main className="main">

            {/* Gradient Banner like in screenshot */}
          <div style={{
            background: 'linear-gradient(135deg, #ff6ba8 0%, #74b9ff 50%, #00cec9 100%)',
            padding: '30px',
            borderRadius: '15px',
            margin: '20px 0',
            color: 'white',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600' }}>
              Help Center
            </h2>
            <p style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>
              How can we help you with your Bloom shopping experience today?
            </p>
          </div>
          


        {/* Main Content */}
        <main className="saved-address-main">
        

          {/* FAQ Section */}
            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              marginBottom: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '600' }}>
                Frequently Asked Questions
                {notificationCount > 0 && (
                  <span style={{
                    marginLeft: '10px',
                    backgroundColor: '#FF0004',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {notificationCount} new
                  </span>
                )}
              </h3>
              
              <div style={{ position: 'relative' }} className="search-container">
                <div style={{
                  position: 'relative',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '25px',
                  padding: '12px 20px 12px 45px',
                  border: '1px solid #e9ecef'
                }}>
                  <Search size={18} style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d'
                  }} />
                  <input
                    type="text"
                    placeholder="Search for help topics, order issues, payments..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6c757d',
                        fontSize: '16px'
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Recent Searches */}
                {showSearchDropdown && !searchQuery && recentSearches.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    marginTop: '5px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '10px 15px', borderBottom: '1px solid #e9ecef', fontSize: '12px', color: '#666', fontWeight: '600' }}>
                      Recent Searches
                    </div>
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        onClick={() => handleSearchSelect(search)}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          borderBottom: index < recentSearches.length - 1 ? '1px solid #f8f9fa' : 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        🔍 {search}
                      </div>
                    ))}
                  </div>
                )}

                {/* Search Results */}
                {showSearchDropdown && searchQuery && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    marginTop: '5px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {isSearching ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        🔍 Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #e9ecef', fontSize: '12px', color: '#666', fontWeight: '600' }}>
                          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                        </div>
                        {searchResults.map((result, index) => (
                          <div
                            key={result.id}
                            onClick={() => handleSearchResultClick(result)}
                            style={{
                              padding: '12px 15px',
                              cursor: 'pointer',
                              borderBottom: index < searchResults.length - 1 ? '1px solid #f8f9fa' : 'none',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <span style={{ fontSize: '16px', marginTop: '2px' }}>{result.categoryIcon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px', lineHeight: '1.3' }}>
                                {result.question}
                              </div>
                              <div style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>in</span>
                                <span style={{ fontWeight: '500', color: '#007bff' }}>{result.category}</span>
                              </div>
                            </div>
                            <ChevronRight size={12} style={{ color: '#6c757d', marginTop: '4px' }} />
                          </div>
                        ))}
                      </>
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        <div>❌ No results found</div>
                        <div style={{ fontSize: '12px', marginTop: '5px' }}>
                          Try searching for different terms or browse categories below
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {!selectedCategory ? (
              <>
                {/* FAQ Categories */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div className="helpcenter-hover-box" style={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedCategory('cancel-return-exchange')}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>�</div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Cancel, Return & Exchange</h4>
                    <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>6 articles</p>
                    <button style={{
                      background: '#FF0004',
                      color: 'white',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      VIEW ARTICLES
                    </button>
                  </div>

                  <div className="helpcenter-hover-box" style={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedCategory('orders')}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>📦</div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Orders & Delivery</h4>
                    <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>3 articles</p>
                    <button style={{
                      background: '#FF0004',
                      color: 'white',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      VIEW ARTICLES
                    </button>
                  </div>

                  <div className="helpcenter-hover-box" style={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedCategory('payments')}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>💳</div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Payments & Refunds</h4>
                    <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>3 articles</p>
                    <button style={{
                      background: '#FF0004',
                      color: 'white',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      VIEW ARTICLES
                    </button>
                  </div>
                </div>

                {/* Contact Support */}
                <div>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Still need help?</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                  }}>
                    <div className="helpcenter-hover-box" style={{
                      textAlign: 'center',
                      padding: '20px',
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => handleActionClick('chat')}>
                      <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        backgroundColor: '#4CAF50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        margin: '0 auto 10px auto'
                      }}>
                        <MessageCircle size={16} />
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Live Chat</h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Chat with our support team</p>
                      <p style={{ margin: '0 0 15px 0', fontSize: '10px', color: '#4CAF50', fontWeight: '600' }}>
                        • Online - Usually responds in 2-3 minutes
                      </p>
                      {/* <button style={{
                        background: '#FF0004',
                        color: 'white',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#E60004'}
                      onMouseLeave={(e) => e.target.style.background = '#FF0004'}>
                        START CHAT
                      </button> */}
                    </div>

                    <div className="helpcenter-hover-box" style={{
                      textAlign: 'center',
                      padding: '20px',
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        backgroundColor: '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        margin: '0 auto 10px auto'
                      }}>
                        <Phone size={16} />
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Call Us</h4>
                      <p style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#666' }}>+91 6983-XXX-XXX</p>
                      {/* <button style={{
                        background: '#FF0004',
                        color: 'white',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        CALL NOW
                      </button> */}
                    </div>

                    <div className="helpcenter-hover-box" style={{
                      textAlign: 'center',
                      padding: '20px',
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        backgroundColor: '#FF9800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        margin: '0 auto 10px auto'
                      }}>
                        <Mail size={16} />
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Email Support</h4>
                      <p style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#666' }}>support@bloom.com</p>
                      {/* <button style={{
                        background: '#FF0004',
                        color: 'white',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        SEND EMAIL
                      </button> */}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* FAQ Detail View */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to categories
                </button>

                <div>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>
                    {faqCategories.find(cat => cat.id === selectedCategory)?.title}
                  </h3>
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} data-faq-id={faq.id} style={{
                      marginBottom: '15px',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '15px',
                          background: '#f8f9fa',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <span>{faq.question}</span>
                        <ChevronRight 
                          size={16} 
                          style={{
                            transform: expandedFAQ === faq.id ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}
                        />
                      </button>
                      {expandedFAQ === faq.id && (
                        <div style={{
                          padding: '15px',
                          backgroundColor: '#fff',
                          borderTop: '1px solid #e9ecef'
                        }}>
                          <p style={{ margin: '0', fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Orders Section - Bottom of page like in screenshot */}
          <div style={{
            backgroundColor: '#fff',
            padding: '40px 20px',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {orders.length === 0 ? (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '15px', opacity: '0.5' }}>📦</div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>No orders found</h3>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  When you place your first order, it will appear here for easy tracking and support.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', textAlign: 'left' }}>Your Recent Orders</h3>
                {orders.slice(0, 3).map((order) => (
                  <div key={order._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flex: 1
                    }}>
                      <img src="/img/profile (5).png" alt="status" style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>{order.orderStatus || 'Processing'}</span>
                      <span style={{ fontSize: '11px', color: '#666' }}>{formatDate(order.createdAt)}</span>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={order.items[0].product?.img?.[0] || "/img/default-product.png"} 
                          alt={order.items[0].product?.title || 'Product'} 
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ margin: '0 0 2px 0', fontSize: '12px', fontWeight: '500' }}>
                            {order.items[0].product?.title || 'Product'}
                          </p>
                          <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>
                            Size: {order.items[0].selectedSize} | Qty: {order.items[0].quantity} | ₹{order.totalAmount}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          </main>
        </main>
      </div>

      <Footer />
        </>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default HelpCenter;