# 🌸 Bloom E-Commerce - Complete Full Stack Application

A comprehensive e-commerce dashboard application built with Node.js, Express, MongoDB, and React featuring dynamic content management, user authentication, and modern UI components.

## ✨ Features

### Backend (Node.js/Express)
- **Dynamic Coupon Management System** with image upload
- **Product Catalog** with category-wise organization
- **User Authentication** and session management
- **File Upload** functionality with Multer
- **RESTful APIs** for all CRUD operations
- **MongoDB** database integration
- **Admin Dashboard** with analytics and KPIs

### Frontend (React)
- **Responsive Design** with modern UI/UX
- **React Router** for navigation
- **Context API** for state management
- **Dynamic Product Display** with category filtering
- **Shopping Cart** functionality
- **User Authentication** with modals
- **Coupon System** integration

### Dynamic Features
- ✅ **Create/Edit/Delete** coupons with image upload
- ✅ **Real-time Search** and filtering
- ✅ **Sortable Tables** with pagination
- ✅ **Status Management** (Active/Inactive toggles)
- ✅ **Form Validation** with error handling
- ✅ **Image Modal** viewing
- ✅ **AJAX Operations** without page reload

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer (File uploads)
- EJS (Template engine)
- bcrypt (Password hashing)
- Express Session

**Frontend:**
- React.js
- React Router DOM
- Axios (HTTP client)
- Context API
- Lucide React (Icons)

## 📦 Installation & Setup

### Prerequisites
- Node.js (18+ recommended)
- MongoDB
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd bloom-e-commerce

# Install dependencies
npm install

# Create .env file with your MongoDB connection
echo "MONGODB_URI=mongodb://localhost:27017/bloom" > .env
echo "PORT=5000" >> .env

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

## 🌐 API Endpoints

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons` - Create new coupon with image
- `PUT /api/coupons/:id` - Update coupon
- `DELETE /api/coupons/:id` - Delete coupon
- `PATCH /api/coupons/:id/status` - Toggle coupon status

### Products
- `GET /api/products/:category` - Get products by category
- `POST /products` - Add new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /category` - Add new category

## 📁 Project Structure

```
bloom-e-commerce/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── filterConfig.js       # Product filters
├── models/
│   ├── Coupon.js            # Coupon schema
│   ├── Product.js           # Product schema
│   ├── Category.js          # Category schema
│   └── ...
├── public/
│   ├── css/
│   ├── js/
│   └── uploads/
├── uploads/
│   └── coupons/             # Coupon images
├── views/
│   ├── coupon-create.ejs    # Dynamic coupon management
│   ├── products.ejs
│   └── partials/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Coupons.js   # Frontend coupon display
│       │   ├── LoginModal.jsx
│       │   └── ...
│       └── context/
└── server.js                # Main server file
```

## 🚀 Key Features Implemented

### 1. Dynamic Coupon System
- **Admin Panel**: Complete CRUD operations with image upload
- **Frontend Display**: Beautiful coupon cards with filtering
- **Validation**: Client & server-side validation
- **Image Handling**: Upload, display, and manage coupon images

### 2. Enhanced UI/UX
- **Search & Filter**: Real-time table filtering
- **Sortable Columns**: Click to sort any column
- **Modal Dialogs**: Image viewing and confirmations
- **Responsive Design**: Works on all devices

### 3. Advanced Functionality
- **Status Management**: Toggle active/inactive states
- **Form Validation**: Comprehensive error handling
- **File Upload**: Secure image upload with validation
- **Session Management**: User authentication and sessions

## 🔧 Configuration

### Environment Variables (.env)
```env
MONGODB_URI=mongodb://localhost:27017/bloom
PORT=5000
SESSION_SECRET=your-secret-key
```

### Default Login Credentials
- **Email**: `admin@example.com`
- **Password**: `1234`

## 📱 Access Points

- **Backend Dashboard**: http://localhost:5000
- **Frontend App**: http://localhost:3000
- **Coupon Management**: http://localhost:5000/coupon-create
- **Product Management**: http://localhost:5000/products

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Surabhi Kirar**
- GitHub: [@Surabhikirar](https://github.com/Surabhikirar)

## 🙏 Acknowledgments

- Built with modern web technologies
- Responsive design principles
- Best practices for security and performance

---

⭐ **If you find this project helpful, please give it a star!** ⭐
