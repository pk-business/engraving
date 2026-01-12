import React from 'react';
import './LegalPage.css';

// TODO: Update all instances of 'CustomCraft' with actual business name once decided
const DoNotSellMyInfo: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Do Not Sell My Personal Information</h1>
      <p className="last-updated">Last Updated: January 11, 2026</p>

      <p>
        Under the California Consumer Privacy Act (CCPA), California residents have the right to opt out of the "sale"
        of their personal information. CustomCraft respects your privacy rights and provides this page to help you
        exercise your rights under California law.
      </p>

      <h2>1. Our Position on Selling Personal Information</h2>
      <p>
        CustomCraft does not sell your personal information in the traditional sense. However, the CCPA defines "sale"
        broadly to include sharing personal information with third parties for valuable consideration, which may include
        certain advertising and analytics activities.
      </p>

      <h2>2. Information That May Be Shared</h2>
      <p>
        In the course of operating our business, we may share certain categories of information with third parties in
        ways that could be considered a "sale" under CCPA:
      </p>
      <ul>
        <li>
          <strong>Identifiers:</strong> IP addresses, device identifiers, online identifiers
        </li>
        <li>
          <strong>Internet Activity:</strong> Browsing history, search history, interactions with our website
        </li>
        <li>
          <strong>Geolocation Data:</strong> Approximate location based on IP address
        </li>
        <li>
          <strong>Inferences:</strong> Preferences and characteristics derived from your activity
        </li>
      </ul>

      <h2>3. Third Parties We May Share With</h2>
      <p>Information may be shared with the following categories of third parties:</p>
      <ul>
        <li>Advertising networks and partners</li>
        <li>Analytics providers (e.g., Google Analytics)</li>
        <li>Social media platforms (e.g., Facebook, Instagram)</li>
        <li>Marketing technology providers</li>
      </ul>

      <h2>4. How to Opt Out</h2>
      <p>You have the right to opt out of the sale of your personal information. You can exercise this right by:</p>

      <h3>4.1 Email Request</h3>
      <p>
        Send an email to <strong>privacy@customcraft.com</strong> with the subject line "Do Not Sell My Personal
        Information." Please include:
      </p>
      <ul>
        <li>Your full name</li>
        <li>Email address associated with your account (if applicable)</li>
        <li>A clear statement that you wish to opt out of the sale of your personal information</li>
      </ul>

      <h3>4.2 Phone Request</h3>
      <p>
        Call us at <strong>1-800-CUSTOM-1</strong> and tell our customer service representative that you want to opt out
        of the sale of your personal information.
      </p>

      <h3>4.3 Online Form</h3>
      <p>Complete our online opt-out form:</p>
      <div style={{ padding: '20px', background: 'var(--color-background-secondary)', borderRadius: '8px' }}>
        <p>
          <strong>Note:</strong> An online form would typically be integrated here with fields for name, email, and
          verification. For now, please use the email or phone options above.
        </p>
      </div>

      <h2>5. Verification Process</h2>
      <p>
        To protect your privacy, we will verify your identity before processing your opt-out request. We may ask you to:
      </p>
      <ul>
        <li>Provide information that matches our records</li>
        <li>Verify your email address</li>
        <li>Answer security questions (for account holders)</li>
      </ul>

      <h2>6. Processing Timeline</h2>
      <p>
        We will acknowledge receipt of your request within 10 business days and complete your opt-out request within 15
        business days. Once processed, we will:
      </p>
      <ul>
        <li>Stop selling your personal information going forward</li>
        <li>Notify third parties with whom we've shared your information (where feasible)</li>
        <li>Send you a confirmation email</li>
      </ul>

      <h2>7. Effect of Opting Out</h2>
      <p>Opting out of the sale of personal information will NOT:</p>
      <ul>
        <li>Prevent you from using our website or services</li>
        <li>Affect your ability to make purchases</li>
        <li>Result in different pricing or service quality</li>
      </ul>
      <p>However, you may experience:</p>
      <ul>
        <li>Less personalized advertising</li>
        <li>More generic product recommendations</li>
        <li>Ads that may be less relevant to your interests</li>
      </ul>

      <h2>8. Cookie Management</h2>
      <p>
        In addition to opting out of data sales, you can manage cookies and tracking technologies through your browser
        settings or our cookie preferences tool. See our <a href="/legal/cookie-policy">Cookie Policy</a> for more
        information.
      </p>

      <h2>9. Authorized Agents</h2>
      <p>
        You may designate an authorized agent to submit an opt-out request on your behalf. To do so, the agent must
        provide:
      </p>
      <ul>
        <li>Written authorization signed by you</li>
        <li>Proof of their identity</li>
        <li>Verification that they are registered with the California Secretary of State (if applicable)</li>
      </ul>

      <h2>10. Minors Under 16</h2>
      <p>
        We do not knowingly sell the personal information of consumers under 16 years of age without affirmative
        authorization. If you believe we have sold the information of a minor, please contact us immediately.
      </p>

      <h2>11. Additional California Rights</h2>
      <p>
        As a California resident, you also have the right to request information about what personal information we
        collect, use, and disclose, as well as the right to request deletion of your information. Visit our{' '}
        <a href="/legal/ca-privacy-rights">California Privacy Rights</a> page for more details.
      </p>

      <h2>12. Changes to This Page</h2>
      <p>
        We may update this page to reflect changes in our practices or legal requirements. The "Last Updated" date at
        the top indicates when changes were last made.
      </p>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you have questions about opting out of the sale of your personal information, please contact us:
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

export default DoNotSellMyInfo;
