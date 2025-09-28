const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User');
const { createNotification } = require('./notificationController'); // Import notification helper

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

    // Send notification to admin about new contact message
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      const notificationMessage = `New contact message from ${name} (${email}) - Subject: "${subject.slice(0, 30)}..."`;
      // No specific link for now, as there's no admin page for contact messages yet
      await createNotification(adminUser._id, notificationMessage, undefined, 'new_contact_message');
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