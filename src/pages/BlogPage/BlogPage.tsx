import React from 'react';
import { FiSearch, FiCalendar, FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';
import './BlogPage.css';

const BlogPage: React.FC = () => {
  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1>Our Blog</h1>
        <p>Latest news, tips, and inspiration for custom crafts</p>
      </header>

      <div className="blog-container">
        {/* Blog Posts Grid */}
        <main className="blog-main">
          <div className="blog-grid">
            {/* Placeholder for blog posts */}
            <article className="blog-card">
              <div className="blog-image-placeholder">Blog Image</div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date"><FiCalendar /> Dec 12, 2025</span>
                  <span className="blog-category"><BiCategoryAlt /> Tips & Tricks</span>
                </div>
                <h2 className="blog-title">
                  How to Choose the Perfect Material for Your Custom Gift
                </h2>
                <p className="blog-excerpt">
                  Discover the best materials for different occasions and learn
                  how to make your custom gifts truly special...
                </p>
                <a href="#" className="read-more">
                  Read More <FiArrowRight />
                </a>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-image-placeholder">Blog Image</div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date"><FiCalendar /> Dec 5, 2025</span>
                  <span className="blog-category"><BiCategoryAlt /> Inspiration</span>
                </div>
                <h2 className="blog-title">
                  Top 10 Wedding Gift Ideas with Laser Engraving
                </h2>
                <p className="blog-excerpt">
                  Looking for unique wedding gift ideas? Check out our curated
                  list of laser-engraved items that couples will love...
                </p>
                <a href="#" className="read-more">
                  Read More <FiArrowRight />
                </a>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-image-placeholder">Blog Image</div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date"><FiCalendar /> Nov 28, 2025</span>
                  <span className="blog-category"><BiCategoryAlt /> Behind the Scenes</span>
                </div>
                <h2 className="blog-title">
                  The Art of CNC Cutting: From Design to Reality
                </h2>
                <p className="blog-excerpt">
                  Take a behind-the-scenes look at our CNC cutting process and
                  see how your custom designs come to life...
                </p>
                <a href="#" className="read-more">
                  Read More <FiArrowRight />
                </a>
              </div>
            </article>
          </div>

          {/* Pagination */}
          <div className="blog-pagination">
            <button className="pagination-btn">
              <FiChevronLeft /> Previous
            </button>
            <span className="pagination-info">Page 1 of 1</span>
            <button className="pagination-btn">
              Next <FiChevronRight />
            </button>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          {/* Search */}
          <div className="sidebar-section">
            <h3>Search</h3>
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="search"
                placeholder="Search blog posts..."
                className="blog-search"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="sidebar-section">
            <h3>Categories</h3>
            <ul className="category-list">
              <li>
                <a href="#">Tips & Tricks</a>
              </li>
              <li>
                <a href="#">Inspiration</a>
              </li>
              <li>
                <a href="#">Behind the Scenes</a>
              </li>
              <li>
                <a href="#">Customer Stories</a>
              </li>
              <li>
                <a href="#">Product Updates</a>
              </li>
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="sidebar-section">
            <h3>Recent Posts</h3>
            <ul className="recent-posts">
              <li>
                <a href="#">How to Choose the Perfect Material</a>
                <span className="recent-date">Dec 12, 2025</span>
              </li>
              <li>
                <a href="#">Top 10 Wedding Gift Ideas</a>
                <span className="recent-date">Dec 5, 2025</span>
              </li>
              <li>
                <a href="#">The Art of CNC Cutting</a>
                <span className="recent-date">Nov 28, 2025</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sidebar-section newsletter">
            <h3>Subscribe to Newsletter</h3>
            <p>Get weekly updates and special offers</p>
            <div className="newsletter-input-wrapper">
              <MdEmail className="newsletter-icon" />
              <input type="email" placeholder="Your email" />
            </div>
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;
