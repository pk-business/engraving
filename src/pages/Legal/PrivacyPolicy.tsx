import React from 'react';
import './LegalPage.css';

// TODO: Update all instances of 'CustomCraft' with actual business name once decided
const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last Updated: January 11, 2026</p>

      <p>
        At CustomCraft, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit our website and use our services.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Personal Information</h3>
      <p>We collect personal information that you voluntarily provide to us, including:</p>
      <ul>
        <li>Name, email address, and contact information</li>
        <li>Billing and shipping addresses</li>
        <li>Payment information (processed securely by third-party payment processors)</li>
        <li>Account credentials</li>
        <li>Custom text, designs, or images you submit for personalization</li>
      </ul>

      <h3>1.2 Automatically Collected Information</h3>
      <p>When you visit our website, we automatically collect:</p>
      <ul>
        <li>IP address and browser type</li>
        <li>Device information and operating system</li>
        <li>Pages visited and time spent on pages</li>
        <li>Referring website addresses</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Communicate with you about your orders and account</li>
        <li>Provide customer support</li>
        <li>Send marketing communications (with your consent)</li>
        <li>Improve our website and services</li>
        <li>Detect and prevent fraud</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. Sharing Your Information</h2>
      <p>We may share your information with:</p>
      <ul>
        <li>
          <strong>Service Providers:</strong> Third-party companies that help us operate our business (payment
          processors, shipping carriers, email services)
        </li>
        <li>
          <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
        </li>
        <li>
          <strong>With Your Consent:</strong> When you explicitly authorize us to share your information
        </li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2>4. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar technologies to enhance your experience, analyze website traffic, and personalize
        content. You can control cookies through your browser settings, but disabling them may limit website
        functionality.
      </p>

      <h3>4.1 Types of Cookies We Use</h3>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Required for website operation
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand how visitors use our site
        </li>
        <li>
          <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
        </li>
        <li>
          <strong>Preference Cookies:</strong> Remember your settings and preferences
        </li>
      </ul>

      <h2>5. Your Privacy Rights</h2>
      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of the personal information we hold about you
        </li>
        <li>
          <strong>Correction:</strong> Request correction of inaccurate information
        </li>
        <li>
          <strong>Deletion:</strong> Request deletion of your personal information
        </li>
        <li>
          <strong>Opt-Out:</strong> Opt out of marketing communications and data sales
        </li>
        <li>
          <strong>Data Portability:</strong> Receive your data in a portable format
        </li>
      </ul>

      <h2>6. California Privacy Rights (CCPA)</h2>
      <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
      <ul>
        <li>Right to know what personal information we collect and how it's used</li>
        <li>Right to delete your personal information</li>
        <li>Right to opt-out of the sale of your personal information</li>
        <li>Right to non-discrimination for exercising your privacy rights</li>
      </ul>
      <p>
        To exercise these rights, please contact us at privacy@customcraft.com or call 1-800-CUSTOM-1. We will verify
        your identity before processing your request.
      </p>

      <h2>7. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your information. However, no method
        of transmission over the Internet is 100% secure. We cannot guarantee absolute security but strive to protect
        your data using industry-standard practices.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy,
        comply with legal obligations, resolve disputes, and enforce our agreements.
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        Our services are not directed to children under 13. We do not knowingly collect personal information from
        children. If we learn we have collected information from a child under 13, we will delete it promptly.
      </p>

      <h2>10. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your country of residence. We
        ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
      </p>

      <h2>11. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices of
        these sites. We encourage you to review their privacy policies.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new
        policy on our website and updating the "Last Updated" date.
      </p>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
          <br />
          Email: privacy@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1
          <br />
          Mail: CustomCraft Privacy Team, 123 Main Street, San Francisco, CA 94102
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
