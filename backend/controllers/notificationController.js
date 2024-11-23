import nodemailer from 'nodemailer';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "trendvouge6@gmail.com",
    pass: "mzhmpecjpyaxiufz",
  }
});

const getEmailTemplate = (userName, productName, productImage, productPrice) => `
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

export const sendWishlistNotification = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Get user and product details
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ 
        success: false, 
        message: "User or product not found" 
      });
    }

    const mailOptions = {
      from: {
        name: 'TrendVouge',
        address: 'trendvouge6@gmail.com'
      },
      to: user.email,
      subject: 'Item Added to Your TrendVouge Wishlist',
      html: getEmailTemplate(
        user.name,
        product.name,
        product.image[0],
        product.price
      ),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send notification" 
    });
  }
};