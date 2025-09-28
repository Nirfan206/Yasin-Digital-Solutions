const User = require('../../models/User');
const Client = require('../../models/Client');

// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Private (Admin)
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching clients' });
  }
};

// @desc    Create a new client
// @route   POST /api/admin/clients
// @access  Private (Admin)
const createClient = async (req, res) => {
  const { name, email, status } = req.body;

  if (!name || !email || !status) {
    return res.status(400).json({ error: 'Please add all fields' });
  }

  try {
    // Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create a new user with a temporary password (user will change it later)
    const tempPassword = Math.random().toString(36).slice(-8); // Generate a random password
    user = await User.create({
      name,
      email,
      password: tempPassword, // This will be hashed by the pre-save hook
      role: 'client',
    });

    const client = await Client.create({
      userId: user._id,
      name,
      email,
      status,
      registeredDate: user.createdAt,
    });

    res.status(201).json({ ...client._doc, id: client._id }); // Return client with id as 'id'
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating client' });
  }
};

// @desc    Update client details
// @route   PUT /api/admin/clients/:id
// @access  Private (Admin)
const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, status } = req.body;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Update associated User document
    const user = await User.findById(client.userId);
    if (user) {
      user.name = name || user.name;
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
          return res.status(400).json({ error: 'Email already in use by another user' });
        }
        user.email = email;
      }
      await user.save();
    }

    client.name = name || client.name;
    client.email = email || client.email;
    client.status = status || client.status;

    const updatedClient = await client.save();
    res.status(200).json({ ...updatedClient._doc, id: updatedClient._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating client' });
  }
};

// @desc    Delete a client
// @route   DELETE /api/admin/clients/:id
// @access  Private (Admin)
const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Delete associated User document
    await User.findByIdAndDelete(client.userId);
    await client.deleteOne(); // Use deleteOne() for Mongoose 6+

    res.status(200).json({ message: 'Client removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting client' });
  }
};

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};