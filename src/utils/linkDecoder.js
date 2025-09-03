/**
 * Link Decoder Utility
 * 
 * This utility helps decode base64 encoded user data from product catalog links
 * sent via the instant access form emails.
 */

class LinkDecoder {
  /**
   * Decode base64 user data from URL parameter
   * @param {string} encodedData - Base64 encoded user data from URL
   * @returns {Object|null} - Decoded user data or null if invalid
   */
  static decodeUserData(encodedData) {
    try {
      if (!encodedData) {
        return null;
      }

      // Decode base64 to JSON string
      const jsonString = Buffer.from(encodedData, 'base64').toString('utf-8');
      
      // Parse JSON
      const userData = JSON.parse(jsonString);
      
      // Validate required fields
      if (!userData.name || !userData.email || !userData.timestamp) {
        console.warn('Invalid user data structure:', userData);
        return null;
      }

      // Add access time for tracking
      userData.accessedAt = new Date().toISOString();
      
      return userData;
    } catch (error) {
      console.error('Failed to decode user data:', error);
      return null;
    }
  }

  /**
   * Extract access parameter from URL
   * @param {string} url - Full URL or just query string
   * @returns {string|null} - Access parameter value or null
   */
  static extractAccessParam(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('access');
    } catch (error) {
      // If not a full URL, try parsing as query string
      const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : url);
      return params.get('access');
    }
  }

  /**
   * Get user info from current page URL (for frontend use)
   * @returns {Object|null} - User data or null
   */
  static getUserFromCurrentUrl() {
    if (typeof window === 'undefined') {
      return null; // Not in browser environment
    }

    const accessParam = this.extractAccessParam(window.location.href);
    return accessParam ? this.decodeUserData(accessParam) : null;
  }

  /**
   * Create personalized greeting from user data
   * @param {Object} userData - Decoded user data
   * @returns {string} - Personalized greeting
   */
  static createGreeting(userData) {
    if (!userData || !userData.name) {
      return 'Welcome to our product catalog!';
    }

    const timeOfDay = new Date().getHours();
    let greeting = 'Hello';
    
    if (timeOfDay < 12) {
      greeting = 'Good morning';
    } else if (timeOfDay < 17) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    return `${greeting}, ${userData.name}! Welcome to our product catalog.`;
  }

  /**
   * Validate if the access link is still valid (optional expiration check)
   * @param {Object} userData - Decoded user data
   * @param {number} validHours - Number of hours the link should be valid (default: 720 = 30 days)
   * @returns {boolean} - Whether the link is still valid
   */
  static isLinkValid(userData, validHours = 720) {
    if (!userData || !userData.timestamp) {
      return false;
    }

    const linkTime = new Date(userData.timestamp);
    const now = new Date();
    const hoursDiff = (now - linkTime) / (1000 * 60 * 60);

    return hoursDiff <= validHours;
  }

  /**
   * Log access for analytics (call this when user visits the product page)
   * @param {Object} userData - Decoded user data
   * @param {string} endpoint - Analytics endpoint URL (optional)
   */
  static async logAccess(userData, endpoint = null) {
    if (!userData) {
      return;
    }

    const accessLog = {
      name: userData.name,
      email: userData.email,
      originalTimestamp: userData.timestamp,
      accessedAt: new Date().toISOString(),
      page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };

    // Log to console for debugging
    console.log('Product catalog access:', accessLog);

    // Send to analytics endpoint if provided
    if (endpoint && typeof fetch !== 'undefined') {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accessLog)
        });
      } catch (error) {
        console.warn('Failed to log access to analytics:', error);
      }
    }
  }
}

module.exports = LinkDecoder;