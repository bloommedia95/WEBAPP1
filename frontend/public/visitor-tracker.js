// Add this to your frontend website (not admin dashboard)
// This tracks visitors and sends data to backend

class VisitorTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.visitedPages = [];
    this.init();
  }

  generateSessionId() {
    return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  init() {
    // Track page visit
    this.trackPageVisit();
    
    // Track page changes (for SPAs)
    window.addEventListener('beforeunload', () => {
      this.trackExit();
    });
    
    // Track conversions (when order is placed)
    this.setupConversionTracking();
  }

  async trackPageVisit() {
    try {
      await fetch('/api/analytics/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          page: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.log('Visitor tracking error:', error);
    }
  }

  async trackConversion(orderId) {
    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          orderId: orderId,
          timeToConvert: Date.now() - this.startTime
        })
      });
    } catch (error) {
      console.log('Conversion tracking error:', error);
    }
  }

  setupConversionTracking() {
    // Track when order is successfully placed
    // This should be called from your checkout success page
    window.trackConversion = (orderId) => {
      this.trackConversion(orderId);
    };
  }

  trackExit() {
    // Track session duration
    const timeOnSite = Date.now() - this.startTime;
    navigator.sendBeacon('/api/analytics/exit', JSON.stringify({
      sessionId: this.sessionId,
      timeOnSite: timeOnSite,
      pagesVisited: this.visitedPages.length
    }));
  }
}

// Initialize visitor tracking
if (typeof window !== 'undefined') {
  window.visitorTracker = new VisitorTracker();
}

// Usage in checkout success page:
// window.trackConversion(orderId);