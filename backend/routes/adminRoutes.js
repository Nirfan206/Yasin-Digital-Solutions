const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Import modular controllers
const clientController = require('../controllers/admin/clientController');
const employeeController = require('../controllers/admin/employeeController');
const orderController = require('../controllers/admin/orderController');
const jobController = require('../controllers/admin/jobController');
const subscriptionController = require('../controllers/admin/subscriptionController');
const overviewController = require('../controllers/admin/overviewController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorizeRoles('admin'));

// Client Management
router.route('/clients')
  .get(clientController.getAllClients)
  .post(clientController.createClient);
router.route('/clients/:id')
  .put(clientController.updateClient)
  .delete(clientController.deleteClient);

// Employee Management
router.route('/employees')
  .get(employeeController.getAllEmployees)
  .post(employeeController.createEmployee);
router.route('/employees/:id')
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

// Order Management
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Job Management
router.route('/jobs')
  .get(jobController.getAllJobs)
  .post(jobController.createJob);
router.route('/jobs/:id')
  .put(jobController.updateJob)
  .delete(jobController.deleteJob);

// Subscription Management
router.route('/subscriptions')
  .get(subscriptionController.getAllSubscriptions)
  .post(subscriptionController.createSubscription);
router.route('/subscriptions/:id')
  .put(subscriptionController.updateSubscription)
  .delete(subscriptionController.deleteSubscription);

// Admin Overview
router.get('/overview', overviewController.getAdminOverviewData);

module.exports = router;