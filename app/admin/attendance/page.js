'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, Clock, Calendar, AlertCircle, FileText } from 'lucide-react'

export default function AttendancePage() {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState({})
  const [shopOpen, setShopOpen] = useState(null) // null | true | false
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, shopRes, attRes] = await Promise.all([
          fetch('/api/employees').then(r => r.json()),
          fetch(`/api/shopday?date=${today}`).then(r => r.json()),
          fetch(`/api/attendance?date=${today}`).then(r => r.json())
        ])

        setEmployees(Array.isArray(empRes.data) ? empRes.data : [])
        setShopOpen(shopRes.data?.open ?? null)
        
        const attMap = {}
        if (Array.isArray(attRes.data)) {
          attRes.data.forEach(a => {
            attMap[a.employeeId] = {
              present: a.present,
              earlyLeave: a.earlyLeave,
              earlyLeaveTime: a.earlyLeaveTime || ''
            }
          })
        }
        setAttendance(attMap)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchData()
  }, [today])

  const handleShopConfirmation = async (open) => {
    setSaving(true)
    await fetch('/api/shopday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, open })
    })
    setShopOpen(open)
    setSaving(false)
  }

  const toggleAttendance = (id, type) => {
    setAttendance(prev => {
      const current = prev[id] || { present: false, earlyLeave: false, earlyLeaveTime: '' }
      if (type === 'present') {
        return { ...prev, [id]: { ...current, present: !current.present, earlyLeave: !current.present ? current.earlyLeave : false } }
      }
      if (type === 'earlyLeave') {
        return { ...prev, [id]: { ...current, earlyLeave: !current.earlyLeave } }
      }
      return prev
    })
  }

  const handleTimeChange = (id, time) => {
    setAttendance(prev => ({
      ...prev,
      [id]: { ...prev[id], earlyLeaveTime: time }
    }))
  }

  const saveAttendance = async () => {
    setSaving(true)
    const attendanceData = employees.map(e => ({
      employeeId: e._id,
      present: attendance[e._id]?.present || false,
      earlyLeave: attendance[e._id]?.earlyLeave || false,
      earlyLeaveTime: attendance[e._id]?.earlyLeaveTime || ''
    }))

    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, attendanceData })
    })
    setSaving(false)
    alert('Attendance saved successfully!')
  }

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Attendance System...</div>

  if (shopOpen === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Shop Open Confirmation</h2>
          <p className="text-gray-500 mt-2">Is the shop open today, {new Date(today).toLocaleDateString('en-IN', { dateStyle: 'full' })}?</p>
        </div>
        <div className="flex gap-4">
          <button
            disabled={saving}
            onClick={() => handleShopConfirmation(false)}
            className="px-8 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            ❌ Closed Today
          </button>
          <button
            disabled={saving}
            onClick={() => handleShopConfirmation(true)}
            className="px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-lg"
          >
            ✅ Open Today
          </button>
        </div>
      </div>
    )
  }

  if (shopOpen === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Shop is Marked as Closed</h2>
        <p className="text-gray-500">No attendance records needed for today.</p>
        <button onClick={() => setShopOpen(null)} className="text-primary text-sm font-medium hover:underline">Change Status</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Daily Attendance</h2>
          <p className="text-sm text-gray-500">Date: {new Date(today).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/attendance/report" className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4" /> View Weekly Report
          </Link>
          <button onClick={() => setShopOpen(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800">Change Shop Status</button>
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-500">Employee</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-500">Department</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-500">Present</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-500">Absent</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-500">Early Leave</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-500">Leave Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employees.map(e => {
              const att = attendance[e._id] || { present: false, earlyLeave: false, earlyLeaveTime: '' }
              return (
                <tr key={e._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-900">{e.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{e.employeeId}</p>
                  </td>
                  <td className="px-6 py-5 text-center text-gray-600">{e.department}</td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => toggleAttendance(e._id, 'present')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                        att.present 
                          ? 'bg-green-500 text-white border-green-600 shadow-md ring-2 ring-green-100' 
                          : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-200 hover:text-gray-600'
                      }`}
                      title="Present"
                    >
                      <Check className="w-6 h-6" strokeWidth={3} />
                    </button>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => toggleAttendance(e._id, 'present')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                        !att.present 
                          ? 'bg-red-500 text-white border-red-600 shadow-md ring-2 ring-red-100' 
                          : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-200 hover:text-gray-600'
                      }`}
                      title="Absent"
                    >
                      <X className="w-6 h-6" strokeWidth={3} />
                    </button>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      disabled={!att.present}
                      onClick={() => toggleAttendance(e._id, 'earlyLeave')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                        att.earlyLeave 
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-100' 
                          : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-200 hover:text-gray-600'
                      } disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed`}
                      title="Early Leave"
                    >
                      <Clock className="w-6 h-6" strokeWidth={3} />
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    {att.earlyLeave && att.present && (
                      <input
                        type="time"
                        value={att.earlyLeaveTime}
                        onChange={e => handleTimeChange(e._id, e.target.value)}
                        className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
