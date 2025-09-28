const User = require('../../models/User');
const Employee = require('../../models/Employee');

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

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};