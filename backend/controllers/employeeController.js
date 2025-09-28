const Job = require('../models/Job');

// @desc    Get jobs assigned to the logged-in employee
// @route   GET /api/employee/jobs/assigned
// @access  Private (Employee, Manager)
const getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employeeId: req.user._id, status: { $ne: 'Completed' } }).sort({ dueDate: 1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching assigned jobs' });
  }
};

// @desc    Get all jobs for the logged-in employee (for overview)
// @route   GET /api/employee/jobs/all
// @access  Private (Employee, Manager)
const getAllEmployeeJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employeeId: req.user._id }).sort({ dueDate: 1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching all employee jobs' });
  }
};

// @desc    Update job status
// @route   PUT /api/employee/jobs/:id/status
// @access  Private (Employee, Manager)
const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Please provide a new status' });
  }

  try {
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Ensure the job is assigned to the current employee
    if (job.employeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    job.status = status;
    if (status === 'Completed') {
      job.completionDate = Date.now();
    } else {
      job.completionDate = undefined; // Clear completion date if status changes from completed
    }

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating job status' });
  }
};

// @desc    Get completed jobs for the logged-in employee
// @route   GET /api/employee/jobs/completed
// @access  Private (Employee, Manager)
const getCompletedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employeeId: req.user._id, status: 'Completed' }).sort({ completionDate: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching completed jobs' });
  }
};

module.exports = {
  getAssignedJobs,
  updateJobStatus,
  getCompletedJobs,
  getAllEmployeeJobs,
};