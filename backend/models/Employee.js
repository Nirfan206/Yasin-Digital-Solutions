const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the actual User document
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: { // Specific role within the employee category (e.g., 'developer', 'designer', 'manager')
      type: String,
      required: true,
      enum: ['employee', 'manager'], // Can be expanded
      default: 'employee',
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    hiredDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;