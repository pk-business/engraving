import React from 'react';
import '../Legal/LegalPage.css';

// TODO: Review and update return policy with actual timelines, conditions, and refund processing times
const ReturnsRefunds: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Returns & Refunds</h1>
      <p className="last-updated">Last Updated: January 12, 2026</p>

      <p>
        We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to
        help. This page outlines our return and refund policies.
      </p>

      <h2>1. Return Policy Overview</h2>
      <p>We accept returns within 30 days of delivery for most items, subject to the conditions outlined below.</p>

      <h2>2. Eligible Returns</h2>
      <h3>2.1 Standard Products</h3>
      <p>Standard, non-personalized items may be returned if:</p>
      <ul>
        <li>Item is in original, unused condition</li>
        <li>Original packaging and tags are intact</li>
        <li>Return is initiated within 30 days of delivery</li>
        <li>Item has not been engraved or personalized</li>
      </ul>

      <h3>2.2 Defective or Damaged Items</h3>
      <p>If your item arrives defective or damaged, we will:</p>
      <ul>
        <li>Accept returns beyond the 30-day window</li>
        <li>Provide a full refund or replacement</li>
        <li>Cover return shipping costs</li>
        <li>Require photos of the defect or damage</li>
      </ul>

      <h3>2.3 Wrong Item Shipped</h3>
      <p>If we shipped the wrong item:</p>
      <ul>
        <li>Contact us immediately</li>
        <li>We'll arrange for return pickup at no cost to you</li>
        <li>We'll ship the correct item or provide a full refund</li>
      </ul>

      <h2>3. Non-Returnable Items</h2>
      <p>The following items cannot be returned:</p>
      <ul>
        <li>
          <strong>Custom Engraved Items:</strong> Any item with personalized text, designs, or engraving
        </li>
        <li>
          <strong>Final Sale Items:</strong> Items marked as "Final Sale" at time of purchase
        </li>
        <li>
          <strong>Clearance Items:</strong> Items purchased from clearance sections
        </li>
        <li>
          <strong>Gift Cards:</strong> Digital or physical gift cards
        </li>
        <li>
          <strong>Used or Damaged Items:</strong> Items showing signs of use or customer-caused damage
        </li>
        <li>
          <strong>Items Without Original Packaging:</strong> Items returned without original tags and packaging
        </li>
      </ul>

      <h2>4. How to Return an Item</h2>
      <h3>4.1 Initiate a Return</h3>
      <p>To start a return:</p>
      <ol>
        <li>Log into your account and go to Order History</li>
        <li>Select the order containing the item you want to return</li>
        <li>Click "Request Return" and select the item(s)</li>
        <li>Choose a reason for the return</li>
        <li>Submit your return request</li>
      </ol>
      <p>
        Alternatively, you can contact customer service at support@customcraft.com or call 1-800-CUSTOM-1 for
        assistance.
      </p>

      <h3>4.2 Receive Return Authorization</h3>
      <p>Once your return request is approved, you'll receive:</p>
      <ul>
        <li>Return authorization number (RMA)</li>
        <li>Return shipping label (if applicable)</li>
        <li>Instructions for packaging and shipping</li>
        <li>Expected refund timeline</li>
      </ul>

      <h3>4.3 Package Your Return</h3>
      <p>When packaging your return:</p>
      <ul>
        <li>Use the original packaging if possible</li>
        <li>Include all original tags and accessories</li>
        <li>Pack securely to prevent damage during shipping</li>
        <li>Include the RMA number inside the package</li>
        <li>Attach the return shipping label to the outside</li>
      </ul>

      <h3>4.4 Ship Your Return</h3>
      <p>Return shipping options:</p>
      <ul>
        <li>
          <strong>Standard Returns:</strong> Customer pays return shipping (deducted from refund)
        </li>
        <li>
          <strong>Defective/Wrong Item:</strong> We provide free return shipping label
        </li>
        <li>
          <strong>Premium Return Service:</strong> Prepaid label available for $7.99 (optional)
        </li>
      </ul>

      <h2>5. Return Shipping Costs</h2>
      <ul>
        <li>
          <strong>Customer-Initiated Returns:</strong> $9.99 deducted from refund
        </li>
        <li>
          <strong>Defective/Damaged Items:</strong> Free return shipping
        </li>
        <li>
          <strong>Wrong Item Shipped:</strong> Free return shipping
        </li>
        <li>
          <strong>International Returns:</strong> Customer responsible for return shipping costs
        </li>
      </ul>

      <h2>6. Refund Process</h2>
      <h3>6.1 Refund Timeline</h3>
      <p>Once we receive your return:</p>
      <ul>
        <li>Inspection: 2-3 business days</li>
        <li>Refund processing: 3-5 business days</li>
        <li>Bank/card processing: 5-10 business days</li>
        <li>Total time: 10-18 business days from return receipt</li>
      </ul>

      <h3>6.2 Refund Methods</h3>
      <p>Refunds are issued to the original payment method:</p>
      <ul>
        <li>
          <strong>Credit/Debit Card:</strong> Refunded to the original card
        </li>
        <li>
          <strong>PayPal:</strong> Refunded to your PayPal account
        </li>
        <li>
          <strong>Gift Card:</strong> Refunded as store credit
        </li>
      </ul>

      <h3>6.3 Partial Refunds</h3>
      <p>Partial refunds may be issued for:</p>
      <ul>
        <li>Items showing signs of use or wear</li>
        <li>Items missing original packaging or tags</li>
        <li>Items returned after 30 days (at our discretion)</li>
        <li>Returns requiring restocking fees</li>
      </ul>

      <h2>7. Exchanges</h2>
      <h3>7.1 Exchange Policy</h3>
      <p>We do not offer direct exchanges. To exchange an item:</p>
      <ol>
        <li>Return the original item for a refund</li>
        <li>Place a new order for the desired item</li>
        <li>This ensures you receive the correct item quickly</li>
      </ol>

      <h3>7.2 Size Exchanges (Wearables)</h3>
      <p>For clothing or wearable items:</p>
      <ul>
        <li>Follow standard return process</li>
        <li>Mention in return notes that you need a different size</li>
        <li>We'll expedite processing to minimize wait time</li>
      </ul>

      <h2>8. Restocking Fees</h2>
      <p>A 15% restocking fee may apply to:</p>
      <ul>
        <li>Large or bulky items</li>
        <li>Special order items</li>
        <li>Items returned without original packaging</li>
        <li>Items returned after 30 days</li>
      </ul>
      <p>Restocking fees will be communicated when you initiate the return.</p>

      <h2>9. Cancelled Orders</h2>
      <h3>9.1 Before Processing</h3>
      <p>If your order hasn't been processed yet:</p>
      <ul>
        <li>Contact us immediately at support@customcraft.com</li>
        <li>We'll attempt to cancel the order</li>
        <li>Full refund if cancellation is successful</li>
      </ul>

      <h3>9.2 After Processing</h3>
      <p>If your order has already been processed:</p>
      <ul>
        <li>We cannot cancel the order</li>
        <li>You'll need to follow standard return process once delivered</li>
        <li>Return shipping costs will apply</li>
      </ul>

      <h2>10. Custom Engraved Items</h2>
      <h3>10.1 Error on Our Part</h3>
      <p>If we made an error in your custom engraving:</p>
      <ul>
        <li>Contact us with photos of the item</li>
        <li>We'll create a replacement at no charge</li>
        <li>Original item does not need to be returned</li>
        <li>Expedited shipping on replacement</li>
      </ul>

      <h3>10.2 Customer Error</h3>
      <p>If the error was in the information you provided:</p>
      <ul>
        <li>Custom items cannot be returned</li>
        <li>We can offer a discount on a replacement order</li>
        <li>Always review proof carefully before approving</li>
      </ul>

      <h2>11. International Returns</h2>
      <p>For international orders:</p>
      <ul>
        <li>Same 30-day return window applies</li>
        <li>Customer pays return shipping costs</li>
        <li>Ensure package is properly declared for customs</li>
        <li>No refund for original international shipping costs</li>
        <li>Customs duties/taxes are non-refundable</li>
      </ul>

      <h2>12. Refund Status</h2>
      <p>To check your refund status:</p>
      <ul>
        <li>Log into your account and view order history</li>
        <li>Check your email for refund confirmation</li>
        <li>Contact customer service for updates</li>
        <li>Allow full processing time before inquiring</li>
      </ul>

      <h2>13. Lost Return Packages</h2>
      <p>If your return package is lost in transit:</p>
      <ul>
        <li>Keep your shipping receipt and tracking number</li>
        <li>Contact us if tracking shows no movement for 10+ days</li>
        <li>We'll work with the carrier to locate the package</li>
        <li>Refund will be processed once resolved</li>
      </ul>

      <div className="contact-section">
        <h2>Questions About Returns or Refunds?</h2>
        <p>
          Our customer service team is here to help with any return or refund questions:
          <br />
          Email: support@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1
          <br />
          Hours: Monday - Friday, 9 AM - 5 PM PST
        </p>
        <p style={{ marginTop: '15px' }}>
          We're committed to making the return process as smooth as possible. Don't hesitate to reach out if you need
          assistance!
        </p>
      </div>
    </div>
  );
};

export default ReturnsRefunds;
