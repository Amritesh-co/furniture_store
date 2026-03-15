import mongoose from 'mongoose'

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide employee name']
  },
  employeeId: {
    type: String,
    required: [true, 'Please provide employee ID'],
    unique: true
  },
  age: Number,
  phone: String,
  department: String,
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff'
  }
}, { timestamps: true })

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema)
