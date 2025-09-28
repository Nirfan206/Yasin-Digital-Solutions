const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User');
const { createNotification } = require('./notificationController'); // Import notification helper
const sendEmail = require('../utils/sendEmail'); // Import sendEmail utility

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    // Send confirmation email to the sender
    const confirmationEmailMessage = `
      <h1>Thank You for Your Message!</h1>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to Yasin Digital Solutions. We have received your message and will get back to you shortly.</p>
      <p><strong>Your Message Details:</strong></p>
      <ul>
        <li><strong>Subject:</strong> ${subject}</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>
      <p>We appreciate your patience.</p>
      <p>Best regards,</p>
      <p>The Yasin Digital Solutions Team</p>
    `;
    await sendEmail({
      email: email,
      subject: `Confirmation: Your message to Yasin Digital Solutions`,
      message: confirmationEmailMessage,
    });

    // Send notification and email to admin about new contact message
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      const notificationMessage = `New contact message from ${name} (${email}) - Subject: "${subject.slice(0, 30)}..."`;
      const link = `/admin/dashboard/contact-messages`; // Link to admin's contact messages page
      await createNotification(adminUser._id, notificationMessage, link, 'new_contact_message');

      const adminEmailMessage = `
        <h1>New Contact Message Received</h1>
        <p>A new contact message has been submitted:</p>
        <ul>
          <li><strong>From:</strong> ${name} (${email})</li>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
        <p>Please check the admin dashboard to view and manage contact messages.</p>
        <p>Best regards,</p>
        <p>The Yasin Digital Solutions Team</p>
      `;
      await sendEmail({
        email: adminUser.email,
        subject: `New Contact Message: ${subject}`,
        message: adminEmailMessage,
      });
    }

    res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error submitting contact message' });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private (Admin)
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching contact messages' });
  }
};

// @desc    Mark a contact message as read (Admin only)
// @route   PUT /api/contact/:id/read
// @access  Private (Admin)
const markContactMessageAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    message.read = true;
    const updatedMessage = await message.save();
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error marking message as read' });
  }
};

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  markContactMessageAsRead,
};