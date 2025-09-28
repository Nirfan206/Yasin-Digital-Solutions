const Job = require('../../models/Job');
const { createNotification } = require('../notificationController'); // Import notification helper

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

    // Send notification to assigned employee if applicable
    if (job.employeeId) {
      const message = `You have been assigned a new job: "${job.title}" (ID: ${job._id.toString().slice(-6)}).`;
      const link = `/employee/dashboard/assigned-jobs`; // Link to employee's assigned jobs page
      await createNotification(job.employeeId, message, link, 'job_assigned');
    }

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

    const oldEmployeeId = job.employeeId ? job.employeeId.toString() : undefined;
    const oldStatus = job.status;

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

    // Send notification if employee assignment changed
    const newEmployeeId = updatedJob.employeeId ? updatedJob.employeeId.toString() : undefined;
    if (newEmployeeId && newEmployeeId !== oldEmployeeId) {
      const message = `You have been assigned job: "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}).`;
      const link = `/employee/dashboard/assigned-jobs`;
      await createNotification(newEmployeeId, message, link, 'job_assigned');
    } else if (!newEmployeeId && oldEmployeeId) {
      // If job was unassigned from an employee
      const message = `Job "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}) has been unassigned from you.`;
      await createNotification(oldEmployeeId, message, undefined, 'job_unassigned');
    }

    // Send notification if job status changed for the assigned employee
    if (updatedJob.employeeId && oldStatus !== updatedJob.status) {
      const message = `The status of job "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}) is now "${updatedJob.status}".`;
      const link = `/employee/dashboard/assigned-jobs`;
      await createNotification(updatedJob.employeeId, message, link, 'job_status_update');
    }

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

    // Optionally, send a notification to the assigned employee if the job is deleted
    if (job.employeeId) {
      const message = `Job "${job.title}" (ID: ${job._id.toString().slice(-6)}) has been deleted.`;
      await createNotification(job.employeeId, message, undefined, 'job_deleted');
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting job' });
  }
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
};