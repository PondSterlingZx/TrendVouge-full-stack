import nodemailer from 'nodemailer';

class WishlistNotification {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "trendvouge6@gmail.com",
        pass: "mzhmpecjpyaxiufz",
      }
    });

    this.getEmailTemplate = (userName, productName, productImage, productPrice) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
            }
            .header {
              background-color: #000;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
              text-align: center;
            }
            .product-image {
              max-width: 300px;
              margin: 20px auto;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #000;
              color: #fff !important;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Added to Your Wishlist!</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName || 'Valued Customer'}!</h2>
              <p>Thank you for adding <strong>${productName}</strong> to your wishlist.</p>
              <img src="${productImage}" alt="${productName}" class="product-image"/>
              <p>Price: $${productPrice}</p>
              <p>We'll notify you about any special offers or updates about this item!</p>
              <a href="http://localhost:5173/product/${productName}" class="button">View Product</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TrendVouge</p>
              <p>Stay fashionable!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendNotification(userEmail, userName, product) {
    try {
      const mailOptions = {
        from: {
          name: 'TrendVouge',
          address: 'trendvouge6@gmail.com'
        },
        to: userEmail,
        subject: 'Item Added to Your TrendVouge Wishlist',
        html: this.getEmailTemplate(
          userName, 
          product.name, 
          product.image[0], 
          product.price
        ),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Wishlist notification sent:', info.response);
      return true;

    } catch (error) {
      console.error('Failed to send wishlist notification:', error);
      return false;
    }
  }
}

const wishlistNotifier = new WishlistNotification();

export const sendWishlistNotification = async (userEmail, userName, product) => {
  return wishlistNotifier.sendNotification(userEmail, userName, product);
};

export default WishlistNotification;