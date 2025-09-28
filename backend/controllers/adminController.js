const User = require('../models/User');
const Client = require('../models/Client');
const Employee = require('../models/Employee');
const Order = require('../models/Order');
const Job = require('../models/Job');
const Subscription = require('../models/Subscription');
const bcrypt = require('bcryptjs'); // For creating new user accounts for clients/employees

// --- Client Management ---

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

// --- Employee Management ---

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private (Admin)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching employees' });
  }
};

// @desc    Create a new employee
// @route   POST /api/admin/employees
// @access  Private (Admin)
const createEmployee = async (req, res) => {
  const { name, email, role, status } = req.body;

  if (!name || !email || !role || !status) {
    return res.status(400).json({ error: 'Please add all fields' });
  }

  try {
    // Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create a new user with a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    user = await User.create({
      name,
      email,
      password: tempPassword,
      role: role,
    });

    const employee = await Employee.create({
      userId: user._id,
      name,
      email,
      role,
      status,
      hiredDate: user.createdAt,
    });

    res.status(201).json({ ...employee._doc, id: employee._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating employee' });
  }
};

// @desc    Update employee details
// @route   PUT /api/admin/employees/:id
// @access  Private (Admin)
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update associated User document
    const user = await User.findById(employee.userId);
    if (user) {
      user.name = name || user.name;
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
          return res.status(400).json({ error: 'Email already in use by another user' });
        }
        user.email = email;
      }
      user.role = role || user.role; // Update user's role if changed
      await user.save();
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.role = role || employee.role;
    employee.status = status || employee.status;

    const updatedEmployee = await employee.save();
    res.status(200).json({ ...updatedEmployee._doc, id: updatedEmployee._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating employee' });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/admin/employees/:id
// @access  Private (Admin)
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete associated User document
    await User.findByIdAndDelete(employee.userId);
    await employee.deleteOne();

    res.status(200).json({ message: 'Employee removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting employee' });
  }
};

// --- Order Management ---

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Please provide a new status' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating order status' });
  }
};

// --- Job Management ---

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ dueDate: 1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching jobs' });
  }
};

// @desc    Create a new job
// @route   POST /api/admin/jobs
// @access  Private (Admin)
const createJob = async (req, res) => {
  const { title, client, dueDate, priority, status, employeeId } = req.body;

  if (!title || !client || !dueDate || !priority || !status) {
    return res.status(400).json({ error: 'Please add all required job fields' });
  }

  try {
    const job = await Job.create({
      title,
      client,
      dueDate,
      priority,
      status,
      employeeId: employeeId || undefined, // Can be unassigned
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating job' });
  }
};

// @desc    Update job details
// @route   PUT /api/admin/jobs/:id
// @access  Private (Admin)
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, client, dueDate, priority, status, employeeId } = req.body;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.title = title || job.title;
    job.client = client || job.client;
    job.dueDate = dueDate || job.dueDate;
    job.priority = priority || job.priority;
    job.status = status || job.status;
    job.employeeId = employeeId === 'unassigned' ? undefined : employeeId || job.employeeId;

    if (job.status === 'Completed' && !job.completionDate) {
      job.completionDate = Date.now();
    } else if (job.status !== 'Completed' && job.completionDate) {
      job.completionDate = undefined;
    }

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating job' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting job' });
  }
};

// --- Subscription Management ---

// @desc    Get all subscriptions
// @route   GET /api/admin/subscriptions
// @access  Private (Admin)
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};

// @desc    Create a new subscription
// @route   POST /api/admin/subscriptions
// @access  Private (Admin)
const createSubscription = async (req, res) => {
  const { clientId, serviceName, startDate, nextRenewalDate, status } = req.body;

  if (!clientId || !serviceName || !startDate || !nextRenewalDate || !status) {
    return res.status(400).json({ error: 'Please add all required subscription fields' });
  }

  try {
    const subscription = await Subscription.create({
      clientId,
      serviceName,
      startDate,
      nextRenewalDate,
      status,
    });
    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating subscription' });
  }
};

// @desc    Update subscription details
// @route   PUT /api/admin/subscriptions/:id
// @access  Private (Admin)
const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { clientId, serviceName, startDate, nextRenewalDate, status } = req.body;

  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.clientId = clientId || subscription.clientId;
    subscription.serviceName = serviceName || subscription.serviceName;
    subscription.startDate = startDate || subscription.startDate;
    subscription.nextRenewalDate = nextRenewalDate || subscription.nextRenewalDate;
    subscription.status = status || subscription.status;

    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating subscription' });
  }
};

// @desc    Delete a subscription
// @route   DELETE /api/admin/subscriptions/:id
// @access  Private (Admin)
const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await subscription.deleteOne();
    res.status(200).json({ message: 'Subscription removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting subscription' });
  }
};

// --- Admin Overview ---

// @desc    Get admin overview data
// @route   GET /api/admin/overview
// @access  Private (Admin)
const getAdminOverviewData = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();

    const orders = await Order.find({});
    const orderStatusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, { 'Pending': 0, 'In Progress': 0, 'Under Review': 0, 'Completed': 0, 'Cancelled': 0 });

    const jobs = await Job.find({});
    const jobStatusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, { 'Assigned': 0, 'In Progress': 0, 'Under Review': 0, 'Completed': 0 });

    res.status(200).json({
      totalClients,
      totalEmployees,
      totalOrders,
      orderStatusCounts,
      totalJobs,
      jobStatusCounts,
      totalSubscriptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching admin overview data' });
  }
};


module.exports = {
  // Client
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  // Employee
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  // Order
  getAllOrders,
  updateOrderStatus,
  // Job
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  // Subscription
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  // Overview
  getAdminOverviewData,
};