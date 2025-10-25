// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom"; 
// import "./about.css";
// import "./clothing.css";
// import Navbar from "./navbar";
// import Footer from "./footer";

// const Footwear= () => {
//    const [openSections, setOpenSections] = useState({});
  
//   const products = [
//     { id: 1, name: " Women Open Toe Flats", price: "RS.479", img: "/img/footwear1.png" },



//     { id: 2, name: "Textured PU Wedge Mules", price: "RS.1200", img: "/img/footwear2.png" },
//     { id: 3, name: "Running Non-Marking Shoes", price: "RS.999", img: "/img/footwear3.png" },
//     { id: 4, name: "Women Double Buckles Open Toe Flats", price: "RS.1352", img: "/img/footwear4.png" },
//     { id: 5, name: "Women Striped Open Toe Flats", price: "RS.899", img: "/img/footwear5.png" },
//     { id: 6, name: "Women Square Toe Mary Jane Flats", price: "RS.799", img: "/img/footwear6.png" },
//     { id: 7, name: "Block Heel Mules", price: "RS.699", img: "/img/footwear7.png" },
//     { id: 8, name: "Women Wedge Sandals", price: "RS.549", img: "/img/footwear8.png" },
//     { id: 9, name: "CIARA Women Lace-Up Running Shoe", price: "RS.1099", img: "/img/footwear9.png" },
//   ];

//   const filterData = {
//     "According to Gender": ["Men", "Women", "Boys", "Girls" ],
//     "According to Price": ["Rs.500 - Rs.1500", "Rs.1500 - Rs.2500", "Rs.2500 - Rs.3500", "Rs.3500 - Rs.4500", "Rs.4500 - & above"],
//     "According to Brand": ["H&M", "Calvin Kellin", "Max", "Bata", "Sketchers"],
//     "According to Categories": ["Heels", "Flip Flop", "Bellies", "Sandales", "Shoes"],
//     "According to Size": ["36", "37", "38", "39", "40"],
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
//        <div className="container">
//   {/* Sidebar Filters */}
//   <aside className="filters">
//   <h3 className="filter-title">
//     <img
//       src="/img/filter.png"   // 👈 आपकी filter icon image
//       alt="filter icon"
//       className="filter-left-icon"
//     />
//     Filter
//   </h3>

//   {Object.keys(filterData).map((section) => (
//     <div key={section} className="filter-section">
//       <div
//         className="filter-header"
//         onClick={() => toggleSection(section)}
//       >
//         <span>{section}</span>
//         <span className="filter-arrow">
//           {openSections[section] ? "▲" : "▼"}
//         </span>
//       </div>

//       {openSections[section] && (
//         <div className="filter-options">
//           {filterData[section].map((item) => (
//             <label key={item} className="filter-option">
//               <input type="checkbox" /> {item}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   ))}
// </aside>


//           {/* Main Products */}
//           <main className="main">
//             <h2>Women’s Footwear</h2>
//             <div className="products-grid">
//               {products.map((product) => (
//                 <div key={product.id} className="product-clothing">
//                   <img src={product.img} alt={product.name} />
//                   <h3>{product.name}</h3>
//                   <p className="price">{product.price}</p>
//                 </div>
//               ))}
//             </div>
//           </main>
//         </div>

//         <Footer />
      
//     </>
//   );
// };

// export default Footwear;
