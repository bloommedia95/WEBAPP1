import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ORDER CONFIRMATION EMAIL SERVICE
 * Sends order confirmation emails with invoice details after successful payment
 */

class OrderConfirmationService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  // Create email transporter using existing Gmail configuration
  createTransporter() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        secure: true,
        tls: {
          rejectUnauthorized: false
        }
      });
    }
    return null;
  }

  // Create order confirmation email template
  createOrderEmailTemplate(orderData) {
    const {
      orderNumber,
      customerName,
      customerEmail,
      orderDate,
      deliveryAddress,
      products,
      subtotal,
      tax,
      discount,
      deliveryCharges,
      totalAmount,
      paymentMethod,
      estimatedDelivery
    } = orderData;

    const productRows = products.map(product => 
      `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
        <tr>
          <td style="width: 60px; padding-right: 15px; vertical-align: top;">
            <div style="width: 50px; height: 50px; background: #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">👕</div>
          </td>
          <td style="vertical-align: top;">
            <p style="font-weight: 600; color: #333; margin: 0 0 5px 0;">${product.name}</p>
            <p style="font-size: 14px; color: #636e72; margin: 0;">Size: ${product.size} | Color: ${product.color || 'Blue'} | Qty: ${product.quantity}</p>
          </td>
          <td style="text-align: right; vertical-align: top;">
            <p style="font-weight: 600; color: #28a745; font-size: 16px; margin: 0;">₹${product.price}</p>
          </td>
        </tr>
      </table>`
    ).join('');

    return {
      subject: `🎉 Order Confirmed #${orderNumber} - Thank You for Shopping with Bloom!`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation - Bloom E-Commerce</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px; color: #333; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">🌸 Bloom E-Commerce</h1>
        <p style="margin: 0; opacity: 0.9; font-size: 16px;">Your Premium Fashion Destination</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="font-size: 28px; color: #333; margin: 0 0 10px 0; font-weight: 700; text-align: center;">Order Confirmed! 🎉</h2>
        <p style="font-size: 18px; color: #17a2b8; text-align: center; font-weight: 600; margin: 0 0 25px 0;">Order #${orderNumber}</p>
        
        <!-- Thank You Message -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #17a2b8, #00d4aa); border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px; text-align: center;">
              <p style="color: white; font-size: 16px; line-height: 1.6; margin: 0;">
                Hi ${customerName}! 👋<br>
                Thank you for your order! We're excited to get your items ready for delivery.<br>
                You'll receive updates about your order status via email and SMS.
              </p>
            </td>
          </tr>
        </table>

        <!-- Order Summary -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0; border-bottom: 2px solid #ddd; padding-bottom: 8px;">📋 Order Summary</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #636e72;">Order Date:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333; text-align: right;">${orderDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #636e72;">Payment Method:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333; text-align: right;">${paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #636e72;">Customer Email:</td>
                  <td style="padding: 8px 0; color: #17a2b8; text-align: right;">${customerEmail}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Items Ordered -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0; border-bottom: 2px solid #ddd; padding-bottom: 8px;">🛍️ Items Ordered</h3>
              ${productRows}
            </td>
          </tr>
        </table>

        <!-- Billing Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff3cd; border-radius: 15px; margin: 25px 0; border-left: 5px solid #ffc107;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0;">💰 Billing Details</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Subtotal (${products.length} items):</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px;">₹${subtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Discount Applied:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px; color: #28a745;">-₹${discount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Tax (GST 18%):</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px;">₹${tax}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Delivery Charges:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px; color: #28a745;">FREE</td>
                </tr>
                <tr style="border-top: 2px solid #ffc107;">
                  <td style="padding: 15px 0 8px 0; font-size: 18px; font-weight: bold;">Total Amount Paid:</td>
                  <td style="padding: 15px 0 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #28a745;">₹${totalAmount}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Delivery Address -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #e3f2fd; border-radius: 15px; margin: 25px 0; border-left: 5px solid #2196f3;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0;">🏠 Delivery Address</h3>
              <p style="color: #333; line-height: 1.6; margin: 0;">${deliveryAddress}</p>
            </td>
          </tr>
        </table>

        <!-- Estimated Delivery -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #ff6b9d, #ffa726); border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px; text-align: center;">
              <h3 style="color: white; font-size: 16px; margin: 0 0 10px 0;">🚚 Estimated Delivery</h3>
              <p style="color: white; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">${estimatedDelivery}</p>
              <p style="color: white; font-size: 14px; margin: 0; opacity: 0.9;">We'll send you tracking details once your order is shipped</p>
            </td>
          </tr>
        </table>

        <!-- Action Buttons -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td style="text-align: center;">
              <a href="#" style="display: inline-block; background: #28a745; color: white; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 25px; border-radius: 25px; margin: 0 10px;">Track Your Order 📦</a>
              <a href="#" style="display: inline-block; background: #17a2b8; color: white; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 25px; border-radius: 25px; margin: 0 10px;">Download Invoice 📄</a>
            </td>
          </tr>
        </table>

        <!-- Support Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #e3f2fd; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <h3 style="font-size: 16px; color: #333; margin: 0 0 10px 0;">💬 Need Help?</h3>
              <p style="color: #333; margin: 0 0 15px 0;">Our customer support team is here to help you 24/7</p>
              <p style="margin: 0;">
                📧 <a href="mailto:support@bloom.com" style="color: #17a2b8; text-decoration: none;">support@bloom.com</a> | 
                📞 <span style="color: #333;">1800-BLOOM-24</span> | 
                💬 <a href="#" style="color: #17a2b8; text-decoration: none;">Live Chat</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background: #f8f9fa; border-top: 1px solid #e9ecef;">
        <!-- Footer Links -->
        <p style="margin: 0 0 20px 0;">
          <a href="http://localhost:3000/help" style="color:black ; text-decoration: none; margin: 0 15px; font-size: 14px;">Help Center</a>
          <a href="http://localhost:3000/privacy" style="color: black; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy Policy</a>
          <a href="http://localhost:3000/terms" style="color: black; text-decoration: none; margin: 0 15px; font-size: 14px;">Terms & Conditions</a>
          <a href="http://localhost:3000/no-refund" style="color: black; text-decoration: none; margin: 0 15px; font-size: 14px;">No Refund Policy</a>
        </p>
        
        <!-- Social Media Icons -->
        <p style="margin: 20px 0; font-size: 13px; color: #777;">Follow us on</p>
        <a href="https://instagram.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/64px-Instagram_icon.png" alt="Instagram" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        <a href="https://facebook.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/64px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        <a href="https://youtube.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/64px-YouTube_full-color_icon_%282017%29.svg.png" alt="YouTube" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        <a href="https://x.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/64px-X_logo_2023.svg.png" alt="X (Twitter)" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        
        <p style="font-size: 12px; margin: 20px 0 0 0; color: #6c757d;">
          © 2025 Bloom E-Commerce. All rights reserved.<br>
          Made with 💝 for fashion lovers in India
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
    };
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderData) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not configured. Please check EMAIL_USER and EMAIL_PASS environment variables.');
      }

      console.log(`📧 Sending order confirmation email to ${orderData.customerEmail}`);
      
      const emailContent = this.createOrderEmailTemplate(orderData);
      
      const result = await this.transporter.sendMail({
        from: {
          name: 'Bloom E-Commerce',
          address: process.env.EMAIL_USER
        },
        to: orderData.customerEmail,
        subject: emailContent.subject,
        html: emailContent.html
      });

      console.log(`✅ Order confirmation email sent successfully to ${orderData.customerEmail}: ${result.messageId}`);
      
      return {
        success: true,
        messageId: result.messageId,
        service: 'Email'
      };

    } catch (error) {
      console.error('❌ Order confirmation email error:', error.message);
      
      return {
        success: false,
        error: error.message,
        service: 'Email'
      };
    }
  }
}

// Create singleton instance
const orderConfirmationService = new OrderConfirmationService();

// Export functions
export const sendOrderConfirmationEmail = (orderData) => 
  orderConfirmationService.sendOrderConfirmation(orderData);

export default orderConfirmationService;