import React from 'react';
import './LegalPage.css';

// TODO: Update all instances of 'CustomCraft' with actual business name once decided
const AccessibilityStatement: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Accessibility Statement</h1>
      <p className="last-updated">Last Updated: January 11, 2026</p>

      <p>
        CustomCraft is committed to ensuring digital accessibility for people with disabilities. We are continually
        improving the user experience for everyone and applying the relevant accessibility standards to ensure we
        provide equal access to all of our users.
      </p>

      <h2>1. Our Commitment</h2>
      <p>
        We believe that everyone should be able to browse, shop, and customize products on our website regardless of
        ability. We strive to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to ensure our
        website is accessible to people with diverse abilities.
      </p>

      <h2>2. Conformance Status</h2>
      <p>
        The Web Content Accessibility Guidelines (WCAG) define requirements to improve accessibility for people with
        disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. CustomCraft is partially
        conformant with WCAG 2.1 Level AA. Partially conformant means that some parts of the content do not fully
        conform to the accessibility standard.
      </p>

      <h2>3. Accessibility Features</h2>
      <p>Our website includes the following accessibility features:</p>

      <h3>3.1 Keyboard Navigation</h3>
      <ul>
        <li>All interactive elements are keyboard accessible</li>
        <li>Logical tab order throughout the site</li>
        <li>Skip navigation links to bypass repetitive content</li>
        <li>Visible focus indicators for keyboard users</li>
      </ul>

      <h3>3.2 Screen Reader Compatibility</h3>
      <ul>
        <li>Semantic HTML markup for proper document structure</li>
        <li>ARIA labels and landmarks for enhanced navigation</li>
        <li>Descriptive alt text for images</li>
        <li>Text alternatives for non-text content</li>
        <li>Proper heading hierarchy (H1-H6)</li>
      </ul>

      <h3>3.3 Visual Design</h3>
      <ul>
        <li>Sufficient color contrast ratios (minimum 4.5:1 for normal text)</li>
        <li>Text that can be resized up to 200% without loss of functionality</li>
        <li>Content that doesn't rely solely on color to convey information</li>
        <li>Responsive design that works across different screen sizes</li>
      </ul>

      <h3>3.4 Forms and Inputs</h3>
      <ul>
        <li>Clear labels associated with form fields</li>
        <li>Error messages that are descriptive and helpful</li>
        <li>Required fields clearly indicated</li>
        <li>Input format instructions provided</li>
      </ul>

      <h3>3.5 Multimedia</h3>
      <ul>
        <li>Captions for video content</li>
        <li>Transcripts for audio content</li>
        <li>Audio control for auto-playing media</li>
      </ul>

      <h2>4. Assistive Technologies</h2>
      <p>Our website is designed to be compatible with the following assistive technologies:</p>
      <ul>
        <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
        <li>Screen magnification software</li>
        <li>Speech recognition software</li>
        <li>Keyboard-only navigation</li>
        <li>Alternative input devices</li>
      </ul>

      <h2>5. Browser Compatibility</h2>
      <p>We test our website for accessibility using the following browsers with assistive technologies:</p>
      <ul>
        <li>Google Chrome (latest version) with NVDA</li>
        <li>Mozilla Firefox (latest version) with NVDA</li>
        <li>Safari (latest version) with VoiceOver</li>
        <li>Microsoft Edge (latest version) with JAWS</li>
      </ul>

      <h2>6. Known Limitations</h2>
      <p>
        Despite our best efforts, some areas of our website may have accessibility issues. We are aware of the following
        limitations and are working to address them:
      </p>
      <ul>
        <li>Some third-party embedded content may not be fully accessible</li>
        <li>Complex product customization tools may require additional accessibility enhancements</li>
        <li>Some PDF documents may need to be made more accessible</li>
        <li>Certain interactive elements in the design tool may have limited keyboard accessibility</li>
      </ul>

      <h2>7. Ongoing Efforts</h2>
      <p>We are committed to continuous improvement of accessibility. Our ongoing efforts include:</p>
      <ul>
        <li>Regular accessibility audits and testing with real users</li>
        <li>Training our team on accessibility best practices</li>
        <li>Incorporating accessibility into our design and development process</li>
        <li>Monitoring and addressing accessibility issues as they are identified</li>
        <li>Seeking feedback from users with disabilities</li>
      </ul>

      <h2>8. Third-Party Content</h2>
      <p>
        Some content on our website is provided by third-party services (such as payment processors, social media
        widgets, and embedded videos). We work with our third-party partners to ensure their services are accessible,
        but we cannot guarantee the accessibility of content we do not control.
      </p>

      <h2>9. Accessibility Standards</h2>
      <p>Our website aims to conform to the following standards:</p>
      <ul>
        <li>
          <strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines from W3C
        </li>
        <li>
          <strong>Section 508:</strong> U.S. Rehabilitation Act accessibility standards
        </li>
        <li>
          <strong>ADA:</strong> Americans with Disabilities Act requirements
        </li>
      </ul>

      <h2>10. Mobile Accessibility</h2>
      <p>Our mobile website and any mobile applications include accessibility features such as:</p>
      <ul>
        <li>Compatibility with mobile screen readers (VoiceOver, TalkBack)</li>
        <li>Touch target sizes that meet accessibility guidelines</li>
        <li>Responsive design that adapts to different screen sizes</li>
        <li>Gestures that have alternatives for users with motor impairments</li>
      </ul>

      <h2>11. Feedback and Assistance</h2>
      <p>
        We welcome your feedback on the accessibility of our website. If you encounter an accessibility barrier, please
        let us know so we can work to resolve it. We are committed to providing a positive experience for all users.
      </p>

      <h3>11.1 How to Report Issues</h3>
      <p>If you experience any difficulty accessing our website, please contact us with the following information:</p>
      <ul>
        <li>The nature of the accessibility issue</li>
        <li>The specific web page or feature where you encountered the issue</li>
        <li>The assistive technology you were using (if applicable)</li>
        <li>Your contact information so we can follow up with you</li>
      </ul>

      <h3>11.2 Alternative Access</h3>
      <p>If you cannot access certain content or features on our website, we will work with you to provide:</p>
      <ul>
        <li>Information in an alternative format</li>
        <li>Assistance completing a purchase or customization over the phone</li>
        <li>Support from our customer service team</li>
      </ul>

      <h2>12. Response Timeline</h2>
      <p>
        We take accessibility issues seriously and will respond to your accessibility feedback within 3 business days.
        We will work diligently to resolve reported issues and provide you with updates on our progress.
      </p>

      <h2>13. Formal Complaints</h2>
      <p>
        If you are not satisfied with our response to your accessibility concerns, you may file a formal complaint with:
      </p>
      <ul>
        <li>
          <strong>U.S. Department of Justice:</strong> Disability Rights Section
        </li>
        <li>
          <strong>Website:</strong> www.ada.gov
        </li>
      </ul>

      <h2>14. Updates to This Statement</h2>
      <p>
        We will update this Accessibility Statement as we make improvements to our website. The "Last Updated" date at
        the top of this page indicates when this statement was last revised.
      </p>

      <div className="contact-section">
        <h2>Contact Us About Accessibility</h2>
        <p>
          For accessibility-related questions, feedback, or to request assistance, please contact us:
          <br />
          Email: accessibility@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1 (Monday-Friday, 9 AM - 5 PM PST)
          <br />
          Mail: CustomCraft Accessibility Team, 123 Main Street, San Francisco, CA 94102
        </p>
        <p style={{ marginTop: '15px' }}>
          We are committed to working with you to ensure you have access to our products and services. Your feedback
          helps us improve accessibility for all users.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
