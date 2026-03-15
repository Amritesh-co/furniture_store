'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, Package } from 'lucide-react'

const CATEGORIES = ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage']
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const emptyForm = {
  name: '', price: '', category: 'Sofas', material: '', description: '',
  dimensions: '', images: [], stock: '', lowStockThreshold: '5', isFeatured: false,
  warrantyPeriod: '', guaranteePeriod: '', termsAndConditions: ['']
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState([]) // Store new file objects
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products?limit=100', { cache: 'no-store' })
      const payload = await res.json()
      setProducts(payload.data?.products || [])
    } catch (err) {
      console.error('Fetch products error:', err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => { setForm(emptyForm); setImageFiles([]); setModal('add'); setEditId(null); setUploadProgress('') }
  const openEdit = (p) => {
    setForm({ 
      ...p, 
      images: Array.isArray(p.images) ? p.images : [], // Keep as array of URLs
      price: p.price.toString(), 
      stock: p.stock.toString(), 
      lowStockThreshold: p.lowStockThreshold?.toString() || '5',
      warrantyPeriod: p.warranty?.warrantyPeriod || '',
      guaranteePeriod: p.warranty?.guaranteePeriod || '',
      termsAndConditions: (p.warranty?.termsAndConditions && p.warranty.termsAndConditions.length > 0) ? p.warranty.termsAndConditions : ['']
    })
    setImageFiles([])
    setUploadProgress('')
    setEditId(p._id); setModal('edit')
  }

  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name?.trim()) e.name = 'Product name is required'
    if (!form.price || parseFloat(form.price) < 0) e.price = 'Price cannot be negative'
    if (!form.stock || parseInt(form.stock) < 0) e.stock = 'Stock cannot be negative'
    if (parseInt(form.lowStockThreshold) < 0) e.lowStockThreshold = 'Alert threshold cannot be negative'
    if (!form.category) e.category = 'Category is required'
    if (form.images.length === 0 && imageFiles.length === 0) e.images = 'At least one image is required'
    return e
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSaving(true)
    setUploadProgress('Uploading images...')

    let finalImages = [...form.images]

    try {
      if (imageFiles.length > 0) {
        const formData = new FormData()
        imageFiles.forEach(file => formData.append('images', file))

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!uploadRes.ok) {
          let message = 'Image upload failed'
          try {
            const errData = await uploadRes.json()
            if (errData?.error) message = errData.error
          } catch {
            // Keep default message when response is not JSON.
          }
          throw new Error(message)
        }
        const uploadPayload = await uploadRes.json()
        const uploadData = uploadPayload.data || {}
        const uploadedFiles = Array.isArray(uploadData.files)
          ? uploadData.files
          : (Array.isArray(uploadData.urls) ? uploadData.urls : [])

        if (uploadedFiles.length === 0) {
          throw new Error('Upload completed but no file URLs were returned')
        }

        finalImages = [...finalImages, ...uploadedFiles]
      }

      setUploadProgress('Saving product...')

      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        lowStockThreshold: parseInt(form.lowStockThreshold || 0),
        images: finalImages,
        warranty: {
          warrantyPeriod: form.warrantyPeriod,
          guaranteePeriod: form.guaranteePeriod,
          termsAndConditions: form.termsAndConditions.filter(t => t.trim() !== '')
        }
      }
      
      const url = modal === 'edit' ? `/api/products/${editId}` : '/api/products'
      const method = modal === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to save product')
      setModal(null)
      fetchProducts()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
      setUploadProgress('')
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete product')
      
      // Live delete: remove instantly from UI without fetching entire list again
      setProducts(prev => prev.filter(p => p._id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      alert(err.message)
      setDeleteId(null)
    }
  }

  const stockBadge = (status) => ({
    inStock: 'bg-green-100 text-green-700',
    lowStock: 'bg-yellow-100 text-yellow-700',
    outOfStock: 'bg-red-100 text-red-700',
  }[status] || 'bg-gray-100 text-gray-600')

  const handleTermChange = (index, value) => {
    const newTerms = [...form.termsAndConditions];
    newTerms[index] = value;
    setForm(f => ({ ...f, termsAndConditions: newTerms }));
  }

  const addTerm = () => {
    setForm(f => ({ ...f, termsAndConditions: [...f.termsAndConditions, ''] }));
  }

  const removeTerm = (index) => {
    if (form.termsAndConditions.length === 1) return;
    const newTerms = form.termsAndConditions.filter((_, i) => i !== index);
    setForm(f => ({ ...f, termsAndConditions: newTerms }));
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const validFiles = []
      const rejected = []

      for (const file of files) {
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
          rejected.push(`${file.name}: unsupported format`)
          continue
        }
        if (file.size > MAX_IMAGE_SIZE) {
          rejected.push(`${file.name}: larger than 5MB`)
          continue
        }
        validFiles.push(file)
      }

      if (rejected.length > 0) {
        alert(`Some files were skipped:\n- ${rejected.join('\n- ')}`)
      }

      // Add preview property to help with cleanup
      const filesWithPreview = validFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))

      setImageFiles(prev => [...prev, ...filesWithPreview])
      if (errors.images) setErrors(e => ({...e, images: null}))
    }
  }

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imageFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
    }
  }, [imageFiles])

  const removeExistingImage = (index) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const removeNewFile = (index) => {
    const file = imageFiles[index]
    if (file && file.preview) URL.revokeObjectURL(file.preview)
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Products</h2>
          <p className="text-sm text-gray-500">{products.length} products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-10 bg-gray-50 rounded-lg animate-pulse" /></td></tr>
            )) : products.map(p => (
              <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden"><img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" /></div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs">
                  <p className="truncate">{p.name}</p>
                  {p.isFeatured && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 mt-1 inline-block">★ Featured</span>}
                </td>
                <td className="px-6 py-4 text-gray-500">{p.category}</td>
                <td className="px-6 py-4 font-medium text-primary">{formatPrice(p.price)}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${stockBadge(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="font-serif text-2xl font-medium text-gray-900">{modal === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Product Name', type: 'text', full: true },
                { key: 'price', label: 'Price (₹)', type: 'number' },
                { key: 'stock', label: 'Stock', type: 'number' },
                { key: 'lowStockThreshold', label: 'Low Stock Alert', type: 'number' },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'dimensions', label: 'Dimensions (L×W×H)', type: 'text' },
              ].map(({ key, label, type, full }) => (
                <div key={key} className={full ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type={type} min={type === 'number' ? "0" : undefined} value={form[key]} 
                    onChange={e => {
                      setForm(f => ({ ...f, [key]: e.target.value }))
                      if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
                    }}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                      errors[key] ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'
                    }`} />
                  {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={form.category} 
                  onChange={e => {
                    setForm(f => ({ ...f, category: e.target.value }))
                    if (errors.category) setErrors(prev => ({ ...prev, category: null }))
                  }}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer bg-white ${
                    errors.category ? 'border-red-400' : 'border-gray-200'
                  }`}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div className="flex items-center gap-2 self-end pb-3">
                <input type="checkbox" id="feat" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-5 h-5 text-primary focus:ring-primary" />
                <label htmlFor="feat" className="text-sm font-medium text-gray-700">Featured Product</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Images</label>
                
                {/* Image Previews */}
                <div className="flex flex-wrap gap-4 mb-3">
                  {/* Existing Images */}
                  {Array.isArray(form.images) && form.images.map((imgUrl, idx) => (
                    <div key={`existing-${idx}`} className="relative group w-24 h-24 border rounded-lg overflow-hidden bg-gray-50">
                      <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  {/* New Files Preview */}
                  {imageFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative group w-24 h-24 border rounded-lg overflow-hidden bg-gray-50">
                      <img src={file.preview} alt="File Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">New</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${errors.images ? 'border-red-400' : 'border-gray-300'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-400">PNG, JPG/JPEG, WEBP or AVIF (Max 5MB)</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
              </div>

              {/* Warranty & Guarantee Section */}
              <div className="sm:col-span-2 mt-4 pt-6 border-t border-gray-100">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Warranty & Guarantee
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Warranty Period</label>
                    <input type="text" placeholder="e.g. 3 years" value={form.warrantyPeriod} onChange={e => setForm(f => ({ ...f, warrantyPeriod: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Guarantee Period</label>
                    <input type="text" placeholder="e.g. 1 year" value={form.guaranteePeriod} onChange={e => setForm(f => ({ ...f, guaranteePeriod: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms and Conditions</label>
                  <div className="space-y-2">
                    {form.termsAndConditions.map((term, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={term} placeholder="e.g. Covers manufacturing defects only" onChange={(e) => handleTermChange(index, e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
                        <button type="button" onClick={() => removeTerm(index)} disabled={form.termsAndConditions.length === 1}
                          className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addTerm} className="mt-3 text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> Add Term
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button onClick={() => setModal(null)} className="px-6 border border-gray-200 bg-white rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 flex items-center justify-center gap-2 bg-primary rounded-lg text-white py-2.5 text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-70 shadow-sm">
                <Check className="w-4 h-4" /> {saving ? (uploadProgress || 'Saving...') : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
