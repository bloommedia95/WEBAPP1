# 🗄️ Database Persistence Setup Guide

## 📋 Overview
This guide explains how to set up permanent data storage for the Bloom E-commerce project. Once configured, all products, categories, blogs, and user data will persist across system restarts and be available on any machine.

## 🛠️ Setup Instructions

### 1. Database Configuration
The project is now configured to use a persistent MongoDB database:

```bash
Database Name: bloom-ecommerce-persistent
Connection: mongodb://localhost:27017/bloom-ecommerce-persistent
```

### 2. Environment Setup
The `.env` file has been updated with proper database configuration:

```bash
MONGO_URI=mongodb://localhost:27017/bloom-ecommerce-persistent
MONGODB_URI=mongodb://localhost:27017/bloom-ecommerce-persistent
```

### 3. Initial Data Seeding

To populate the database with sample data, run:

```bash
# Navigate to backend directory
cd dashtar-dashboard-node

# Install dependencies (if not done already)
npm install

# Seed the database with sample data
npm run seed-data
```

This will create:
- ✅ 3 Sample Categories (Electronics, Clothing, Home & Garden)
- ✅ 3 Sample Products (Headphones, T-Shirt, Smart Bulb)
- ✅ 2 Sample Coupons (Welcome Discount, Free Shipping)
- ✅ 1 Admin User (admin@bloom.com / password)

### 4. Verify Data Persistence

Check if your data is properly saved:

```bash
# Check database status and content
npm run check-db
```

This will show:
- 📊 Count of all documents
- 🔗 Database connection details
- 📄 Sample data preview
- ✅ Persistence status

## 🚀 Usage Commands

### Available Scripts:

```bash
# Start the server
npm start

# Start in development mode
npm run dev

# Seed database with fresh data
npm run seed-data

# Check database status
npm run check-db

# Reset database (clear + reseed)
npm run reset-db
```

## 🔄 Data Persistence Features

### ✅ What's Persistent:
- **Products**: All product data including images, prices, categories
- **Categories**: Product categories with descriptions and images
- **Users**: Customer accounts and authentication data
- **Admin Data**: Dashboard users and roles
- **Coupons**: Discount codes and promotional offers
- **Orders**: Purchase history and transaction data
- **Blogs**: CMS content and articles

### 🔧 Database Features:
- **Automatic Reconnection**: Handles network interruptions
- **Connection Pooling**: Optimized for multiple users
- **Error Recovery**: Graceful handling of database errors
- **Session Management**: Proper cleanup on app termination

## 🖥️ Cross-System Usage

### To use on different machines:

1. **Ensure MongoDB is installed** on the target system
2. **Copy the project folder** to the new machine
3. **Install dependencies**: `npm install`
4. **Start the server**: `npm start`

The database will automatically connect and your data will be available!

### For team collaboration:

1. **Export data**: Use MongoDB tools to export/import data
2. **Shared database**: Use MongoDB Atlas for cloud storage
3. **Version control**: Keep `.env.example` updated for team setup

## 🛡️ Data Safety

### Backup Recommendations:
```bash
# Create database backup
mongodump --db bloom-ecommerce-persistent --out ./backup/

# Restore from backup
mongorestore --db bloom-ecommerce-persistent ./backup/bloom-ecommerce-persistent/
```

### Environment Security:
- ✅ `.env` file is git-ignored for security
- ✅ Use strong passwords in production
- ✅ Consider MongoDB Atlas for cloud deployment

## 📞 Troubleshooting

### Common Issues:

**Database not connecting:**
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
net start MongoDB  # Windows
```

**Data not persisting:**
```bash
# Verify database name
npm run check-db

# Check .env file
cat .env | grep MONGO_URI
```

**Empty database:**
```bash
# Reseed the database
npm run seed-data
```

## 🎯 Next Steps

After setup, you can:
1. **Add products** through the admin dashboard
2. **Create categories** via the CMS
3. **Manage coupons** in the promotions section
4. **Write blogs** using the blog management system

All data will be automatically saved and persist across sessions!

---

### 📝 Admin Dashboard Access:
- **URL**: http://localhost:5000/admin
- **Email**: admin@bloom.com
- **Password**: password

### 🌐 Frontend Access:
- **URL**: http://localhost:3000
- **Features**: Product catalog, user authentication, shopping cart

---

💡 **Pro Tip**: Always run `npm run check-db` before starting development to ensure your data is properly loaded!