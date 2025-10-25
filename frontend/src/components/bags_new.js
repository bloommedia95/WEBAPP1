import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./about.css";
import "./clothing.css";
import Navbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import filterConfig from "./filterConfig";

const Bags = () => {
	const [products, setProducts] = useState([]); // Backend se fetched products
	const [openSections, setOpenSections] = useState({});
	const [selectedCategory, setSelectedCategory] = useState("Bags");
	const { catName } = useParams(); // URL se category name aayega

	// Get filter config based on category (default to bags)
	const getCategoryKey = (categoryName) => {
		if (!categoryName) return 'bags';
		const key = categoryName.toLowerCase();
		return filterConfig[key] ? key : 'bags';
	};

	const categoryKey = getCategoryKey(catName);
	const filterData = filterConfig[categoryKey] || filterConfig.bags;

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

	const toggleSection = (section) => {
		setOpenSections(prev => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/products/${catName}`)
			.then((res) => setProducts(res.data))
			.catch((err) => console.error("Error fetching products:", err));
	}, [catName]);

	return (
		<>
			<Navbar/>
			<div className="container">
				{/* Sidebar Filters */}
				<aside className="filters">
					<h3 className="filter-title">
						<img src="/img/filter.png" alt="filter icon" className="filter-left-icon" />
						Filter
					</h3>

					{Object.keys(filterData).map((section) => (
						<div key={section} className="filter-section">
							<div className="filter-header" onClick={() => toggleSection(section)}>
								<span>{section}</span>
								<span className="filter-arrow">{openSections[section] ? "▲" : "▼"}</span>
							</div>

							{openSections[section] && (
								<div className="filter-options">
									{filterData[section].map(item => (
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
					<h2>{getCategoryTitle(catName)}</h2>
					<div className="products-grid">
						{products.length > 0 ? (
							products.map(product => (
								<Link
									to={`/product/${product._id}`}
									key={product._id}
									className="product-clothing"
								>
									<img
										src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : "/img/default.png"}
										alt={product.name}
									/>
									<h3>{product.name}</h3>
									<p className="price">RS.{product.price}</p>
								</Link>
							))
						) : (
							<p>No products available</p>
						)}
					</div>
				</main>
			</div>
			<Footer />
		</>
	);
};

export default Bags;