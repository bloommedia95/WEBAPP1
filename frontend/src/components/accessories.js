import React, { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import "./about.css";
import "./clothing.css";

const Accessories = () => {
  const [openSections, setOpenSections] = useState({}); // ✅ Added state for filters

  const products = [
    { id: 1, name: "Women White Brass Dial & Brown Leather Straps Watch", price: "RS.2275", img: "/img/Accessories1.png" },
    { id: 2, name: "Set of 2 Rose Gold-Plated Studded Pendants with Chains", price: "RS.385", img: "/img/Accessories2.png" },
    { id: 3, name: "Men Textured PU Two Fold Wallet", price: "RS.349", img: "/img/Accessories3.png" },
    { id: 4, name: "Women Victorian Clover Adjustable Bracelet for Everyday Wear", price: "RS.296", img: "/img/Accessories4.png" },
    { id: 5, name: "Women Silver-Toned Dial & Multicoloured Bracelet Style Watch", price: "RS.1322", img: "/img/Accessories5.png" },
    { id: 6, name: "Set Of 2 Silver Plated Crystals Adjustable Couple Finger Rings", price: "RS.199", img: "/img/Accessories6.png" },
    { id: 7, name: "Women Gold-Plated Star Shaped Studs Earrings", price: "RS.521", img: "/img/Accessories7.png" },
    { id: 8, name: "Set Of 4 Silver Plated Finger Rings", price: "RS.345", img: "/img/Accessories8.png" },
    { id: 9, name: "Women Rose Gold & White Brass Rose Gold-Plated Charm Bracelet Tote Bag", price: "RS.209", img: "/img/Accessories9.png" },
  ];

  const filterData = {
    "According to Gender": ["Men", "Women", "Boys", "Girls"],
    "According to Price": [
      "Rs.500 - Rs.1500",
      "Rs.1500 - Rs.2500",
      "Rs.2500 - Rs.3500",
      "Rs.3500 - Rs.4500",
      "Rs.4500 - & above",
    ],
    "According to Brand": ["Titan", "Giva", "French Connection", "Fossil", "H&M"],
    "According to Categories": ["Watch", "Sunglasses", "Jewellery", "Belt", "Wallet"],
    "According to Color": ["Black", "White", "Red", "Pink", "Green", "Navy Blue"],
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <Navbar />

      <div className="container">
        {/* Sidebar Filters */}
        <aside className="filters">
          <h3 className="filter-title">
            <img
              src="/img/filter.png"
              alt="filter icon"
              className="filter-left-icon"
            />
            Filter
          </h3>

          {Object.keys(filterData).map((section) => (
            <div key={section} className="filter-section">
              <div
                className="filter-header"
                onClick={() => toggleSection(section)}
              >
                <span>{section}</span>
                <span className="filter-arrow">
                  {openSections[section] ? "▲" : "▼"}
                </span>
              </div>

              {openSections[section] && (
                <div className="filter-options">
                  {filterData[section].map((item) => (
                    <label key={item} className="filter-option">
                      <input type="checkbox" /> {item}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main Products */}
        <main className="main">
          <h2>Women’s Accessories</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-clothing">
                <img src={product.img} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Accessories;
