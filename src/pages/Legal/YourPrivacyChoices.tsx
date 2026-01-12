import React from 'react';
import './LegalPage.css';

// TODO: Update all instances of 'CustomCraft' with actual business name once decided
const YourPrivacyChoices: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Your Privacy Choices</h1>
      <p className="last-updated">Last Updated: January 11, 2026</p>

      <p>
        At CustomCraft, we respect your privacy and want to give you control over how your personal information is used.
        This page provides information about the privacy choices available to you and how to manage your preferences.
      </p>

      <h2>1. Overview of Your Choices</h2>
      <p>You have several options to control your personal information:</p>
      <ul>
        <li>Marketing communications preferences</li>
        <li>Cookie and tracking technology settings</li>
        <li>Targeted advertising opt-outs</li>
        <li>Data sharing and sales opt-outs</li>
        <li>Account data management</li>
        <li>Location data preferences</li>
      </ul>

      <h2>2. Marketing Communications</h2>

      <h3>2.1 Email Preferences</h3>
      <p>You can control the marketing emails you receive from us:</p>
      <ul>
        <li>
          <strong>Unsubscribe:</strong> Click the "Unsubscribe" link at the bottom of any marketing email
        </li>
        <li>
          <strong>Preference Center:</strong> Manage specific email categories (promotional offers, new products, etc.)
        </li>
        <li>
          <strong>Account Settings:</strong> Update email preferences in your account dashboard
        </li>
      </ul>
      <p>
        Note: Even if you opt out of marketing emails, we may still send you transactional emails about your orders,
        account, and customer service.
      </p>

      <h3>2.2 SMS/Text Messages</h3>
      <p>If you've opted in to receive text messages:</p>
      <ul>
        <li>Reply STOP to any text message to unsubscribe</li>
        <li>Reply HELP for assistance</li>
        <li>Message and data rates may apply</li>
      </ul>

      <h3>2.3 Push Notifications</h3>
      <p>You can manage push notifications through:</p>
      <ul>
        <li>App settings within CustomCraft mobile app</li>
        <li>Device settings (iOS: Settings → Notifications; Android: Settings → Apps → Notifications)</li>
      </ul>

      <h2>3. Cookie Management</h2>

      <h3>3.1 Cookie Preferences</h3>
      <p>You can control which cookies we use on our website:</p>
      <div style={{ padding: '20px', background: 'var(--color-background-secondary)', borderRadius: '8px', marginTop: '15px' }}>
        <h4>Cookie Preference Center</h4>
        <p style={{ marginBottom: '15px' }}>
          <strong>Note:</strong> A cookie consent banner and preference center would typically be integrated here,
          allowing you to toggle different cookie categories on/off.
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            ✓ <strong>Essential Cookies:</strong> Always active (required for website function)
          </li>
          <li style={{ marginBottom: '10px' }}>
            ☐ <strong>Performance Cookies:</strong> Help us improve website performance
          </li>
          <li style={{ marginBottom: '10px' }}>
            ☐ <strong>Functionality Cookies:</strong> Remember your preferences
          </li>
          <li style={{ marginBottom: '10px' }}>
            ☐ <strong>Marketing Cookies:</strong> Used for targeted advertising
          </li>
        </ul>
        <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Visit our <a href="/legal/cookie-policy">Cookie Policy</a> for detailed information about the cookies we use.
        </p>
      </div>

      <h3>3.2 Browser Settings</h3>
      <p>You can also control cookies through your browser settings:</p>
      <ul>
        <li>Block all cookies</li>
        <li>Accept only first-party cookies</li>
        <li>Clear cookies when you close your browser</li>
        <li>Receive alerts before cookies are stored</li>
      </ul>
      <p>Note: Blocking cookies may affect website functionality and your user experience.</p>

      <h2>4. Targeted Advertising</h2>

      <h3>4.1 Interest-Based Advertising</h3>
      <p>To opt out of interest-based advertising from participating companies:</p>
      <ul>
        <li>
          <strong>Digital Advertising Alliance:</strong>{' '}
          <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info/choices
          </a>
        </li>
        <li>
          <strong>Network Advertising Initiative:</strong>{' '}
          <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">
            www.networkadvertising.org/choices
          </a>
        </li>
        <li>
          <strong>European Interactive Digital Advertising Alliance:</strong>{' '}
          <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">
            www.youronlinechoices.eu
          </a>
        </li>
      </ul>

      <h3>4.2 Social Media Advertising</h3>
      <p>To manage ads on social media platforms:</p>
      <ul>
        <li>
          <strong>Facebook:</strong> Ad Preferences in Settings
        </li>
        <li>
          <strong>Instagram:</strong> Ad Settings in Account Settings
        </li>
        <li>
          <strong>Twitter:</strong> Personalization and Data in Settings
        </li>
        <li>
          <strong>Pinterest:</strong> Ad Preferences in Account Settings
        </li>
      </ul>

      <h3>4.3 Google Advertising</h3>
      <ul>
        <li>
          <strong>Google Ads Settings:</strong>{' '}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>
        </li>
        <li>
          <strong>Google Analytics Opt-out:</strong>{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-out Browser Add-on
          </a>
        </li>
      </ul>

      <h2>5. Data Sharing and Sales</h2>

      <h3>5.1 Do Not Sell My Personal Information</h3>
      <p>
        If you are a California resident, you can opt out of the "sale" of your personal information as defined by the
        CCPA. Visit our <a href="/legal/do-not-sell">Do Not Sell My Personal Information</a> page to submit your
        request.
      </p>

      <h3>5.2 Data Sharing Preferences</h3>
      <p>You can control how we share your information with:</p>
      <ul>
        <li>Marketing partners</li>
        <li>Analytics providers</li>
        <li>Social media platforms</li>
      </ul>
      <p>Contact us at privacy@customcraft.com to update your data sharing preferences.</p>

      <h2>6. Account Data Management</h2>

      <h3>6.1 Access Your Data</h3>
      <p>You can access and download your personal data by:</p>
      <ul>
        <li>Logging into your account and viewing your account dashboard</li>
        <li>Requesting a data export (email privacy@customcraft.com)</li>
      </ul>

      <h3>6.2 Update Your Information</h3>
      <p>Keep your information accurate and up-to-date:</p>
      <ul>
        <li>Update your profile in account settings</li>
        <li>Edit shipping and billing addresses</li>
        <li>Change your password</li>
        <li>Update payment methods</li>
      </ul>

      <h3>6.3 Delete Your Account</h3>
      <p>You can request deletion of your account and personal data:</p>
      <ul>
        <li>Email privacy@customcraft.com with "Account Deletion Request" in the subject line</li>
        <li>We will verify your identity and process your request within 45 days</li>
        <li>Note: Some data may be retained for legal or business purposes</li>
      </ul>

      <h2>7. Location Data</h2>

      <h3>7.1 Precise Location</h3>
      <p>You can control whether we collect precise location data:</p>
      <ul>
        <li>
          <strong>iOS:</strong> Settings → Privacy → Location Services → CustomCraft
        </li>
        <li>
          <strong>Android:</strong> Settings → Apps → CustomCraft → Permissions → Location
        </li>
      </ul>

      <h3>7.2 Approximate Location</h3>
      <p>
        We may still collect approximate location based on your IP address for shipping estimates and regional content,
        even if you disable precise location services.
      </p>

      <h2>8. Connected Accounts</h2>

      <h3>8.1 Social Media Connections</h3>
      <p>If you've connected your social media accounts:</p>
      <ul>
        <li>Disconnect accounts in your CustomCraft account settings</li>
        <li>Revoke app permissions directly on the social media platform</li>
      </ul>

      <h3>8.2 Third-Party Services</h3>
      <p>Manage connections to payment providers, shipping services, or other integrated services:</p>
      <ul>
        <li>Review connected services in account settings</li>
        <li>Disconnect services you no longer use</li>
      </ul>

      <h2>9. Children's Privacy</h2>
      <p>
        Our services are not directed to children under 13. If you are a parent or guardian and believe your child has
        provided personal information to us, please contact us immediately at privacy@customcraft.com so we can delete
        it.
      </p>

      <h2>10. International Users</h2>

      <h3>10.1 GDPR Rights (European Users)</h3>
      <p>If you are in the European Economic Area, you have additional rights:</p>
      <ul>
        <li>Right to access your data</li>
        <li>Right to rectification (correction)</li>
        <li>Right to erasure ("right to be forgotten")</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
        <li>Right to withdraw consent</li>
      </ul>

      <h3>10.2 Other Jurisdictions</h3>
      <p>
        Users in other jurisdictions may have additional rights under local privacy laws. Contact us at
        privacy@customcraft.com to learn about rights specific to your location.
      </p>

      <h2>11. Effect of Your Choices</h2>
      <p>Understanding the impact of your privacy choices:</p>
      <ul>
        <li>
          <strong>Opting out of marketing:</strong> You'll still receive transactional communications
        </li>
        <li>
          <strong>Disabling cookies:</strong> Some website features may not work properly
        </li>
        <li>
          <strong>Opting out of tracking:</strong> Ads will be less personalized
        </li>
        <li>
          <strong>Deleting your account:</strong> You'll lose access to order history and saved preferences
        </li>
      </ul>

      <h2>12. Updates to Your Choices</h2>
      <p>
        You can update your privacy choices at any time. Changes will take effect within a reasonable timeframe (usually
        within 10 business days for most preferences).
      </p>

      <div className="contact-section">
        <h2>Questions About Your Privacy Choices?</h2>
        <p>
          If you need help managing your privacy settings or have questions about your options, please contact us:
          <br />
          Email: privacy@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1
          <br />
          Mail: CustomCraft Privacy Team, 123 Main Street, San Francisco, CA 94102
        </p>
        <p style={{ marginTop: '15px' }}>
          Our privacy team is here to help you understand and exercise your privacy rights.
        </p>
      </div>
    </div>
  );
};

export default YourPrivacyChoices;
