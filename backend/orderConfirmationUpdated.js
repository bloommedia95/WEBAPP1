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
      return nodemailer.createTransporter({
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
        <h2 style="font-size: 28px; color: #333; margin: 0 0 10px 0; font-weight: 700; text-align: center;">🎉 Order Confirmed!</h2>
        <p style="font-size: 18px; color: #00b894; text-align: center; font-weight: 600; margin: 0 0 25px 0;">Order #${orderNumber}</p>
        
        <!-- Thank You Message -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px; text-align: center;">
              <p style="color: white; font-size: 16px; line-height: 1.6; margin: 0;">
                Thank you ${customerName}! 🛍️<br>
                Your order has been confirmed and will be processed soon.<br>
                We'll send you shipping updates via email.
              </p>
            </td>
          </tr>
        </table>

        <!-- Order Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0; border-bottom: 2px solid #ddd; padding-bottom: 8px;">📋 Order Information</h3>
              
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
                  <td style="padding: 8px 0; font-weight: 600; color: #636e72;">Estimated Delivery:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${estimatedDelivery}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Delivery Address -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0; border-bottom: 2px solid #ddd; padding-bottom: 8px;">🚚 Delivery Address</h3>
              <p style="color: #333; line-height: 1.6; margin: 0;">${deliveryAddress}</p>
            </td>
          </tr>
        </table>

        <!-- Products -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0; border-bottom: 2px solid #ddd; padding-bottom: 8px;">🛍️ Your Items</h3>
              ${products.map(product => `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                  <tr>
                    <td style="width: 60px; padding-right: 15px;">
                      <div style="width: 60px; height: 60px; background: #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">👕</div>
                    </td>
                    <td style="vertical-align: top;">
                      <p style="font-weight: 600; color: #333; margin: 0 0 5px 0;">${product.name}</p>
                      <p style="font-size: 14px; color: #636e72; margin: 0;">Size: ${product.size} | Qty: ${product.quantity}</p>
                    </td>
                    <td style="text-align: right; vertical-align: top;">
                      <p style="font-weight: 600; color: #00b894; font-size: 16px; margin: 0;">₹${product.price}</p>
                    </td>
                  </tr>
                </table>
              `).join('')}
            </td>
          </tr>
        </table>

        <!-- Billing Summary -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff3cd; border-radius: 15px; margin: 25px 0; border-left: 5px solid #ffc107;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0;">💰 Order Summary</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Subtotal:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px;">₹${subtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Tax:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px;">₹${tax}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Discount:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px; color: #00b894;">-₹${discount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px;">Delivery:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px;">₹${deliveryCharges}</td>
                </tr>
                <tr style="border-top: 2px solid #ffc107;">
                  <td style="padding: 15px 0 8px 0; font-size: 18px; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 15px 0 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #00b894;">₹${totalAmount}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          Need help? Contact our support team at support@bloom.com
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background: #f8f9fa; border-top: 1px solid #e9ecef;">
        <!-- Footer Links -->
        <p style="margin: 0 0 20px 0;">
          <a href="http://localhost:3000/help" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">Help Center</a>
          <a href="http://localhost:3000/privacy" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy Policy</a>
          <a href="http://localhost:3000/terms" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">Terms & Conditions</a>
          <a href="http://localhost:3000/no-refund" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">No Refund Policy</a>
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
        <a href="https://twitter.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/64px-Logo_of_Twitter.svg.png" alt="Twitter" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
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