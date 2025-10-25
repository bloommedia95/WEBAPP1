import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import First from "./components/First";
import About from "./components/about";
import Blog from "./components/blog";
import Clothing from "./components/clothing";
import Footwear from "./components/footwear";
import Bags from "./components/bags";
import Accessories from "./components/accessories";
import Skincare from "./components/skincare";
import ArticleDetail from "./components/ArticleDetail";
import SearchResults from "./components/SearchResults";
import OrderDetails from "./components/OrderDetails";
import SavedAddress from "./components/SavedAddress";
import SaveCard from "./components/SaveCard";
import Coupons from "./components/Coupons";
import HelpCenter from "./components/HelpCenter";
import EditProfile from "./components/EditProfile";
import Wishlist from "./components/Wishlist";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Address from "./components/address";
import Payment from "./components/Payment";
import OrderSuccess from "./components/OrderSuccess";
import Faq from "./components/faq";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsConditions from "./components/TermsConditions";
import NoRefundPolicy from "./components/NoRefundPolicy";
import { WishlistProvider } from "./components/wishlistContext"; 
import { CartProvider } from "./components/cartContext";
import { SelectedItemsProvider } from "./components/SelectedItemsContext";
import CategoryPage from "./components/CategoryPage";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Signup from "./pages/Signup";


function App() {
    const [msg, setMsg] = useState("");
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    axios.get("/api/coupons")
      .then(res => setCoupons(res.data))
      .catch(err => console.error("Error fetching coupons:", err));
  }, []);
 return (
  <>
    {/* <div>
      <h1>Available Coupons</h1>
      <ul>
        {coupons.map(c => (
         <li key={c._id}>
  <strong>{c.title}</strong> ({c.code}) - {c.discountType} [{c.status}]
</li>

        ))}
      </ul>
    </div> */}

    <Router>
         <ScrollToTop />
         <ThemeProvider>
             <AuthProvider>
              
      <WishlistProvider>
        <CartProvider>
          <SelectedItemsProvider>
            <Routes>
              <Route path="/" element={<First />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/no-refund-policy" element={<NoRefundPolicy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/search" element={<SearchResults />} />
              {/* <Route path="/clothing" element={<Clothing />} /> */}
              <Route path="/footwear" element={<Footwear />} />
              <Route path="/bags" element={<Bags />} />
              <Route path="/skincare" element={<Skincare />} />
                <Route path="/categories/:catName" element={<CategoryPage />} />

                 <Route path="/signup" element={<Signup />} />

              {/* Categories */}
              {/* <Route path="/categories/clothing" element={<Clothing />} />
              <Route path="/categories/footwear" element={<Footwear />} />
              <Route path="/categories/bags" element={<Bags />} />
              <Route path="/categories/accessories" element={<Accessories />} />
              <Route path="/categories/cosmetic" element={<Skincare />} /> */}

              {/* Profile Related */}
              <Route path="/order-details" element={<OrderDetails />} />
              <Route path="/saved-address" element={<SavedAddress />} />
              <Route path="/save-card" element={<SaveCard />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/helpcenter" element={<HelpCenter />} />
              <Route path="/editprofile" element={<EditProfile />} />

              {/* Wishlist & Cart */}
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/address" element={<Address />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Articles */}
              <Route path="/article/:id" element={<ArticleDetail />} />
            </Routes>
          </SelectedItemsProvider>
        </CartProvider>
      </WishlistProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  </>
);

}

export default App;
