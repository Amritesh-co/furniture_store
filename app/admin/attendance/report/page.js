'use client'
import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, UserCheck, UserMinus, Clock } from 'lucide-react'

export default function AttendanceReportPage() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/attendance?weekly=true') // My API route handles the weekly logic
      .then(r => r.json())
      .then(payload => {
        setReport(Array.isArray(payload.data) ? payload.data : [])
        setLoading(false)
      })
  }, [])

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Weekly Attendance Report</h2>
          <p className="text-sm text-gray-500">Last 7 days performance summary</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{report.reduce((s, r) => s + r.presentCount, 0)}</p>
            <p className="text-sm text-gray-500 font-medium">Total Presences</p>
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <UserMinus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{report.reduce((s, r) => s + r.absentCount, 0)}</p>
            <p className="text-sm text-gray-500 font-medium">Total Absences</p>
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{report.reduce((s, r) => s + r.earlyLeaveCount, 0)}</p>
            <p className="text-sm text-gray-500 font-medium">Early Leaves</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-500">Employee</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-500">Dept.</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-500">Present</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-500">Absent</th>
              <th className="px-6 py-4 text-center font-semibold text-amber-600">Early Leave</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-500">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-8"><div className="h-8 bg-gray-50 rounded animate-pulse" /></td></tr>
              ))
            ) : report.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No report data for this period</td></tr>
            ) : report.map(r => {
              const totalDays = r.presentCount + r.absentCount
              const rate = totalDays > 0 ? (r.presentCount / totalDays * 100).toFixed(0) : 0
              return (
                <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{r.employee.name}</p>
                    <p className="text-xs text-gray-400">{r.employee.employeeId}</p>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{r.employee.department}</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600 text-lg">{r.presentCount}</td>
                  <td className="px-6 py-4 text-center font-bold text-red-600 text-lg">{r.absentCount}</td>
                  <td className="px-6 py-4 text-center font-bold text-amber-600 text-lg">{r.earlyLeaveCount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                      <div className="w-16 bg-gray-100 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <span>{rate}%</span>
                    </div>
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
