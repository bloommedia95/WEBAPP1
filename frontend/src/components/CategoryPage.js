import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./about.css";
import "./clothing.css";
import Navbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import filterConfig from "./filterConfig";

const CategoryPage = () => {
	const [products, setProducts] = useState([]); // Backend se fetched products
	const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for display
	const [selectedFilters, setSelectedFilters] = useState({}); // Selected filter values
	const [openSections, setOpenSections] = useState({});
	const { catName } = useParams(); // URL se category name aayega

	// Get filter config based on category
	const getCategoryKey = (categoryName) => {
		if (!categoryName) return 'clothing';
		const key = categoryName.toLowerCase();
		
		// Handle spelling variations
		const keyMappings = {
			'accessories': 'acessiories', // Handle typo in filterConfig
			'cosmetics': 'cosmetic'
		};
		
		const mappedKey = keyMappings[key] || key;
		return filterConfig[mappedKey] ? mappedKey : 'clothing';
	};

	const categoryKey = getCategoryKey(catName);
	const filterData = filterConfig[categoryKey] || filterConfig.clothing;

	// Dynamic title based on category
	const getCategoryTitle = (categoryName) => {
		const titles = {
			'clothing': 'Clothing & Apparel - New Arrivals',
			'footwear': 'Footwear & Shoes - Latest Collection',
			'bags': 'Bags & Handbags - Trending Styles',
			'cosmetic': 'Cosmetics & Beauty - New Arrivals',
			'cosmetics': 'Cosmetics & Beauty - New Arrivals',
			'accessories': 'Accessories & Jewelry - Fashion Essentials',
			'acessiories': 'Accessories & Jewelry - Fashion Essentials'
		};
		
		// Fallback to formatted category name
		const formattedName = categoryName ? 
			categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 
			'Products';
		
		return titles[categoryName?.toLowerCase()] || `${formattedName} - New Arrivals`;
	};

	const toggleSection = (section) => {
		setOpenSections(prev => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Handle filter changes
	const handleFilterChange = (section, value, isChecked) => {
		setSelectedFilters(prev => {
			const newFilters = { ...prev };
			
			if (!newFilters[section]) {
				newFilters[section] = [];
			}
			
			if (isChecked) {
				// Add filter value if checked
				if (!newFilters[section].includes(value)) {
					newFilters[section] = [...newFilters[section], value];
				}
			} else {
				// Remove filter value if unchecked
				newFilters[section] = newFilters[section].filter(item => item !== value);
			}
			
			// Remove empty arrays
			if (newFilters[section].length === 0) {
				delete newFilters[section];
			}
			
			return newFilters;
		});
	};

	// Apply filters to products
	const applyFilters = (productsToFilter) => {
		if (Object.keys(selectedFilters).length === 0) {
			return productsToFilter; // No filters selected, return all products
		}

		return productsToFilter.filter(product => {
			// Check if product matches all selected filters
			return Object.entries(selectedFilters).every(([section, values]) => {
				if (values.length === 0) return true;
				
				// Map section names to product properties
				const propertyMap = {
					'According to Gender': 'gender',
					'According to Price': 'priceRange',
					'According to Brand': 'brand',
					'According to Categories': 'category',
					'According to Size': 'size',
					'According to Color': 'color'
				};
				
				const productProperty = propertyMap[section];
				if (!productProperty) return true;
				
				const productValue = product[productProperty];
				if (!productValue) return false;
				
				// Special handling for price range
				if (section === 'According to Price') {
					const price = parseFloat(product.price);
					return values.some(range => {
						switch(range) {
							case 'Rs.500 - Rs.1500':
								return price >= 500 && price <= 1500;
							case 'Rs.1500 - Rs.2500':
								return price >= 1500 && price <= 2500;
							case 'Rs.2500 - Rs.3500':
								return price >= 2500 && price <= 3500;
							case 'Rs.3500 - Rs.4500':
								return price >= 3500 && price <= 4500;
							case 'Rs.4500 - & above':
								return price >= 4500;
							default:
								return false;
						}
					});
				}
				
				// For other filters, check if product value matches any selected filter
				return values.some(value => 
					productValue.toLowerCase().includes(value.toLowerCase())
				);
			});
		});
	};

	// Update filtered products when products or filters change
	useEffect(() => {
		const filtered = applyFilters(products);
		setFilteredProducts(filtered);
	}, [products, selectedFilters]);

	useEffect(() => {
		if (catName) {
			console.log("🔍 Fetching products for category:", catName);
			console.log("🌐 API URL:", `http://localhost:5000/api/products/${catName}`);
			
			axios
				.get(`http://localhost:5000/api/products/${catName}`)
				.then((res) => {
					console.log("✅ API Response received:", res.data);
					console.log("📊 Number of products:", res.data.length);
					
					if (res.data.length > 0) {
						res.data.forEach((product, index) => {
							console.log(`📦 Product ${index + 1}:`);
							console.log(`   Name: ${product.name}`);
							console.log(`   ImageUrl: ${product.imageUrl}`);
							console.log(`   Full Image URL: http://localhost:5000${product.imageUrl}`);
						});
					}
					setProducts(res.data);
					setFilteredProducts(res.data); // Initialize filtered products
				})
				.catch((err) => {
					console.error("❌ Error fetching products:", err);
					console.error("🔍 Error details:", err.response?.data);
				});
		}
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
											<input 
												type="checkbox" 
												checked={selectedFilters[section]?.includes(item) || false}
												onChange={(e) => handleFilterChange(section, item, e.target.checked)}
											/> 
											{item}
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
					
					{/* Filter Summary */}
					{Object.keys(selectedFilters).length > 0 && (
						<div className="filter-summary">
							<p>Active Filters: </p>
							{Object.entries(selectedFilters).map(([section, values]) => (
								<div key={section} className="active-filter">
									<strong>{section}:</strong> {values.join(', ')}
								</div>
							))}
							<button 
								className="clear-filters-btn" 
								onClick={() => setSelectedFilters({})}
							>
								Clear All Filters
							</button>
						</div>
					)}

					<div className="products-grid">
						{filteredProducts.length > 0 ? (
							filteredProducts.map(product => (
								<Link
									to={`/product/${product._id}`}
									key={product._id}
									className="product-clothing"
								>
									<img
										src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : "/img/default.png"}
										alt={product.name}
										onError={(e) => {
											console.error("❌ Image loading failed for:", product.name);
											console.log("   Failed URL:", e.target.src);
											console.log("   Trying backup image...");
											
											// First fallback: try changing extension
											if (e.target.src.includes('.jpg')) {
												e.target.src = e.target.src.replace('.jpg', '.png');
											} else if (e.target.src.includes('.png')) {
												e.target.src = "/img/default.png";
											} else {
												e.target.src = "/img/default.png";
											}
										}}
										onLoad={(e) => {
											console.log("✅ Image loaded:", product.name, "->", e.target.src);
										}}
									/>
									<h3>{product.name}</h3>
									<p className="price">RS.{product.price}</p>
								</Link>
							))
						) : (
							<div className="no-products-message">
								{Object.keys(selectedFilters).length > 0 ? (
									<>
										<p>No products match your current filters.</p>
										<button 
											className="clear-filters-btn" 
											onClick={() => setSelectedFilters({})}
										>
											Clear Filters to See All Products
										</button>
									</>
								) : (
									<p>No products available in this category</p>
								)}
							</div>
						)}
					</div>
				</main>
			</div>
			<Footer />
		</>
	);
};

export default CategoryPage;