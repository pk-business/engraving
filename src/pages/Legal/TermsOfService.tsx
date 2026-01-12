import React from 'react';
import './LegalPage.css';

// TODO: Update all instances of 'CustomCraft' with actual business name once decided
const TermsOfService: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Terms of Service</h1>
      <p className="last-updated">Last Updated: January 11, 2026</p>

      <p>
        Welcome to CustomCraft. By accessing or using our website and services, you agree to be bound by these Terms
        of Service. Please read them carefully.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using CustomCraft's website and services, you accept and agree to be bound by these Terms of
        Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
      </p>

      <h2>2. Use of Services</h2>
      <h3>2.1 Eligibility</h3>
      <p>
        You must be at least 18 years old to make purchases on our website. By using our services, you represent that
        you meet this age requirement.
      </p>

      <h3>2.2 Account Registration</h3>
      <p>
        When creating an account, you agree to provide accurate, current, and complete information. You are
        responsible for maintaining the confidentiality of your account credentials and for all activities under your
        account.
      </p>

      <h2>3. Orders and Payment</h2>
      <h3>3.1 Product Orders</h3>
      <p>
        All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for
        any reason, including product availability, errors in pricing or product information, or suspected fraud.
      </p>

      <h3>3.2 Pricing</h3>
      <p>
        All prices are in USD and are subject to change without notice. We strive to ensure pricing accuracy but
        reserve the right to correct any errors.
      </p>

      <h3>3.3 Payment</h3>
      <p>
        Payment is required at the time of order. We accept major credit cards and other payment methods as displayed
        on our checkout page. All payment information is processed securely.
      </p>

      <h2>4. Custom Products and Personalization</h2>
      <p>
        Custom engraved or personalized products are made to order based on your specifications. Please carefully
        review all personalization details before submitting your order, as custom items typically cannot be returned
        unless defective.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on our website, including text, graphics, logos, images, and software, is the property of
        CustomCraft or its licensors and is protected by copyright, trademark, and other intellectual property laws.
      </p>

      <h3>5.1 User-Submitted Content</h3>
      <p>
        By submitting designs, text, or other content for personalization, you grant us a license to use such content
        solely for the purpose of fulfilling your order. You represent that you own or have permission to use any
        content you submit.
      </p>

      <h2>6. Shipping and Delivery</h2>
      <p>
        Shipping times and costs vary based on your location and selected shipping method. We are not responsible for
        delays caused by carriers, customs, or circumstances beyond our control.
      </p>

      <h2>7. Returns and Refunds</h2>
      <p>
        Please refer to our Returns & Refunds policy for detailed information. Custom or personalized items may have
        different return restrictions.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        CustomCraft shall not be liable for any indirect, incidental, special, consequential, or punitive damages
        resulting from your use of our services or products. Our total liability shall not exceed the amount paid for
        the product in question.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold CustomCraft harmless from any claims, damages, or expenses arising from your
        use of our services, violation of these terms, or infringement of any third-party rights.
      </p>

      <h2>10. Modifications to Terms</h2>
      <p>
        We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon
        posting. Your continued use of our services after changes constitutes acceptance of the modified terms.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms of Service are governed by the laws of the State of California, United States, without regard to
        its conflict of law provisions.
      </p>

      <h2>12. Dispute Resolution</h2>
      <p>
        Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration
        in accordance with the rules of the American Arbitration Association.
      </p>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you have questions about these Terms of Service, please contact us at:
          <br />
          Email: legal@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
