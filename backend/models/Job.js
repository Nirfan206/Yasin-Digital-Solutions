const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    client: { // Client name associated with the job
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      required: true,
      enum: ['Assigned', 'In Progress', 'Under Review', 'Completed'],
      default: 'Assigned',
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (employee)
      required: false, // Can be unassigned initially
    },
    completionDate: {
      type: Date,
      required: false,
    },
    feedback: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;