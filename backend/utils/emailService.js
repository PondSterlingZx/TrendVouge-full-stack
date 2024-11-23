import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Create transporter using Gmail service
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "trendvouge6@gmail.com",
        pass: "mzhmpecjpyaxiufz",
      }
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  // Connection verification method
  async verifyConnection() {
    try {
      const verification = await this.transporter.verify();
      console.log('Email service is ready:', verification);
    } catch (error) {
      console.error('Email service error:', error);
    }
  }

  // Email template for wishlist notification
  getWishlistTemplate(userName, productName, productImage, productPrice) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              background-color: #000000;
              color: #ffffff;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 30px 20px;
              text-align: center;
            }
            .product-image {
              max-width: 300px;
              margin: 20px auto;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .product-name {
              color: #333;
              font-size: 20px;
              font-weight: bold;
              margin: 15px 0;
            }
            .price {
              color: #e44d26;
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #000000;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
              font-weight: bold;
              transition: background-color 0.3s;
            }
            .button:hover {
              background-color: #333333;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666666;
              font-size: 12px;
              border-top: 1px solid #eeeeee;
              margin-top: 20px;
            }
            .highlights {
              background-color: #f8f8f8;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
              text-align: left;
            }
            .highlight-item {
              margin: 8px 0;
              color: #555;
            }
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 10px;
              }
              .product-image {
                width: 100%;
                max-width: 250px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Added to Your Wishlist!</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName || 'Valued Customer'}!</h2>
              <img src="${productImage}" alt="${productName}" class="product-image"/>
              <div class="product-name">${productName}</div>
              <div class="price">$${productPrice}</div>
              
              <div class="highlights">
                <div class="highlight-item">✓ Item saved to your wishlist</div>
                <div class="highlight-item">✓ We'll notify you about special offers</div>
                <div class="highlight-item">✓ Quick access to your favorite items</div>
              </div>

              <a href="http://localhost:5173/product/${encodeURIComponent(productName)}" 
                 class="button">
                View Product
              </a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TrendVouge. All rights reserved.</p>
              <p>This email was sent because you added an item to your wishlist.</p>
              <p>Questions? Contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Send wishlist notification email
  async sendWishlistNotification(userEmail, userName, product) {
    try {
      if (!userEmail || !product) {
        throw new Error('Missing required fields for email notification');
      }

      const mailOptions = {
        from: {
          name: 'TrendVouge',
          address: 'trendvouge6@gmail.com'
        },
        to: userEmail,
        subject: '✨ New Item Added to Your TrendVouge Wishlist!',
        html: this.getWishlistTemplate(
          userName,
          product.name,
          product.image[0],
          product.price
        ),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };

    } catch (error) {
      console.error('Failed to send email notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test method for development
  async test() {
    try {
      const testResult = await this.sendWishlistNotification(
        'nattapongk991@gmail.com', // Replace with your test email
        'Test User',
        {
          name: 'Test Product',
          image: ['https://example.com/image.jpg'],
          price: 99.99
        }
      );
      console.log('Test email result:', testResult);
      return testResult;
    } catch (error) {
      console.error('Test email failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create single instance
const emailService = new EmailService();

// Export the notification function with the correct name
export const sendWishlistNotification = async (userEmail, userName, product) => {
    return emailService.sendWishlistNotification(userEmail, userName, product);
  };

// For testing in development
export const testEmailService = async () => {
  return emailService.test();
};

export default emailService;