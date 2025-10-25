// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { API } from "../components/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./clothing.css";
import filterConfig from "../components/filterConfig";

const CategoryPage = () => {
  const { catName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  const filterData = filterConfig[catName?.toLowerCase()] || {};
  const [categories, setCategories] = useState([]);

  // Dynamic title based on category
  const getCategoryTitle = (categoryName) => {
    const titles = {
      'clothing': 'Clothing & Apparel - New Arrivals',
      'footwear': 'Footwear & Shoes - Latest Collection', 
      'bags': 'Bags & Handbags - Trending Styles',
      'cosmetic': 'Cosmetics & Beauty - New Arrivals',
      'accessories': 'Accessories & Jewelry - Fashion Essentials'
    };
    return titles[categoryName?.toLowerCase()] || `${categoryName} - New Arrivals`;
  };




  


  

  // Toggle filter sections
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle filter checkbox changes
  const handleFilterChange = (section, value) => {
    setSelectedFilters((prev) => {
      const prevSection = prev[section] || [];
      let updatedSection;
      if (prevSection.includes(value)) {
        updatedSection = prevSection.filter((v) => v !== value);
      } else {
        updatedSection = [...prevSection, value];
      }
      return { ...prev, [section]: updatedSection };
    });
  };

  // Fetch products from backend
  useEffect(() => {
  if (!catName) return;

  console.log("Fetching data for category:", catName); // Debug log
  setLoading(true);
  setError(null);

  // Try both with and without case sensitivity
  const categoryParam = catName.charAt(0).toUpperCase() + catName.slice(1).toLowerCase();
  
  Promise.all([
    api.get("/api/categories"), // ✅ fetch categories
    api.get(`/api/products/${categoryParam}`), // ✅ fetch products with proper case
  ])
    .then(([catRes, prodRes]) => {
      console.log("Categories:", catRes.data); // Debug log
      console.log("Products:", prodRes.data); // Debug log
      setCategories(catRes.data || []);  // ✅ set categories
      setProducts(prodRes.data || []);   // ✅ set products
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      // Try with exact catName if first attempt fails
      if (err.response?.status === 404) {
        api.get(`/api/products/${catName}`)
          .then((res) => {
            console.log("Products with exact name:", res.data);
            setProducts(res.data || []);
          })
          .catch((err2) => {
            console.error("Second attempt also failed:", err2);
            setError(`Unable to load products for ${catName}`);
          })
          .finally(() => setLoading(false));
      } else {
        setError("Unable to load products or categories");
        setLoading(false);
      }
    })
    .finally(() => {
      if (!error) setLoading(false);
    });
}, [catName]);

  // Apply filters
 // Apply filters
const filteredProducts = products.filter((product) => {
  return Object.entries(selectedFilters).every(([section, values]) => {
    if (values.length === 0) return true;

    switch (section) {
      case "According to Gender":
        return values.some(v => v.toLowerCase() === (product.gender || "").toLowerCase());
     case "According to Price":
  const price = Number(product.price);
  return values.some((range) => {
    // range example: "Rs.500 - Rs.1500"
    const cleaned = range.replace(/Rs\.|\s/g, ""); // "500-1500"
    const [minStr, maxStr] = cleaned.split("-");
    const min = Number(minStr) || 0;
    const max = Number(maxStr) || Infinity;
    return price >= min && price <= max;
  });
      case "According to Brand":
        return values.some(v => v.toLowerCase() === (product.brand || "").toLowerCase());
       
      case "According to Categories":   
        return values.some(v => v.toLowerCase() === (product.subcategory || "").toLowerCase());
      case "According to Size":
        return values.some(v => v.toLowerCase() === (product.size || "").toLowerCase());
      case "According to Color":
        return values.some(v => v.toLowerCase() === (product.color || "").toLowerCase());
      case "According to Material":
        return values.some(v => v.toLowerCase() === (product.material || "").toLowerCase());
      default:
        return true;
    }
  });
});


  return (
    <>
      <Navbar />

      <div className="container">
        {/* Sidebar Filters */}
        <aside className="filters">
          <h3 className="filter-title">
            <img src="/img/filter.png" alt="filter icon" className="filter-left-icon" />
            Filter
          </h3>
          {Object.keys(filterData).length > 0 ? (
            Object.keys(filterData).map((section) => (
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
                        <input
                          type="checkbox"
                          checked={selectedFilters[section]?.includes(item) || false}
                          onChange={() => handleFilterChange(section, item)}
                        />{" "}
                        {item}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No filters available</p>
          )}
        </aside>

        {/* Main Products */}
        <main className="main">
          <h2>{getCategoryTitle(catName)}</h2>

          {loading ? (
            <p>Loading products…</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredProducts.length === 0 ? (
            <div>
              <p>No products available with selected filters</p>
              <p>Debug: Total products loaded: {products.length}</p>
              <p>Debug: Category: {catName}</p>
              <p>Debug: Selected filters: {JSON.stringify(selectedFilters)}</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((p) => (
                <div key={p._id} className="product-clothing">
                  <img
                    src={p.images && p.images.length > 0 
                      ? `http://localhost:5001${p.images[0]}` 
                      : p.imageUrl 
                        ? `http://localhost:5001${p.imageUrl}` 
                        : "/img/default.png"
                    }
                    alt={p.name}
                    onError={(e) => {
                      e.target.src = "/img/default.png";
                    }}
                  />
                  <h3>{p.name}</h3>
                  <p className="price">₹{p.price || 0}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;
