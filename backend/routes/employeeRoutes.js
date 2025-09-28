const express = require('express');
const {
  getAssignedJobs,
  updateJobStatus,
  getCompletedJobs,
  getAllEmployeeJobs,
} = require('../controllers/employeeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// All employee routes require authentication and employee/manager role
router.use(protect, authorizeRoles('employee', 'manager'));

router.get('/jobs/assigned', getAssignedJobs);
router.get('/jobs/completed', getCompletedJobs);
router.get('/jobs/all', getAllEmployeeJobs); // For overview
router.put('/jobs/:id/status', updateJobStatus);

module.exports = router;