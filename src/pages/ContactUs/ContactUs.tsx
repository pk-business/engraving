import React, { useState } from 'react';
import '../Legal/LegalPage.css';
import './ContactUs.css';

// TODO: Update contact information and form submission endpoint once decided
const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="legal-page contact-page">
      <h1>Contact Us</h1>
      <p>
        We're here to help! Whether you have questions about our products, need assistance with an order, or want to
        discuss custom engraving options, we'd love to hear from you.
      </p>

      <div className="contact-content">
        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message <span className="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us how we can help you..."
              />
            </div>

            {submitStatus === 'success' && (
              <div className="form-message success">
                Thank you for contacting us! We'll get back to you within 24 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-message error">
                Sorry, there was an error submitting your message. Please try again or contact us directly.
              </div>
            )}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="contact-info-section">
          <h2>Other Ways to Reach Us</h2>

          <div className="contact-method">
            <h3>Email</h3>
            <p>
              <a href="mailto:support@customcraft.com">support@customcraft.com</a>
            </p>
            <p className="contact-note">We typically respond within 24 hours</p>
          </div>

          <div className="contact-method">
            <h3>Phone</h3>
            <p>
              <a href="tel:1-800-CUSTOM-1">1-800-CUSTOM-1</a>
            </p>
            <p className="contact-note">Monday - Friday: 9 AM - 5 PM PST</p>
          </div>

          <div className="contact-method">
            <h3>Mail</h3>
            <p>
              CustomCraft Customer Service
              <br />
              123 Main Street
              <br />
              San Francisco, CA 94102
            </p>
          </div>

          <div className="contact-method">
            <h3>Response Times</h3>
            <ul>
              <li>Email: Within 24 hours</li>
              <li>Phone: Immediate during business hours</li>
              <li>Mail: 5-7 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
