import React from 'react';
import './LegalPage.css';

// TODO: Update all instances of 'CustomCraft' with actual business name once decided
const CookiePolicy: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Cookie Policy</h1>
      <p className="last-updated">Last Updated: January 11, 2026</p>

      <p>
        This Cookie Policy explains how CustomCraft uses cookies and similar tracking technologies when you visit our
        website. By using our website, you consent to the use of cookies as described in this policy.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your device when you visit a website. They help websites
        remember your preferences, improve your browsing experience, and provide analytics about website usage.
      </p>

      <h2>2. Types of Cookies We Use</h2>

      <h3>2.1 Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function properly. They enable core functionality such as
        security, network management, and accessibility. You cannot opt out of these cookies.
      </p>
      <ul>
        <li>Session authentication</li>
        <li>Shopping cart functionality</li>
        <li>Security and fraud prevention</li>
        <li>Load balancing</li>
      </ul>

      <h3>2.2 Performance and Analytics Cookies</h3>
      <p>
        These cookies collect information about how visitors use our website, such as which pages are visited most often
        and if users receive error messages. This helps us improve website performance and user experience.
      </p>
      <ul>
        <li>Google Analytics (traffic analysis and user behavior)</li>
        <li>Page load time monitoring</li>
        <li>Error tracking and diagnostics</li>
      </ul>

      <h3>2.3 Functionality Cookies</h3>
      <p>
        These cookies allow our website to remember choices you make (such as language preferences or region) and
        provide enhanced, personalized features.
      </p>
      <ul>
        <li>Language and region preferences</li>
        <li>Text size and display preferences</li>
        <li>Previously viewed products</li>
        <li>Custom design tool preferences</li>
      </ul>

      <h3>2.4 Marketing and Targeting Cookies</h3>
      <p>
        These cookies track your browsing habits to deliver advertisements that are relevant to you and your interests.
        They also help us measure the effectiveness of advertising campaigns.
      </p>
      <ul>
        <li>Retargeting and remarketing campaigns</li>
        <li>Social media integration (Facebook, Instagram, Pinterest)</li>
        <li>Advertising performance measurement</li>
        <li>Personalized product recommendations</li>
      </ul>

      <h2>3. Third-Party Cookies</h2>
      <p>
        Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. The
        third parties include:
      </p>
      <ul>
        <li>
          <strong>Google Analytics:</strong> Website traffic and user behavior analysis
        </li>
        <li>
          <strong>Facebook Pixel:</strong> Advertising and audience measurement
        </li>
        <li>
          <strong>Stripe:</strong> Secure payment processing
        </li>
        <li>
          <strong>Social Media Platforms:</strong> Social sharing and integration
        </li>
      </ul>

      <h2>4. How Long Do Cookies Last?</h2>
      <p>Cookies can be either session cookies or persistent cookies:</p>
      <ul>
        <li>
          <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser
        </li>
        <li>
          <strong>Persistent Cookies:</strong> Remain on your device for a specified period (from days to years) or
          until you manually delete them
        </li>
      </ul>

      <h2>5. Managing Your Cookie Preferences</h2>

      <h3>5.1 Browser Settings</h3>
      <p>
        Most browsers allow you to control cookies through their settings. You can set your browser to refuse all
        cookies or alert you when a cookie is being sent. However, some website features may not function properly if
        you disable cookies.
      </p>

      <h3>5.2 Browser-Specific Instructions</h3>
      <ul>
        <li>
          <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
        </li>
        <li>
          <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
        </li>
        <li>
          <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
        </li>
        <li>
          <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
        </li>
      </ul>

      <h3>5.3 Opt-Out Tools</h3>
      <p>You can opt out of specific types of cookies using these tools:</p>
      <ul>
        <li>
          <strong>Google Analytics:</strong>{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-out Browser Add-on
          </a>
        </li>
        <li>
          <strong>Digital Advertising Alliance:</strong>{' '}
          <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            Your Ad Choices
          </a>
        </li>
        <li>
          <strong>Network Advertising Initiative:</strong>{' '}
          <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">
            NAI Opt-Out Tool
          </a>
        </li>
      </ul>

      <h2>6. Do Not Track Signals</h2>
      <p>
        Some browsers have a "Do Not Track" feature that signals to websites that you do not want your online activities
        tracked. Our website does not currently respond to Do Not Track signals, but you can manage cookies through your
        browser settings as described above.
      </p>

      <h2>7. Mobile Devices</h2>
      <p>
        Mobile devices may use advertising identifiers instead of cookies. You can manage these through your device
        settings:
      </p>
      <ul>
        <li>
          <strong>iOS:</strong> Settings → Privacy → Advertising → Limit Ad Tracking
        </li>
        <li>
          <strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization
        </li>
      </ul>

      <h2>8. Changes to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our
        business practices. We will post any changes on this page with an updated "Last Updated" date.
      </p>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you have questions about our use of cookies, please contact us:
          <br />
          Email: privacy@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
