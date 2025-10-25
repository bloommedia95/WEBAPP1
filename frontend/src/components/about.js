import React from "react";
import { Link } from "react-router-dom";
import "./about.css";
import Navbar from "./navbar";
import Footer from "./footer";

const About = () => {
  return (
    <>
      <Navbar />

      {/* About Banner */}
      <section className="about-section w-full">
        <div className="about-images w-full">
          <img src="/img/about.jpg" alt="about" />
          <h2 className="about-title">ABOUT US</h2>
        </div>
      </section>

      {/* About Content */}
      <section className="about-container">
        <span className="star star-top-right">✦</span>
        <span className="star star-bottom-left">✦</span>

        <div className="about-content">
          <div className="about-text">
            <p>
              At Fashion Hub, we believe fashion is more than just clothing —
              it’s a way to express your personality, confidence, and lifestyle.
              Our mission is to bring the latest trends, timeless styles, and
              everyday essentials to your doorstep with just a click.
            </p>
            <p>
              From chic western wear to elegant ethnic outfits, from trendy
              footwear to must-have accessories, we curate collections that suit
              every mood, occasion, and season. Each product is carefully
              handpicked to ensure premium quality, comfort, and affordability,
              so you never have to compromise on style.
            </p>
            <p>
              With secure shopping, exclusive deals, easy returns, and doorstep
              delivery, Fashion Hub makes online shopping not just convenient
              but truly delightful. Whether you’re dressing up for a big
              celebration or refreshing your daily wardrobe, we’re here to make
              sure you always look your best.
            </p>
          </div>

          <div className="about-image">
            <img src="/img/about1.png" alt="Fashion Model" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature">
          <img src="/img/wallet.png" alt="Payment Options" />
          <p>
            Secure & Multiple <br /> Payment Options
          </p>
        </div>
        <div className="feature">
          <img src="/img/delivery.png" alt="Shipping Options" />
          <p>
            Multiple Shipping <br /> Options
          </p>
        </div>
        <div className="feature">
          <img src="/img/woman.png" alt="Fashion Blog" />
          <p>
            Fashion Blog & <br /> Style Guide
          </p>
        </div>
        <div className="feature">
          <img src="/img/return.png" alt="Easy Returns" />
          <p>
            Easy Returns & <br /> Exchange Policy
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
