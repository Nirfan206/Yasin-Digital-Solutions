const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/adminController'); // Using adminController for client management
const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/adminController'); // Using adminController for employee management
const {
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/adminController'); // Using adminController for order management
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/adminController'); // Using adminController for job management
const {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/adminController'); // Using adminController for subscription management
const { getAdminOverviewData } = require('../controllers/adminController'); // For overview

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorizeRoles('admin'));

// Client Management
router.route('/clients')
  .get(getAllClients)
  .post(createClient);
router.route('/clients/:id')
  .put(updateClient)
  .delete(deleteClient);

// Employee Management
router.route('/employees')
  .get(getAllEmployees)
  .post(createEmployee);
router.route('/employees/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Job Management
router.route('/jobs')
  .get(getAllJobs)
  .post(createJob);
router.route('/jobs/:id')
  .put(updateJob)
  .delete(deleteJob);

// Subscription Management
router.route('/subscriptions')
  .get(getAllSubscriptions)
  .post(createSubscription);
router.route('/subscriptions/:id')
  .put(updateSubscription)
  .delete(deleteSubscription);

// Admin Overview
router.get('/overview', getAdminOverviewData);

module.exports = router;