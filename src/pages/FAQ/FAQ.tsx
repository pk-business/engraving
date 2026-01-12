import React from 'react';
import { useQuery } from '@tanstack/react-query';
import '../Legal/LegalPage.css';
import './FAQ.css';

// TODO: Create FAQ API endpoint in Strapi and update service
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

// Temporary mock data - replace with API call
const mockFAQData: FAQItem[] = [
  {
    id: 1,
    question: 'How long does it take to engrave a custom item?',
    answer:
      'Most custom engraved items are ready to ship within 3-5 business days. Complex designs may take 5-7 business days. You\'ll receive an estimated completion date when you place your order.',
    category: 'Orders & Production',
    order: 1,
  },
  {
    id: 2,
    question: 'Can I see a preview of my engraving before you make it?',
    answer:
      'Yes! For all custom engraved items, we provide a digital proof for your approval before we begin production. You can request changes until you\'re completely satisfied.',
    category: 'Orders & Production',
    order: 2,
  },
  {
    id: 3,
    question: 'What file formats do you accept for custom designs?',
    answer:
      'We accept PNG, JPG, SVG, PDF, and AI files. For best results, vector formats (SVG, AI) are preferred. Images should be high resolution (300 DPI or higher) for optimal engraving quality.',
    category: 'Custom Designs',
    order: 1,
  },
  {
    id: 4,
    question: 'Do you offer free shipping?',
    answer:
      'Yes! We offer free standard shipping on all orders over $100 within the United States. Orders under $100 have a flat rate shipping fee of $9.99.',
    category: 'Shipping',
    order: 1,
  },
  {
    id: 5,
    question: 'Can I return a custom engraved item?',
    answer:
      'Custom engraved items cannot be returned unless there was an error on our part. Please review your proof carefully before approving. If we made a mistake, we\'ll create a replacement at no charge.',
    category: 'Returns',
    order: 1,
  },
  {
    id: 6,
    question: 'What materials can you engrave on?',
    answer:
      'We can engrave on wood, acrylic, leather, metal, glass, and certain plastics. The specific materials available depend on the product. Check the product description for material options.',
    category: 'Custom Designs',
    order: 2,
  },
  {
    id: 7,
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you\'ll receive a tracking number via email. You can also log into your account and view your order history to access tracking information.',
    category: 'Shipping',
    order: 2,
  },
  {
    id: 8,
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to select countries. International shipping rates are calculated at checkout. Delivery typically takes 10-21 business days. Customers are responsible for any customs fees or duties.',
    category: 'Shipping',
    order: 3,
  },
  {
    id: 9,
    question: 'Can I cancel my order after placing it?',
    answer:
      'If your order hasn\'t been processed yet, we can cancel it for a full refund. Contact us immediately at support@customcraft.com. Once processing begins, cancellation is not possible.',
    category: 'Orders & Production',
    order: 3,
  },
  {
    id: 10,
    question: 'What is your return policy?',
    answer:
      'Standard, non-personalized items can be returned within 30 days of delivery in original condition. Custom engraved items are non-returnable. See our Returns & Refunds page for complete details.',
    category: 'Returns',
    order: 2,
  },
];

const FAQ: React.FC = () => {
  // TODO: Replace mock data with actual API call
  const {
    data: faqItems = mockFAQData,
    isLoading,
    isError,
  } = useQuery<FAQItem[]>({
    queryKey: ['faq'],
    queryFn: async () => {
      // TODO: Implement actual API call
      // return FAQService.getFAQs();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      return mockFAQData;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Group FAQs by category
  const groupedFAQs = faqItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  // Sort items within each category by order
  Object.keys(groupedFAQs).forEach((category) => {
    groupedFAQs[category].sort((a, b) => a.order - b.order);
  });

  if (isLoading) {
    return (
      <div className="legal-page faq-page">
        <h1>Frequently Asked Questions</h1>
        <p>Loading FAQs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="legal-page faq-page">
        <h1>Frequently Asked Questions</h1>
        <p>Sorry, we couldn't load the FAQs at this time. Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="legal-page faq-page">
      <h1>Frequently Asked Questions</h1>
      <p className="last-updated">Last Updated: January 12, 2026</p>

      <p>
        Find answers to the most common questions about our products, services, and policies. If you don't find what
        you're looking for, please don't hesitate to contact us.
      </p>

      <div className="faq-container">
        {Object.entries(groupedFAQs).map(([category, items]) => (
          <div key={category} className="faq-category">
            <h2 className="faq-category-title">{category}</h2>
            <div className="faq-items">
              {items.map((item) => (
                <div key={item.id} className="faq-item">
                  <h3 className="faq-question">{item.question}</h3>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h2>Still Have Questions?</h2>
        <p>
          If you couldn't find the answer you're looking for, our customer service team is here to help:
          <br />
          Email: support@customcraft.com
          <br />
          Phone: 1-800-CUSTOM-1
          <br />
          Hours: Monday - Friday, 9 AM - 5 PM PST
        </p>
      </div>
    </div>
  );
};

export default FAQ;
