import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';
import SearchBar from '../../components/Search/SearchBar';
import blogService from '../../services/blog.service';
import type { BlogPost } from '../../types/blog.types';
import './BlogPage.css';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const pageSize = 9;

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    const result = await blogService.getBlogPosts(currentPage, pageSize, searchQuery);
    setPosts(result.posts);
    setPagination(result.pagination);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.pageCount) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1>Our Blog</h1>
        <p>Latest news, tips, and inspiration for custom crafts</p>
      </header>

      <div className="blog-container">
        {/* Blog Posts Grid */}
        <main className="blog-main">
          {loading ? (
            <div className="blog-loading">
              <p>Loading blog posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="blog-empty">
              <p>No blog posts found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
            </div>
          ) : (
            <>
              <div className="blog-grid">
                {posts.map((post) => (
                  <article key={post.id} className="blog-card">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="blog-image" />
                    ) : (
                      <div className="blog-image-placeholder">No Image</div>
                    )}
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="blog-date">
                          <FiCalendar /> {formatDate(post.publishedAt)}
                        </span>
                        {post.category && (
                          <span className="blog-category">
                            <BiCategoryAlt /> {post.category}
                          </span>
                        )}
                      </div>
                      <h2 className="blog-title">{post.title}</h2>
                      <p className="blog-excerpt">{post.description}</p>
                      <button onClick={() => handleBlogClick(post.slug)} className="read-more">
                        Read More <FiArrowRight />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pageCount > 1 && (
                <div className="blog-pagination">
                  <button className="pagination-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    <FiChevronLeft /> Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {pagination.pageCount}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === pagination.pageCount}
                  >
                    Next <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          {/* Search */}
          <div className="sidebar-section">
            <h3>Search</h3>
            <SearchBar
              value={searchQuery}
              onSearch={handleSearch}
              placeholder="Search blog posts..."
              debounceMs={500}
            />
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
