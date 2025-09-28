const Job = require('../../models/Job');
const Order = require('../../models/Order'); // Import Order model
const User = require('../../models/User'); // To fetch employee's email
const { createNotification } = require('../notificationController'); // Import notification helper
const sendEmail = require('../../utils/sendEmail'); // Import sendEmail utility

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
  const { title, client, dueDate, priority, status, employeeId, orderId } = req.body; // Added orderId

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
      orderId: orderId || undefined, // Link to order if provided
    });

    // If job is created from an order, update the order status and notify client
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && order.status === 'Pending') { // Only update if order is still pending
        order.status = 'In Progress'; // Or 'Assigned', depending on desired flow
        await order.save();

        const clientUser = await User.findById(order.clientId);
        if (clientUser) {
          const message = `Your order #${order._id.toString().slice(-6)} for "${order.serviceType}" is now "In Progress" as a job has been assigned.`;
          const link = `/client/dashboard/orders`;
          await createNotification(order.clientId, message, link, 'order_status_update');

          const emailMessage = `
            <h1>Order Status Update</h1>
            <p>Dear ${clientUser.name || clientUser.email},</p>
            <p>The status of your order for "${order.serviceType}" (Order ID: ${order._id.toString().slice(-6)}) has been updated to <strong>In Progress</strong>.</p>
            <p>A job has been created and assigned based on your requirements.</p>
            <p>You can view your order details in your dashboard.</p>
            <p>Best regards,</p>
            <p>The Yasin Digital Solutions Team</p>
          `;
          await sendEmail({
            email: clientUser.email,
            subject: `Order Status Update: Order #${order._id.toString().slice(-6)}`,
            message: emailMessage,
          });
        }
      }
    }

    // Send notification and email to assigned employee if applicable
    if (job.employeeId) {
      const employeeUser = await User.findById(job.employeeId);
      if (employeeUser) {
        const message = `You have been assigned a new job: "${job.title}" (ID: ${job._id.toString().slice(-6)}).`;
        const link = `/employee/dashboard/assigned-jobs`; // Link to employee's assigned jobs page
        await createNotification(job.employeeId, message, link, 'job_assigned');

        const emailMessage = `
          <h1>New Job Assignment</h1>
          <p>Dear ${employeeUser.name || employeeUser.email},</p>
          <p>You have been assigned a new job:</p>
          <ul>
            <li><strong>Title:</strong> ${job.title}</li>
            <li><strong>Client:</strong> ${job.client}</li>
            <li><strong>Due Date:</strong> ${new Date(job.dueDate).toLocaleDateString()}</li>
            <li><strong>Priority:</strong> ${job.priority}</li>
          </ul>
          <p>Please check your dashboard for more details.</p>
          <p>Best regards,</p>
          <p>The Yasin Digital Solutions Team</p>
        `;
        await sendEmail({
          email: employeeUser.email,
          subject: `New Job Assigned: ${job.title}`,
          message: emailMessage,
        });
      }
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
  const { title, client, dueDate, priority, status, employeeId } = req.body; // orderId is not updated here

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

    // Handle notifications and emails for employee assignment changes
    const newEmployeeId = updatedJob.employeeId ? updatedJob.employeeId.toString() : undefined;
    if (newEmployeeId && newEmployeeId !== oldEmployeeId) {
      const employeeUser = await User.findById(newEmployeeId);
      if (employeeUser) {
        const message = `You have been assigned job: "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}).`;
        const link = `/employee/dashboard/assigned-jobs`;
        await createNotification(newEmployeeId, message, link, 'job_assigned');

        const emailMessage = `
          <h1>Job Assignment Update</h1>
          <p>Dear ${employeeUser.name || employeeUser.email},</p>
          <p>You have been assigned a new job:</p>
          <ul>
            <li><strong>Title:</strong> ${updatedJob.title}</li>
            <li><strong>Client:</strong> ${updatedJob.client}</li>
            <li><strong>Due Date:</strong> ${new Date(updatedJob.dueDate).toLocaleDateString()}</li>
            <li><strong>Priority:</strong> ${updatedJob.priority}</li>
          </ul>
          <p>Please check your dashboard for more details.</p>
          <p>Best regards,</p>
          <p>The Yasin Digital Solutions Team</p>
        `;
        await sendEmail({
          email: employeeUser.email,
          subject: `Job Re-assigned: ${updatedJob.title}`,
          message: emailMessage,
        });
      }
    } else if (!newEmployeeId && oldEmployeeId) {
      // If job was unassigned from an employee
      const oldEmployeeUser = await User.findById(oldEmployeeId);
      if (oldEmployeeUser) {
        const message = `Job "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}) has been unassigned from you.`;
        await createNotification(oldEmployeeId, message, undefined, 'job_unassigned');

        const emailMessage = `
          <h1>Job Unassigned</h1>
          <p>Dear ${oldEmployeeUser.name || oldEmployeeUser.email},</p>
          <p>The job "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}) has been unassigned from you.</p>
          <p>Best regards,</p>
          <p>The Yasin Digital Solutions Team</p>
        `;
        await sendEmail({
          email: oldEmployeeUser.email,
          subject: `Job Unassigned: ${updatedJob.title}`,
          message: emailMessage,
        });
      }
    }

    // Send notification and email if job status changed for the assigned employee
    if (updatedJob.employeeId && oldStatus !== updatedJob.status) {
      const employeeUser = await User.findById(updatedJob.employeeId);
      if (employeeUser) {
        const message = `The status of job "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}) is now "${updatedJob.status}".`;
        const link = `/employee/dashboard/assigned-jobs`;
        await createNotification(updatedJob.employeeId, message, link, 'job_status_update');

        const emailMessage = `
          <h1>Job Status Update</h1>
          <p>Dear ${employeeUser.name || employeeUser.email},</p>
          <p>The status of job "${updatedJob.title}" (ID: ${updatedJob._id.toString().slice(-6)}) has been updated to <strong>${updatedJob.status}</strong>.</p>
          <p>Please check your dashboard for more details.</p>
          <p>Best regards,</p>
          <p>The Yasin Digital Solutions Team</p>
        `;
        await sendEmail({
          email: employeeUser.email,
          subject: `Job Status Update: ${updatedJob.title}`,
          message: emailMessage,
        });
      }
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

    // Optionally, send a notification and email to the assigned employee if the job is deleted
    if (job.employeeId) {
      const employeeUser = await User.findById(job.employeeId);
      if (employeeUser) {
        const message = `Job "${job.title}" (ID: ${job._id.toString().slice(-6)}) has been deleted.`;
        await createNotification(job.employeeId, message, undefined, 'job_deleted');

        const emailMessage = `
          <h1>Job Deleted</h1>
          <p>Dear ${employeeUser.name || employeeUser.email},</p>
          <p>The job "${job.title}" (ID: ${job._id.toString().slice(-6)}) has been deleted by the administrator.</p>
          <p>Best regards,</p>
          <p>The Yasin Digital Solutions Team</p>
        `;
        await sendEmail({
          email: employeeUser.email,
          subject: `Job Deleted: ${job.title}`,
          message: emailMessage,
        });
      }
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