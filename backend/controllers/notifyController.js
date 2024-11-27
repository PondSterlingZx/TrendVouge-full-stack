import nodemailer from 'nodemailer';
import productModel from '../models/productModel.js';
import notifyModel from '../models/notifyModel.js';

// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "trendvouge.contact@gmail.com",
    pass: "izcbcmthjpwbglpx",
  }
});

// Email template function
const getEmailTemplate = (productName, productImage, size, productLink) => `
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
          <h1>Product Back in Stock!</h1>
        </div>
        <div class="content">
          <h2>Good News!</h2>
          <p>The product <strong>${productName}</strong> in size <strong>${size}</strong> is back in stock!</p>
          <img src="${productImage}" alt="${productName}" class="product-image"/>
          <p>Don't miss out – order now while stock lasts!</p>
          <a href="${productLink}" class="button">Buy Now</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TrendVouge</p>
          <p>Stay fashionable!</p>
        </div>
      </div>
    </body>
  </html>
`;

// Send Notification Emails
const sendNotifyEmails = async (productId, size) => {
  try {
    // Fetch notification records for specific product and size
    const notifications = await notifyModel.find({ productId, size });

    // If no notifications are found, log and exit
    if (notifications.length === 0) {
      console.log(`No notifications found for Product ID: ${productId}, Size: ${size}`);
      return;
    }

    // Get product details
    const product = await productModel.findById(productId);
    if (!product) {
      console.log(`Product not found for ID: ${productId}`);
      return;
    }

    // Check stock availability for the specified size
    const stockLevel = product.stockLevel.get(size); // Assuming stockLevel is a Map
    if (!stockLevel || stockLevel <= 0) {
      console.log(`Stock unavailable for Product ID: ${productId}, Size: ${size}`);
      return;
    }

    // Loop through all the emails for each notification
    for (const notification of notifications) {
      const { emails } = notification;

      // Send notification emails
      for (const email of emails) {
        const mailOptions = {
          from: {
            name: 'TrendVouge',
            address: process.env.EMAIL_USER,  // Use your email address here
          },
          to: email,  // Recipient's email address
          subject: `Product Back in Stock: ${product.name}`,
          html: getEmailTemplate(
            product.name,
            product.image[0],  // Assuming product.image is an array of image URLs
            size,
            `http://localhost:5173/product/${productId}`  // Link to the product page
          ),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${email}`);
      }

      // Remove the notification after sending
      await notifyModel.findByIdAndDelete(notification._id);
    }

    console.log('Notifications sent successfully.');
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};

// Add Notification
const addNotify = async (req, res) => {
  try {
    const { email, productId, size } = req.body;

    // Validate the incoming request body for required fields
    if (!email || !productId || !size) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Find the product and ensure the size exists
    const product = await productModel.findById(productId);
    if (!product || !product.sizes.includes(size)) {
      return res.status(400).json({ success: false, message: 'Invalid size for the given product.' });
    }

    // Check if a notification already exists for the same product and size
    let existingNotification = await notifyModel.findOne({ productId, size });

    if (existingNotification) {
      // Check if the email already exists in the emails array
      if (existingNotification.emails.includes(email)) {
        return res.status(409).json({ success: false, message: 'Notification already exists for this product and size.' });
      }

      // Add the email to the emails array of the existing notification
      existingNotification.emails.push(email);
      await existingNotification.save();
    } else {
      // If no existing notification, create a new one with the email in the emails array
      const newNotification = new notifyModel({
        productId,
        size,
        emails: [email], // Directly add the email in the array when creating a new document
      });
      await newNotification.save();
    }

    res.json({ success: true, message: 'Notification added successfully.' });
  } catch (error) {
    console.error('Error adding notification:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Remove Notification
const removeNotify = async (req, res) => {
  try {
    const { email, productId, size } = req.body;

    // Validate the incoming request body for required fields
    if (!email || !productId || !size) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Find the notification record for the given productId and size
    const notification = await notifyModel.findOne({ productId, size });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'No notification found for this product and size.' });
    }

    // Check if the email exists in the emails array
    const emailIndex = notification.emails.indexOf(email);

    if (emailIndex === -1) {
      return res.status(404).json({ success: false, message: 'Email not found in the notification list.' });
    }

    // Remove the email from the emails array
    notification.emails.splice(emailIndex, 1);

    // If no emails are left, delete the notification record
    if (notification.emails.length === 0) {
      await notifyModel.findByIdAndDelete(notification._id);
      return res.json({ success: true, message: 'Notification removed successfully.' });
    } else {
      await notification.save();
      return res.json({ success: true, message: 'Email removed from notification list.' });
    }

  } catch (error) {
    console.error('Error removing notification:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};




// Export Controllers
export { sendNotifyEmails, addNotify, removeNotify };