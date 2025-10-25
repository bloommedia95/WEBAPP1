import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import Footer from "./footer";
import "./blog.css";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();          {/* Dynamic Extra Sections */}
  const [article, setArticle] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dynamic states
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', message: '' });
  const [allBlogs, setAllBlogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // --- Dynamic search suggestion logic ---
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) {
      // Show latest blogs if input is empty
      return allBlogs.slice(0, 6);
    }
    return allBlogs.filter(blog =>
      blog.title && blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);
  }, [searchTerm, allBlogs]);
  const handleSuggestionClick = (blog) => {
    window.location.href = `/blog/${blog._id}`;
  };

  // Predefined categories for the sidebar
  const predefinedCategories = [
    { name: 'Women Fashion', route: '/categories/Clothing', checked: false },
    { name: 'Men Fashion', route: '/categories/Clothing', checked: false },
    { name: 'Women Footwear', route: '/categories/Footwear', checked: false },
    { name: 'Men Footwear', route: '/categories/Footwear', checked: false },
    { name: 'Women Cosmetic', route: '/categories/Cosmetic', checked: false },
    { name: 'Men Cosmetic', route: '/categories/Cosmetic', checked: false },
    { name: 'Bags', route: '/categories/Bags', checked: false },
    { name: 'Accessories', route: '/categories/Acessiories', checked: false }
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleResponse = await axios.get(`http://localhost:5000/api/blog/${id}`);
        setArticle(articleResponse.data);
        
        const blogsResponse = await axios.get("http://localhost:5000/api/blog");
        if (Array.isArray(blogsResponse.data)) {
          setAllBlogs(blogsResponse.data);
          
          // Find current article index for navigation
          const currentIdx = blogsResponse.data.findIndex(blog => blog._id === id);
          setCurrentIndex(currentIdx);
          
          const otherBlogs = blogsResponse.data
            .filter(blog => blog._id !== id)
            .slice(0, 5);
          setRecentBlogs(otherBlogs);
          
          // Extract unique categories from all blogs
          const uniqueCategories = [...new Set(
            blogsResponse.data
              .filter(blog => blog.categories && blog.categories.length > 0)
              .flatMap(blog => blog.categories)
          )];
          setCategories(uniqueCategories);
        }
        
        // Fetch comments for this article
        try {
          const commentsResponse = await axios.get(`http://localhost:5000/api/blog/${id}/comments`);
          setComments(commentsResponse.data || []);
        } catch (commentError) {
          console.log('No comments endpoint available');
          setComments([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        if (err.response) {
          setError(`Server error: ${err.response.status}`);
        } else if (err.request) {
          setError("No response from server. Is your backend running?");
        } else {
          setError(`Request error: ${err.message}`);
        }
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Dynamic functions
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to blog page with search
      window.location.href = `/blog?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleCategoryNavigation = (route) => {
    navigate(route);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.name && newComment.email && newComment.message) {
      try {
        // Add comment locally (in real app, send to backend)
        const comment = {
          id: Date.now(),
          name: newComment.name,
          email: newComment.email,
          message: newComment.message,
          date: new Date().toISOString()
        };
        
        setComments(prev => [...prev, comment]);
        setNewComment({ name: '', email: '', message: '' });
        
        // In real app, send to backend:
        // await axios.post(`http://localhost:5000/api/blog/${id}/comments`, comment);
        
        alert('Comment posted successfully!');
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Error posting comment. Please try again.');
      }
    }
  };

  const getNextArticle = () => {
    if (currentIndex >= 0 && currentIndex < allBlogs.length - 1) {
      return allBlogs[currentIndex + 1];
    }
    return null;
  };

  const getPrevArticle = () => {
    if (currentIndex > 0) {
      return allBlogs[currentIndex - 1];
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="blog-section">
          <div className="blog-images">
            <img src="/img/blog.jpg" alt="blog" />
            <h2 className="blog-title">Loading article...</h2>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="blog-section">
          <div className="blog-images">
            <img src="/img/blog.jpg" alt="blog" />
            <h2 className="blog-title">Error Loading Article</h2>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <section className="blog-section">
          <div className="blog-images">
            <img src="/img/blog.jpg" alt="blog" />
            <h2 className="blog-title">Article Not Found</h2>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* About Banner */}
      <section className="blog-section">
        <div className="blog-images">
          {article.bannerImage ? (
            <img 
              src={`http://localhost:5000${article.bannerImage}`} 
              alt={article.title}
              onError={(e) => {
                e.target.src = "/img/blog.jpg";
              }}
            />
          ) : (
            <img src="/img/blog.jpg" alt="blog" />
          )}
          <div className="blog-title highlight-right">
            <span>{article.title}</span>
          </div>
        </div>
      </section>

      <div className="article-container">
        {/* Sidebar */}
        <aside className="sidebar">
          {/* Search */}
          <div className="search-box">
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 37 }} autoComplete="off">
              <input
                type="text"
                placeholder="Search our blog"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, minWidth: 0 }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                <img src="/img/search.png" alt="Search" className="search-icon" style={{ width: 22, height: 22, marginLeft: 4 }} />
              </button>
            </form>
            {/* Dynamic Suggestions */}
            {showSuggestions && (
              <ul className="search-suggestions">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map(blog => (
                    <li
                      key={blog._id}
                      onMouseDown={() => handleSuggestionClick(blog)}
                    >
                      {blog.title}
                    </li>
                  ))
                ) : (
                  <li style={{ color: '#888', cursor: 'default' }}>No results found</li>
                )}
              </ul>
            )}
          </div>

          {/* Recent Blogs */}
          <div className="recent-blogs">
            <h3>Recent Blogs</h3>
            <ul>
              {recentBlogs.map((blog) => (
                <li key={blog._id}>
                  <Link to={`/article/${blog._id}`}>
                    {blog.title}
                    <br />
                    <span>
                      Issued on: {new Date(blog.createdAt || blog.publishDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories - Dynamic with Navigation */}
          <div className="categories">
            <h3>Categories</h3>
            {predefinedCategories.map((category) => (
              <label key={category.name} className="category-item">
                <input 
                  type="checkbox" 
                  checked={false}
                  onChange={() => handleCategoryNavigation(category.route)}
                /> 
                <span 
                  className="category-name"
                  onClick={() => handleCategoryNavigation(category.route)}
                  style={{ cursor: 'pointer' }}
                >
                  {category.name}
                </span>
              </label>
            ))}
            
            {/* Dynamic categories from database */}
            {categories.length > 0 && (
              <div className="dynamic-categories">
                <h4>Blog Categories</h4>
                {categories.map((category) => (
                  <label key={category} className="category-item">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    /> 
                    <span className="category-name">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="article-content">
          {/* <h1 className="article-main-title">{article.title}</h1> */}
          
          {/* Main Article Content */}
          <div className="main-content-section">
            {/* {article.content ? (
              article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index} className="main-paragraph">{paragraph}</p>
              ))
            ) : (
              <p className="main-paragraph">
                Winter fashion is all about layering, comfort, and sophistication.
                To stay chic during the colder months, building a winter wardrobe
                with timeless essentials is a must. A classic coat is the cornerstone
                of winter dressing wool coats, trench coats, and padded puffers are
                perfect for both warmth and elegance. Neutral shades like black,
                grey, and beige ensure versatility, while bold colors add personality
                to your look. Pair these with chunky knit sweaters or oversized
                cardigans for a cozy yet fashionable vibe. Knits in textured patterns
                or turtleneck styles are especially trendy this season and can be
                dressed up or down effortlessly.
              </p>
            )} */}
          </div>

          {/* Dynamic Extra Sections */}
          {article.extraSections && article.extraSections.length > 0 ? (
            article.extraSections.map((section, index) => (
              <div key={index} className="content-section">
                <h2 className="section-title">
                  {section.title || `Section ${index + 1}`}
                </h2>
                
                <p className="section-text">
                  {section.content || 'Content for this section.'}
                </p>
                
                {section.images && section.images.length > 0 && (
                  <div className="section-images">
                    {section.images.slice(0, 2).map((image, imgIndex) => (
                      <img 
                        key={imgIndex}
                        src={`http://localhost:5000${image}`} 
                        alt={`${section.title} ${imgIndex + 1}`}
                        className="section-image"
                        onError={(e) => {
                          e.target.src = `/img/blog-default-${index + 1}.jpg`;
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            // Fallback content with design matching the attachment
            <>
              <div className="content-section">
                <h2 className="section-title">Stay Stylish and Cozy This Winter</h2>
                
                <p className="section-text">
                  Winter fashion is all about layering, comfort, and sophistication. To stay chic during
                  the colder months, building a winter wardrobe with timeless essentials is a must. A
                  classic coat is the cornerstone of winter dressing—wool coats, trench coats, and
                  padded puffers are perfect for both warmth and elegance. Neutral shades like black,
                  grey, and beige ensure versatility, while bold colors add personality to your look. Pair
                  these with chunky knit sweaters or oversized cardigans for a cozy yet fashionable
                  vibe. Knits in textured patterns or turtleneck styles are especially trendy this season
                  and can be dressed up or down effortlessly.
                </p>
                
                <div className="section-images">
                  <img src="/img/winter-style-1.jpg" alt="Winter Style 1" className="section-image" />
                  <img src="/img/winter-style-2.jpg" alt="Winter Style 2" className="section-image" />
                </div>
              </div>
              
              <div className="content-section">
                <h2 className="section-title">Must-Have Winter Fashion Staples</h2>
                
                <p className="section-text">
                  Footwear and accessories define your style during winter. A good pair of boots—whether
                  ankle-length, combat, or knee-high—instantly elevates your outfit while keeping you warm.
                  Pair them with corduroy trousers, wool pants, or fleece-lined leggings for both comfort
                  and style. Scarves and wraps are another must-have: from plaid wool scarves to luxurious
                  cashmere wraps, these add warmth and transform simple outfits into stylish ensembles.
                  Don't forget about layering with both comfort and style. Scarves and wraps are another
                  must-have from plaid wool scarves to luxurious cashmere wraps, these add warmth and
                  transform simple outfits into stylish ensembles.
                </p>
                
                <div className="section-images">
                  <img src="/img/winter-accessories-1.jpg" alt="Winter Accessories 1" className="section-image" />
                  <img src="/img/winter-accessories-2.jpg" alt="Winter Accessories 2" className="section-image" />
                </div>
              </div>
              
              <div className="content-section">
                <h2 className="section-title">Elevate Your Look With Statement Outerwear</h2>
                
                <p className="section-text">
                  Statement outerwear can transform any winter outfit from basic to bold. Invest in
                  standout pieces like textured coats, colorful puffers, or unique silhouettes that
                  reflect your personal style. Layering is key—start with a fitted base, add a cozy
                  middle layer, and top with your statement piece. Mix textures and colors to create
                  visual interest while staying warm. Don't be afraid to experiment with bold patterns
                  or unexpected color combinations that make you feel confident and stylish.
                </p>
                
                <div className="section-images">
                  <img src="/img/statement-outerwear-1.jpg" alt="Statement Outerwear 1" className="section-image" />
                  <img src="/img/statement-outerwear-2.jpg" alt="Statement Outerwear 2" className="section-image" />
                </div>
              </div>
            </>
          )}

          {/* Navigation - Dynamic */}
          <div className="post-navigation">
            {getPrevArticle() ? (
              <Link to={`/article/${getPrevArticle()._id}`} className="prev-post">
                ⬅ {getPrevArticle().title.length > 30 
                  ? getPrevArticle().title.substring(0, 30) + '...' 
                  : getPrevArticle().title}
              </Link>
            ) : (
              <span className="prev-post disabled">⬅ No Previous Post</span>
            )}
            
            {getNextArticle() ? (
              <Link to={`/article/${getNextArticle()._id}`} className="next-post">
                {getNextArticle().title.length > 30 
                  ? getNextArticle().title.substring(0, 30) + '...' 
                  : getNextArticle().title} ➡
              </Link>
            ) : (
              <span className="next-post disabled">No Next Post ➡</span>
            )}
          </div>

          {/* Comment Section - Fully Dynamic */}
          <div className="comment-section">
            <h3 className="comment-title">
              💬 Comments ({comments.length})
            </h3>
            
            {/* Display existing comments */}
            {comments.length > 0 && (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id || comment._id} className="comment-item">
                    <div className="comment-header">
                      <strong>{comment.name}</strong>
                      <span className="comment-date">
                        {new Date(comment.date || comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.message || comment.text}</p>
                  </div>
                ))}
              </div>
            )}
            
            <h4 className="add-comment-title">Leave a Comment</h4>
            <p className="comment-desc">
              We'd love to hear your thoughts! Share your opinions, styling
              tips, or questions in the comments below. Your feedback helps us
              create better content for you.
            </p>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <div className="input-row">
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={newComment.name}
                  onChange={(e) => setNewComment(prev => ({...prev, name: e.target.value}))}
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={newComment.email}
                  onChange={(e) => setNewComment(prev => ({...prev, email: e.target.value}))}
                  required 
                />
              </div>
              <textarea 
                placeholder="Drop Comment" 
                value={newComment.message}
                onChange={(e) => setNewComment(prev => ({...prev, message: e.target.value}))}
                required
              ></textarea>
              <button type="submit">Post Comment</button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default ArticleDetail;