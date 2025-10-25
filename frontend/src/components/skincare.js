// import React, { useState } from "react";
// import "./about.css";
// import "./clothing.css";
// import Navbar from "./navbar";
// import Footer from "./footer";

// const Skincare = () => {
//   const [openSections, setOpenSections] = useState({}); // ✅ added state for filter sections

//   const products = [
//     { id: 1, name: "Vitamin C + E Sunscreen SPF 50 PA+++", price: "RS.399", img: "/img/skincare1.png" },
//     { id: 2, name: "3% Niacinamide Alcohol-Free Toner", price: "RS.378", img: "/img/skincare2.png" },
//     { id: 3, name: "Sweet Escape Perfume Body Lotion", price: "RS.470", img: "/img/skincare3.png" },
//     { id: 4, name: "Set of 3 Matte Lipsticks Box - Browns 04", price: "RS.699", img: "/img/skincare4.png" },
//     { id: 5, name: "5% Vitamin C Brightening Ultra Light Gel Sunscreen", price: "RS.549", img: "/img/skincare5.png" },
//     { id: 6, name: "Multi Back to Basics Eyeshadow Palette", price: "RS.270", img: "/img/skincare6.png" },
//     { id: 7, name: "Loose Finishing & Long Lasting Compact Powder", price: "RS.497", img: "/img/skincare7.png" },
//     { id: 8, name: "Loose Finishing & Long Lasting Compact Powder", price: "RS.477", img: "/img/skincare8.png" },
//     { id: 9, name: "Matte Bullet Intense Colour Transferproof Lipstick", price: "RS.440", img: "/img/skincare9.png" },
//   ];

//   const filterData = {
//     "According to Gender": ["Men", "Women", "Boys", "Girls"],
//     "According to Price": [
//       "Rs.500 - Rs.1500",
//       "Rs.1500 - Rs.2500",
//       "Rs.2500 - Rs.3500",
//       "Rs.3500 - Rs.4500",
//       "Rs.4500 - & above",
//     ],
//     "According to Brand": ["Dot&Key", "Plum", "Guess", "Mars", "Lakme"],
//     "According to Categories": ["Lipstick", "Toner", "Foundation", "Serum", "Eyeshadow"],
//     "According to Color": ["Black", "White", "Red", "Pink", "Green", "Navy Blue"],
//   };

//   const toggleSection = (section) => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         {/* Sidebar Filters */}
//         <aside className="filters">
//           <h3 className="filter-title">
//             <img
//               src="/img/filter.png"
//               alt="filter icon"
//               className="filter-left-icon"
//             />
//             Filter
//           </h3>

//           {Object.keys(filterData).map((section) => (
//             <div key={section} className="filter-section">
//               <div className="filter-header" onClick={() => toggleSection(section)}>
//                 <span>{section}</span>
//                 <span className="filter-arrow">
//                   {openSections[section] ? "▲" : "▼"}
//                 </span>
//               </div>

//               {openSections[section] && (
//                 <div className="filter-options">
//                   {filterData[section].map((item) => (
//                     <label key={item} className="filter-option">
//                       <input type="checkbox" /> {item}
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </aside>

//         {/* Main Products */}
//         <main className="main">
//           <h2>Women’s Cosmetic / Skincare</h2>
//           <div className="products-grid">
//             {products.map((product) => (
//               <div key={product.id} className="product-clothing">
//                 <img src={product.img} alt={product.name} />
//                 <h3>{product.name}</h3>
//                 <p className="price">{product.price}</p>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Skincare;
