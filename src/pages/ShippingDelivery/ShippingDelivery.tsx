import React from 'react';
import '../Legal/LegalPage.css';

// TODO: Review and update shipping information with actual carrier details, rates, and timelines
const ShippingDelivery: React.FC = () => {
  return (
    <div className="legal-page">
      <h1>Shipping & Delivery</h1>
      <p className="last-updated">Last Updated: January 12, 2026</p>

      <p>
        At CustomCraft, we're committed to getting your custom engraved items to you quickly and safely. This page
        outlines our shipping policies, delivery timelines, and what you can expect when you place an order.
      </p>

      <h2>1. Processing Time</h2>
      <h3>1.1 Standard Products</h3>
      <p>Most orders are processed and ready to ship within:</p>
      <ul>
        <li>Standard items: 1-2 business days</li>
        <li>Custom engraved items: 3-5 business days</li>
        <li>Complex custom designs: 5-7 business days</li>
      </ul>
      <p>
        Processing time begins after we receive payment and approve your custom design (if applicable). You will
        receive a confirmation email once your order has been processed.
      </p>

      <h3>1.2 Peak Season Processing</h3>
      <p>During peak seasons (holidays, special events), processing times may be extended by 2-3 business days.</p>

      <h2>2. Shipping Methods & Rates</h2>
      <h3>2.1 Domestic Shipping (United States)</h3>
      <ul>
        <li>
          <strong>Standard Shipping:</strong> $9.99 (5-7 business days)
        </li>
        <li>
          <strong>Expedited Shipping:</strong> $19.99 (2-3 business days)
        </li>
        <li>
          <strong>Express Shipping:</strong> $34.99 (1-2 business days)
        </li>
        <li>
          <strong>Free Standard Shipping:</strong> On orders over $100
        </li>
      </ul>

      <h3>2.2 International Shipping</h3>
      <p>We currently ship to select countries. International shipping rates are calculated at checkout and vary by:</p>
      <ul>
        <li>Destination country</li>
        <li>Package weight and dimensions</li>
        <li>Selected shipping method</li>
      </ul>
      <p>International orders typically take 10-21 business days for delivery.</p>

      <h2>3. Shipping Carriers</h2>
      <p>We partner with trusted carriers to ensure reliable delivery:</p>
      <ul>
        <li>USPS (United States Postal Service)</li>
        <li>UPS (United Parcel Service)</li>
        <li>FedEx</li>
      </ul>
      <p>
        The carrier used for your order depends on your location, package size, and selected shipping method. You'll
        receive tracking information once your order ships.
      </p>

      <h2>4. Order Tracking</h2>
      <h3>4.1 Tracking Information</h3>
      <p>Once your order ships, you will receive:</p>
      <ul>
        <li>Shipping confirmation email with tracking number</li>
        <li>Link to track your package in real-time</li>
        <li>Estimated delivery date</li>
      </ul>

      <h3>4.2 Tracking Your Order</h3>
      <p>You can track your order by:</p>
      <ul>
        <li>Clicking the tracking link in your shipping confirmation email</li>
        <li>Logging into your account and viewing order history</li>
        <li>Visiting the carrier's website directly with your tracking number</li>
      </ul>

      <h2>5. Delivery</h2>
      <h3>5.1 Delivery Requirements</h3>
      <ul>
        <li>Signature may be required for high-value orders ($500+)</li>
        <li>Package will be left at your doorstep if no signature is required</li>
        <li>Carrier will attempt delivery up to 3 times</li>
        <li>Ensure shipping address is accurate and complete</li>
      </ul>

      <h3>5.2 Failed Delivery Attempts</h3>
      <p>If delivery cannot be completed after 3 attempts:</p>
      <ul>
        <li>Package will be held at local carrier facility for pickup</li>
        <li>You'll receive instructions on how to arrange pickup or redelivery</li>
        <li>Package will be held for 5-7 business days before being returned to us</li>
      </ul>

      <h2>6. Shipping Restrictions</h2>
      <h3>6.1 Addresses We Cannot Ship To</h3>
      <ul>
        <li>PO Boxes (for certain shipping methods)</li>
        <li>APO/FPO addresses (limited options available)</li>
        <li>Countries with shipping restrictions or embargoes</li>
      </ul>

      <h3>6.2 Weather and Natural Disasters</h3>
      <p>
        Delivery may be delayed due to severe weather, natural disasters, or other circumstances beyond our control. We
        will notify you of any significant delays.
      </p>

      <h2>7. International Orders</h2>
      <h3>7.1 Customs and Duties</h3>
      <p>International customers are responsible for:</p>
      <ul>
        <li>All customs fees, duties, and taxes</li>
        <li>Compliance with local import regulations</li>
        <li>Any additional charges imposed by customs authorities</li>
      </ul>
      <p>These charges are not included in your order total and are collected upon delivery.</p>

      <h3>7.2 Customs Clearance Delays</h3>
      <p>
        International shipments may experience delays during customs clearance. Typical clearance takes 2-5 business
        days but can vary by country.
      </p>

      <h2>8. Address Changes</h2>
      <h3>8.1 Before Shipment</h3>
      <p>
        If you need to change your shipping address before your order ships, contact us immediately at
        support@customcraft.com. We'll update your address if the order hasn't been processed yet.
      </p>

      <h3>8.2 After Shipment</h3>
      <p>
        Once an order has shipped, we cannot change the delivery address. You may be able to redirect the package by
        contacting the carrier directly using your tracking number.
      </p>

      <h2>9. Lost or Damaged Packages</h2>
      <h3>9.1 Lost Packages</h3>
      <p>If your tracking shows the package was delivered but you haven't received it:</p>
      <ul>
        <li>Check with neighbors or household members</li>
        <li>Look around your property (porches, garages, etc.)</li>
        <li>Contact us within 48 hours of the delivery date</li>
        <li>We'll work with the carrier to locate your package</li>
      </ul>

      <h3>9.2 Damaged Packages</h3>
      <p>If your package arrives damaged:</p>
      <ul>
        <li>Take photos of the damaged packaging and items</li>
        <li>Contact us within 48 hours of delivery</li>
        <li>Provide your order number and photos</li>
        <li>We'll arrange for a replacement or refund</li>
      </ul>

      <h2>10. Shipping Insurance</h2>
      <p>All orders are automatically insured up to $100 at no additional cost. For high-value orders:</p>
      <ul>
        <li>Orders $100-$500: Included insurance</li>
        <li>Orders over $500: Additional insurance available at checkout</li>
        <li>Insurance covers loss or damage during transit</li>
      </ul>

      <h2>11. Multiple Shipments</h2>
      <p>
        If your order contains multiple items, they may ship separately to ensure faster delivery. You'll receive
        tracking information for each shipment. There's no additional shipping charge for split shipments.
      </p>

      <h2>12. Shipping to Multiple Addresses</h2>
      <p>
        If you need to ship items from one order to multiple addresses, please place separate orders for each
        destination. We cannot split a single order to multiple addresses.
      </p>

      <div className="contact-section">
        <h2>Shipping Questions?</h2>
        <p>
          If you have questions about shipping or need assistance with your delivery, please contact us:
          <br />
          Email: support@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1
          <br />
          We're here to help Monday - Friday, 9 AM - 5 PM PST
        </p>
      </div>
    </div>
  );
};

export default ShippingDelivery;
