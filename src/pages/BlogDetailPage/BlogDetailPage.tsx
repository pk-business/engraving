import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiArrowLeft, FiUser } from 'react-icons/fi';
import { BiCategoryAlt } from 'react-icons/bi';
import blogService from '../../services/blog.service';
import type { BlogPost, Comment } from '../../types/blog.types';
import './BlogDetailPage.css';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentForm, setCommentForm] = useState({
    author: '',
    email: '',
    content: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  const fetchBlogPost = async () => {
    if (!slug) return;
    setLoading(true);
    const blogPost = await blogService.getBlogPostBySlug(slug);
    setPost(blogPost);
    setLoading(false);
  };

  const fetchComments = async () => {
    if (!post) return;
    const blogComments = await blogService.getComments(post.id);
    setComments(blogComments);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentForm.author || !commentForm.email || !commentForm.content) {
      return;
    }

    setCommentLoading(true);
    setSubmitStatus('idle');

    const newComment = await blogService.addComment(
      post.id,
      commentForm.author,
      commentForm.email,
      commentForm.content
    );

    setCommentLoading(false);

    if (newComment) {
      setSubmitStatus('success');
      setComments([newComment, ...comments]);
      setCommentForm({ author: '', email: '', content: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } else {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatCommentDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-loading">
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-error">
          <h2>Blog Post Not Found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/blog')} className="back-btn">
            <FiArrowLeft /> Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <button onClick={() => navigate('/blog')} className="back-btn">
          <FiArrowLeft /> Back to Blog
        </button>

        <article className="blog-detail-article">
          {/* Blog Header */}
          <header className="blog-detail-header">
            <div className="blog-detail-meta">
              <span className="blog-detail-date">
                <FiCalendar /> {formatDate(post.publishedAt)}
              </span>
              {post.category && (
                <span className="blog-detail-category">
                  <BiCategoryAlt /> {post.category}
                </span>
              )}
              <span className="blog-detail-author">
                <FiUser /> {post.author}
              </span>
            </div>
            <h1 className="blog-detail-title">{post.title}</h1>
            {post.tags && post.tags.length > 0 && (
              <div className="blog-detail-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="blog-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="blog-detail-image-wrapper">
              <img src={post.imageUrl} alt={post.title} className="blog-detail-image" />
            </div>
          )}

          {/* Blog Content */}
          <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Comments Section */}
        <section className="comments-section">
          <h2 className="comments-title">Comments ({comments.length})</h2>

          {/* Comment Form */}
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <h3>Leave a Comment</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author">Name *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={commentForm.author}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={commentForm.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="content">Comment *</label>
              <textarea
                id="content"
                name="content"
                value={commentForm.content}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="Share your thoughts..."
              />
            </div>
            <button type="submit" className="submit-comment-btn" disabled={commentLoading}>
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
            {submitStatus === 'success' && <p className="submit-success">Comment posted successfully!</p>}
            {submitStatus === 'error' && <p className="submit-error">Failed to post comment. Please try again.</p>}
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{formatCommentDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailPage;
