import mongoose from 'mongoose'

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  present: {
    type: Boolean,
    default: false
  },
  earlyLeave: {
    type: Boolean,
    default: false
  },
  earlyLeaveTime: {
    type: String,
    // Custom validation: earlyLeaveTime only if earlyLeave is true
    validate: {
      validator: function(v) {
        if (this.earlyLeave && !v) return false
        return true
      },
      message: 'Early leave time is required if early leave is marked'
    }
  }
}, { timestamps: true })

// Ensure unique attendance per employee per date
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema)
