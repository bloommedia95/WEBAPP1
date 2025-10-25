// const mongoose = require("mongoose");
// const Order = require("./models/Order");

// mongoose.connect("mongodb://127.0.0.1:27017/admin_dashboard", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function createOrder() {
//   const newOrder = new Order({
//     customerName: "Rahul Sharma",
//     status: "pending",
//     total: 1500,
//     items: [
//       { productName: "Face Cream", quantity: 2, price: 500 },
//       { productName: "Face Wash", quantity: 1, price: 500 },
//     ]
//   });

//   await newOrder.save();
//   console.log("Order saved:", newOrder);
//   mongoose.connection.close();
// }

// createOrder();
