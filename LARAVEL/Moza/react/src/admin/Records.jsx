import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Records.css';

const Record = () => {
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [edited, setEdited] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subproductFilter, setSubproductFilter] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/product-records');
      const sorted = res.data.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        if (a.product !== b.product) return a.product.localeCompare(b.product);
        return a.subproduct.localeCompare(b.subproduct);
      });
      setRecords(sorted);
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleEdit = (id) => {
    setEditId(id);
    const selected = records.find(r => r.variant_id === id);
    setEdited({ ...selected });
  };

  const handleChange = (e, field) => {
    setEdited(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/product-records/${id}`, {
        material: edited.material,
        size: edited.size,
        color: edited.color,
        type: edited.type,
        printing_side: edited.printing_side,
        price_lo: edited.price_lo,
        agent_price: edited.agent_price,
        customer_price: edited.customer_price,
        notes: edited.notes,
      });

      alert("Variant updated successfully");
      setEditId(null);
      fetchRecords();
    } catch (error) {
      console.error("Update error:", error.response || error);
      alert("Failed to update variant. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/product-records/${id}`);
      fetchRecords();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredRecords = records.filter(r => {
    const matchCategory = categoryFilter ? r.category === categoryFilter : true;
    const matchSubproduct = subproductFilter
      ? r.subproduct.toLowerCase().includes(subproductFilter.toLowerCase())
      : true;
    return matchCategory && matchSubproduct;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-center">All Product Records</h2>

      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <>
          <div className="filter-container mb-4 flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Categories</option>
              {[...new Set(records.map(r => r.category))].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search Subproduct..."
              value={subproductFilter}
              onChange={(e) => setSubproductFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="table-wrapper overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Subproduct</th>
                  <th className="border p-2">Material</th>
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Color</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Printing</th>
                  <th className="border p-2">Price L/O</th>
                  <th className="border p-2">Agent Price</th>
                  <th className="border p-2">Customer Price</th>
                  <th className="border p-2">Notes</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let currentCategory = '';
                  let currentProduct = '';
                  let currentSubproduct = '';
                  let rowNumber = 1;

                  return filteredRecords.map((r) => {
                    const showCategory = currentCategory !== r.category;
                    const showProduct = showCategory || currentProduct !== r.product;
                    const showSubproduct = showProduct || currentSubproduct !== r.subproduct;

                    currentCategory = r.category;
                    currentProduct = r.product;
                    currentSubproduct = r.subproduct;

                    return (
                      <tr key={r.variant_id} className="text-sm">
                        <td className="border p-2 text-center">{rowNumber++}</td>
                        <td className="border p-2">{showCategory ? r.category : ''}</td>
                        <td className="border p-2">{showProduct ? r.product : ''}</td>
                        <td className="border p-2">{showSubproduct ? r.subproduct : ''}</td>

                        {editId === r.variant_id ? (
                          <>
                            <td className="border p-2"><input value={edited.material} onChange={(e) => handleChange(e, 'material')} /></td>
                            <td className="border p-2"><input value={edited.size} onChange={(e) => handleChange(e, 'size')} /></td>
                            <td className="border p-2"><input value={edited.color} onChange={(e) => handleChange(e, 'color')} /></td>
                            <td className="border p-2"><input value={edited.type} onChange={(e) => handleChange(e, 'type')} /></td>
                            <td className="border p-2"><input value={edited.printing_side} onChange={(e) => handleChange(e, 'printing_side')} /></td>
                            <td className="border p-2"><input type="number" value={edited.price_lo} onChange={(e) => handleChange(e, 'price_lo')} /></td>
                            <td className="border p-2"><input type="number" value={edited.agent_price} onChange={(e) => handleChange(e, 'agent_price')} /></td>
                            <td className="border p-2"><input type="number" value={edited.customer_price} onChange={(e) => handleChange(e, 'customer_price')} /></td>
                            <td className="border p-2"><input value={edited.notes} onChange={(e) => handleChange(e, 'notes')} /></td>
                            <td className="border p-2 flex gap-2">
                              <button onClick={() => handleSave(r.variant_id)} className="action-button save">Save</button>
                              <button onClick={() => setEditId(null)} className="action-button cancel">Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border p-2">{r.material}</td>
                            <td className="border p-2">{r.size}</td>
                            <td className="border p-2">{r.color}</td>
                            <td className="border p-2">{r.type}</td>
                            <td className="border p-2">{r.printing_side}</td>
                            <td className="border p-2">{r.price_lo}</td>
                            <td className="border p-2">{r.agent_price}</td>
                            <td className="border p-2">{r.customer_price}</td>
                            <td className="border p-2">{r.notes}</td>
                            <td className="border p-2 flex gap-2">
                              <button onClick={() => handleEdit(r.variant_id)} className="action-button edit">Edit</button>
                              <button onClick={() => handleDelete(r.variant_id)} className="action-button delete">Delete</button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Record;
