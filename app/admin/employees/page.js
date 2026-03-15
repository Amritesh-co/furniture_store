'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, UserPlus, Phone, Briefcase, Hash } from 'lucide-react'
import Link from 'next/link'

const emptyForm = { name: '', employeeId: '', age: '', phone: '', department: 'Sales', role: 'staff' }

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'add' | 'edit'
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const fetchData = () => {
    setLoading(true)
    fetch('/api/employees')
      .then(r => r.json())
      .then(payload => {
        setEmployees(Array.isArray(payload.data) ? payload.data : [])
        setLoading(false)
      })
  }

  useEffect(fetchData, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.employeeId.trim()) e.employeeId = 'Employee ID is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    return e
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) return setErrors(errs)
    
    setSaving(true)
    const url = modal === 'edit' ? `/api/employees/${editId}` : '/api/employees'
    const method = modal === 'edit' ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to save')
      setModal(null)
      fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const openAdd = () => { setForm(emptyForm); setModal('add'); setEditId(null); setErrors({}) }
  const openEdit = (e) => { setForm(e); setEditId(e._id); setModal('edit'); setErrors({}) }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return
    await fetch(`/api/employees/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Employee Management</h2>
          <p className="text-sm text-gray-500">{employees.length} total staff members</p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
          onClick={openAdd}
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Employee', 'ID', 'Department', 'Role', 'Contact', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-lg animate-pulse" /></td></tr>
              ))
            ) : employees.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-400">No employees found</td></tr>
            ) : employees.map(e => (
              <tr key={e._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{e.name}</td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{e.employeeId}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{e.department}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                    e.role === 'admin' ? 'bg-red-50 text-red-700 border-red-100' :
                    e.role === 'manager' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-green-50 text-green-700 border-green-100'
                  }`}>
                    {e.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{e.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(e)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(e._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-serif text-2xl font-medium text-gray-900">{modal === 'add' ? 'Add Employee' : 'Edit Employee'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${errors.employeeId ? 'border-red-400' : 'border-gray-200'}`}
                    value={form.employeeId}
                    onChange={e => setForm({ ...form, employeeId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-5 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
