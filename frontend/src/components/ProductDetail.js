import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import "./ProductDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "./cartContext";
import { useWishlist } from "./wishlistContext";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [userAddress, setUserAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [allCoupons, setAllCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  // Fetch all coupons for offers section
  useEffect(() => {
    fetch('http://localhost:5000/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllCoupons(data);
        else if (Array.isArray(data.coupons)) setAllCoupons(data.coupons);
        else setAllCoupons([]);
      })
      .catch(() => setAllCoupons([]));
  }, []);

  // Fetch all offers for this product page
  useEffect(() => {
    fetch('http://localhost:5000/api/offers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOffers(data);
        else if (Array.isArray(data.offers)) setOffers(data.offers);
        else setOffers([]);
      })
      .catch(() => setOffers([]))
      .finally(() => setOffersLoading(false));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        // Prefer images array if available, else fallback to imageUrl
        if (data.images && data.images.length > 0) {
          setMainImage(`http://localhost:5000${data.images[0]}`);
          setImages(data.images.map(img => `http://localhost:5000${img}`));
        } else {
          setMainImage(data.imageUrl ? `http://localhost:5000${data.imageUrl}` : "/img/default.png");
          setImages([data.imageUrl ? `http://localhost:5000${data.imageUrl}` : "/img/default.png"]);
        }
        // Set default selected size/color if available
        if (data.size) {
          let sizes = Array.isArray(data.size) ? data.size : data.size.split(',').map(s => s.trim()).filter(Boolean);
          if (sizes.length > 0) setSelectedSize(sizes[0]);
        }
        if (data.color) {
          let colors = Array.isArray(data.color) ? data.color : data.color.split(',').map(c => c.trim()).filter(Boolean);
          if (colors.length > 0) setSelectedColor(colors[0]);
        }
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  // Fetch user address if logged in
  useEffect(() => {
    if (!user) {
      setUserAddress(null);
      return;
    }
    setAddressLoading(true);
    fetch(`/api/addresses/user/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.addresses && data.addresses.length > 0) {
          // Use first address as default
          setUserAddress(data.addresses[0]);
        } else {
          setUserAddress(null);
        }
      })
      .catch(() => setUserAddress(null))
      .finally(() => setAddressLoading(false));
  }, [user]);

  const handleAddToCart = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      img: images[0],
      brand: product.brand,
      sku: product.sku,
      category: product.category,
      color: selectedColor,
      size: selectedSize,
      material: product.material,
      stock: product.stock
    });
    alert("Product added to cart!");
  };

  const handleWishlist = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    toggleWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      img: images[0],
      brand: product.brand
    });
    alert("Product added to wishlist!");
  };

  const [reviewInput, setReviewInput] = useState("");
  const [reviews, setReviews] = useState([]);

  // Add two static reviews at the top
  const staticReviews = [
    { title: "Great Product!", text: "Really loved the quality and fast delivery. Highly recommended!" },
    { title: "Value for Money", text: "Affordable price and good features. Will buy again." }
  ];

  useEffect(() => {
    if (product && Array.isArray(product.reviews)) {
      setReviews(product.reviews);
    } else {
      setReviews([]);
    }
  }, [product]);

  const handleAddReview = () => {
    if (!reviewInput.trim()) return;
    // You can add user info here if available
    const newReview = {
      title: "User Review",
      text: reviewInput.trim(),
    };
    setReviews(prev => [newReview, ...prev]);
    setReviewInput("");
    // Optionally, send to backend here
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      
      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
      
      <div className="pd-page">
        {/* Left Images */}
        <div className="pd-images">
          <div className="pd-thumbnails">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumbnail"
                className="pd-thumb"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="pd-main">
            <img src={mainImage} alt="main product" />
          </div>
        </div>

        {/* Right Info */}
        <div className="pd-info">
          <h2 className="pd-brand">{product.brand || "Brand"}</h2>
          <p className="pd-title">{product.name}</p>
          <p className="pd-price">
            ₹{product.price} {product.mrp && <span className="pd-mrp">MRP ₹{product.mrp}</span>}
          </p>
          {/* <span className="pd-tax">inclusive of all taxes</span> */}
          {((product.rating && product.ratingCount) || product.rating || product.ratingCount) && (
            <div className="pd-rating">
              {product.rating && <span>⭐ {product.rating}</span>}
              {product.rating && product.ratingCount && ' | '}
              {product.ratingCount && <span>{product.ratingCount} Ratings</span>}
            </div>
          )}
          {product.description && <div className="pd-desc"><b>Description:</b> {product.description}</div>}
          {product.sku && <div className="pd-sku"><b>SKU:</b> {product.sku}</div>}
          {product.category && <div className="pd-category"><b>Category:</b> {product.category}</div>}
          {product.color && <div className="pd-color"><b>Color:</b> {selectedColor || product.color}</div>}
          {product.size && <div className="pd-size"><b>Size:</b> {selectedSize || product.size}</div>}
          {product.material && <div className="pd-material"><b>Material:</b> {product.material}</div>}
          {product.stock !== undefined && <div className="pd-stock"><b>Stock:</b> {product.stock}</div>}

          {/* Sizes */}
          {product.size && (Array.isArray(product.size) ? product.size.length > 0 : product.size.length > 0) && (
            <div className="pd-sizes">
              <h4>Select Size</h4>
              <div className="pd-size-options">
                {(Array.isArray(product.size) ? product.size : (product.size ? product.size.split(',').map(s => s.trim()).filter(Boolean) : [])).map((s) => (
                  <button
                    key={s}
                    className={`pd-size-btn${selectedSize === s ? " selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.color && (Array.isArray(product.color) ? product.color.length > 0 : product.color.length > 0) && (
            <div className="pd-colors">
              <h4>Select Color</h4>
              <div className="pd-color-options">
                {(Array.isArray(product.color) ? product.color : (product.color ? product.color.split(',').map(c => c.trim()).filter(Boolean) : [])).map((c) => (
                  <span
                    key={c}
                    className={`pd-color-swatch${selectedColor === c ? " selected" : ""}`}
                    style={{ backgroundColor: c, border: selectedColor === c ? '2px solid #333' : '1px solid #ccc', display: 'inline-block', width: 24, height: 24, borderRadius: '50%', marginRight: 8, cursor: 'pointer' }}
                    title={c}
                    onClick={() => setSelectedColor(c)}
                  ></span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pd-buttons">
            <button className="pd-add-btn" onClick={handleAddToCart}>
              <img src="/img/add.png" alt="add" className="pd-icon" /> Add To Cart
            </button>
            <button className="pd-wish-btn" onClick={handleWishlist}>
              <img src="/img/like.png" alt="wishlist" className="pd-icon" /> Wishlist
            </button>
          </div>

          {/* Delivery */}
          <div className="pd-delivery">
            <div className="pd-delivery-header">
              <h4 style={{textTransform:'uppercase'}}>Delivery Options</h4>
              <img src="/img/truck.png" alt="truck" className="pd-delivery-icon" />
            </div>
            {addressLoading ? (
              <div style={{marginTop:12}}>Loading address...</div>
            ) : user && userAddress ? (
              <div style={{
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: '12px 18px',
                margin: '16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fafbfc',
                fontWeight: 600
              }}>
                <span style={{fontWeight:700, fontSize:18}}>{userAddress.pincode} ({userAddress.fullName})</span>
                <span style={{color:'#00bfa5', fontSize:22, marginLeft:8}}>&#10003;</span>
                <button
                  style={{marginLeft:16, color:'#ff3e6c', background:'none', border:'none', fontWeight:600, cursor:'pointer', fontSize:16}}
                  onClick={() => navigate('/saved-address')}
                >CHANGE</button>
              </div>
            ) : (
              <>
                <input type="text" placeholder="Enter pincode" className="pd-pincode" disabled />
                <button className="pd-check-btn" disabled>Check</button>
                <p>Please enter PIN code to check delivery time</p>
              </>
            )}
            <ul className="pd-delivery-info">
              <li>100% Original Products</li>
              <li>Pay on delivery might be available</li>
              <li>Easy 7 days returns and exchanges</li>
            </ul>
          </div>

          {/* Offers - Dynamic */}
          {(allCoupons.length > 0 || true) && (
            <div className="pd-offers">
              <h4>🔥 Best Offers for You</h4>
              {allCoupons.length > 0 && (
                <>
                  <h4>🎟️ Coupon Codes:</h4>
                  <ul>
                    {allCoupons.map((c, i) => (
                      <li key={i}><b>{c.code}</b>: {c.description}</li>
                    ))}
                  </ul>
                </>
              )}
              <h4>💳 Bank & Card Offers</h4>
              {product.bankOffers?.length > 0 || offers.length > 0 ? (
                <ul>
                  {product.bankOffers?.map((b, i) => (
                    <li key={"bank-"+i}><b>{b.title}</b><br />{b.details}</li>
                  ))}
                  {offers.map((offer, idx) => (
                    <li key={offer._id || "universal-"+idx} style={{marginBottom:12}}>
                      {offer.bank ? `🏦 ${offer.bank}: ` : ''}{offer.description} use code <b>{offer.code}</b>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{color:'#888', marginLeft:12}}>No bank or card offers available.</p>
              )}
            </div>
          )}

         

          {/* Product Details */}
          {product.details && Array.isArray(product.details) && product.details.length > 0 && (
            <div className="pd-details">
              <h4>Product Details</h4>
              <ul>
                {product.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Show Material & Care if available */}
          {product.materialCare && (
            <div className="pd-details">
              <h4>Material & Care</h4>
              <p>{product.materialCare}</p>
            </div>
          )}

          {/* Reviews - Dynamic */}
          <div className="pd-reviews">
            <h4>Reviews</h4>
            {staticReviews.concat(reviews).length > 0 ? (
              staticReviews.concat(reviews).map((r, i) => (
                <div className="pd-review-box" key={i}>
                  <p><b>{r.title || "Review"}</b><br/>{r.text}</p>
                </div>
              ))
            ) : (
              <div style={{color:'#888', marginBottom:12}}>No reviews yet.</div>
            )}
            <div className="pd-review-box-input" style={{marginTop:16, position:'relative'}}>
              <textarea
                placeholder="Write Review"
                className="pd-review-input"
                value={reviewInput}
                onChange={e => setReviewInput(e.target.value)}
                style={{paddingRight: '40px'}}
              ></textarea>
              <button
                type="button"
                onClick={handleAddReview}
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                  background: '#2196f3',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px #b3b3b3',
                  padding: 0
                }}
                title="Send Review"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products section removed: 'products' is not defined. */}

      <Footer />
    </>
  );
};

export default ProductDetail;
