import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./blog.css";
import Navbar from "./navbar";
import Footer from "./footer";

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API se articles fetch karo
    fetch("http://localhost:5000/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <>
      <Navbar />

      {/* Insights Section */}
      <section
        className="insights-section"
        style={{
          background: "url(/img/blog1.jpg) center/cover no-repeat",
          position: "relative",
        }}
      >
        <div className="insights-container">
          <h2 className="insights-title">
            Insights, Trends &amp; Ideas You'll Love
          </h2>
          <p className="insights-subtitle">
            Stay inspired with style tips, shopping guides, and the latest
            updates from our world.
          </p>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="latest-section">
        <h2 className="latest-title">The Latest</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="latest-grid">
            {articles.slice(0, visibleCount).map((article) => (
              <Link to={`/article/${article._id || article.id}`} key={article._id || article.id}>
                <div className="latest-card">
                  <img 
                    src={`http://localhost:5000${article.bannerImage || article.img || '/img/blog.jpg'}`} 
                    alt={article.title}
                    onError={(e) => {
                      e.target.src = '/img/blog.jpg';
                    }}
                  />
                  <p className="latest-text">{article.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Button tabhi dikhaye jab aur articles bache ho */}
        {visibleCount < articles.length && !loading && (
          <button className="load-btn" onClick={loadMore}>
            Load More Articles
          </button>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Blog;