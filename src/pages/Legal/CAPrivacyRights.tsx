import React from 'react';
import './LegalPage.css';

// TODO: Update all instances of 'CustomCraft' with actual business name once decided
const CAPrivacyRights: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>California Privacy Rights</h1>
      <p className="last-updated">Last Updated: January 11, 2026</p>

      <p>
        If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act
        (CPRA) provide you with specific rights regarding your personal information. This page describes your California
        privacy rights and how to exercise them.
      </p>

      <h2>1. Your California Privacy Rights</h2>

      <h3>1.1 Right to Know</h3>
      <p>You have the right to request that we disclose:</p>
      <ul>
        <li>The categories of personal information we collected about you</li>
        <li>The categories of sources from which we collected your personal information</li>
        <li>The business or commercial purpose for collecting or selling your personal information</li>
        <li>The categories of third parties with whom we share your personal information</li>
        <li>The specific pieces of personal information we collected about you</li>
      </ul>

      <h3>1.2 Right to Delete</h3>
      <p>
        You have the right to request deletion of your personal information that we collected from you, subject to
        certain exceptions. We may retain information necessary to:
      </p>
      <ul>
        <li>Complete transactions or provide requested services</li>
        <li>Detect security incidents and protect against fraud</li>
        <li>Debug and repair errors</li>
        <li>Comply with legal obligations</li>
        <li>Enable internal uses reasonably aligned with your expectations</li>
      </ul>

      <h3>1.3 Right to Correct</h3>
      <p>
        You have the right to request correction of inaccurate personal information we maintain about you. We will use
        commercially reasonable efforts to correct the information.
      </p>

      <h3>1.4 Right to Opt-Out of Sale/Sharing</h3>
      <p>
        You have the right to opt out of the "sale" or "sharing" of your personal information as those terms are defined
        under California law. Visit our <a href="/legal/do-not-sell">Do Not Sell My Personal Information</a> page to
        exercise this right.
      </p>

      <h3>1.5 Right to Limit Use of Sensitive Personal Information</h3>
      <p>
        If we collect sensitive personal information, you have the right to limit our use of it to only what is
        necessary to provide our services. We do not currently collect or use sensitive personal information beyond what
        is necessary to provide our services.
      </p>

      <h3>1.6 Right to Non-Discrimination</h3>
      <p>You have the right not to receive discriminatory treatment for exercising your CCPA/CPRA rights. We will not:</p>
      <ul>
        <li>Deny you goods or services</li>
        <li>Charge different prices or rates</li>
        <li>Provide a different level or quality of service</li>
        <li>Suggest you will receive different pricing or service</li>
      </ul>

      <h2>2. Categories of Personal Information We Collect</h2>
      <p>In the past 12 months, we have collected the following categories of personal information:</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '10px' }}>Identifiers</td>
            <td style={{ padding: '10px' }}>Name, email, address, phone number, IP address</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '10px' }}>Commercial Information</td>
            <td style={{ padding: '10px' }}>Purchase history, custom designs, product preferences</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '10px' }}>Internet Activity</td>
            <td style={{ padding: '10px' }}>Browsing history, search history, interactions with our site</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '10px' }}>Geolocation Data</td>
            <td style={{ padding: '10px' }}>Approximate location based on IP address</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '10px' }}>Visual Information</td>
            <td style={{ padding: '10px' }}>Photos or designs you upload for customization</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>Inferences</td>
            <td style={{ padding: '10px' }}>Preferences, characteristics, behavior patterns</td>
          </tr>
        </tbody>
      </table>

      <h2>3. How to Exercise Your Rights</h2>

      <h3>3.1 Submitting a Request</h3>
      <p>You can submit a verifiable consumer request by:</p>
      <ul>
        <li>
          <strong>Email:</strong> privacy@customcraft.com
        </li>
        <li>
          <strong>Phone:</strong> 1-800-CUSTOM-1
        </li>
        <li>
          <strong>Mail:</strong> CustomCraft Privacy Team, 123 Main Street, San Francisco, CA 94102
        </li>
      </ul>

      <h3>3.2 Information Required</h3>
      <p>When submitting a request, please provide:</p>
      <ul>
        <li>Your full name</li>
        <li>Email address</li>
        <li>Phone number (optional but helpful for verification)</li>
        <li>A detailed description of your request</li>
        <li>Account information (if you have an account with us)</li>
      </ul>

      <h3>3.3 Verification Process</h3>
      <p>
        To protect your privacy and security, we will verify your identity before processing your request. The
        verification process may include:
      </p>
      <ul>
        <li>Matching the information you provide with information we have on file</li>
        <li>Sending a verification email to your registered email address</li>
        <li>Asking security questions</li>
        <li>Requesting additional documentation for high-risk requests</li>
      </ul>

      <h3>3.4 Authorized Agents</h3>
      <p>You may designate an authorized agent to make requests on your behalf. The agent must provide:</p>
      <ul>
        <li>Written authorization signed by you</li>
        <li>Proof of their identity</li>
        <li>Verification that they are registered with the California Secretary of State (if required)</li>
      </ul>
      <p>We may still require you to verify your identity directly with us.</p>

      <h2>4. Response Timeline</h2>
      <p>We will:</p>
      <ul>
        <li>Acknowledge receipt of your request within 10 business days</li>
        <li>Respond to your request within 45 days</li>
        <li>Notify you if we need additional time (up to 90 days total for complex requests)</li>
        <li>Explain any reasons we cannot comply with your request</li>
      </ul>

      <h2>5. Request Limits</h2>
      <p>You may submit requests as follows:</p>
      <ul>
        <li>
          <strong>Right to Know:</strong> Twice in a 12-month period
        </li>
        <li>
          <strong>Right to Delete:</strong> No limit, but we will verify each request
        </li>
        <li>
          <strong>Right to Correct:</strong> No limit, but we will verify each request
        </li>
        <li>
          <strong>Right to Opt-Out:</strong> No limit
        </li>
      </ul>

      <h2>6. Information We Disclose for Business Purposes</h2>
      <p>We may disclose personal information to third parties for business purposes:</p>
      <ul>
        <li>
          <strong>Service Providers:</strong> Payment processors, shipping carriers, email services, analytics providers
        </li>
        <li>
          <strong>Professional Advisors:</strong> Lawyers, accountants, consultants
        </li>
        <li>
          <strong>Business Partners:</strong> Co-marketing partners (with your consent)
        </li>
        <li>
          <strong>Government Entities:</strong> When required by law or legal process
        </li>
      </ul>

      <h2>7. Shine the Light Law</h2>
      <p>
        California's "Shine the Light" law (Civil Code Section § 1798.83) permits California residents to request
        information about our disclosure of personal information to third parties for direct marketing purposes. To make
        such a request, please contact us using the information below.
      </p>

      <h2>8. Minors Under 16</h2>
      <p>
        We do not knowingly sell or share the personal information of consumers under 16 years of age without
        affirmative authorization. If you are a parent or guardian and believe we have collected information about your
        child, please contact us immediately.
      </p>

      <h2>9. Financial Incentive Programs</h2>
      <p>
        If we offer any financial incentive programs (such as discounts or loyalty programs), we will provide you with
        notice of material terms at the time of enrollment. You may opt out at any time.
      </p>

      <h2>10. Changes to This Notice</h2>
      <p>
        We may update this California Privacy Rights notice to reflect changes in our practices or legal requirements.
        We will post updates on this page with a new "Last Updated" date.
      </p>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>
          For questions about your California privacy rights or to exercise your rights, please contact us:
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

export default CAPrivacyRights;
