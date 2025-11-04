import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cart.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:8000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.cart || [];
        setCartItems(data.map(item => ({ ...item, selected: false })));
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setStatusMsg('Error loading cart. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const updateQuantity = (index, value) => {
    const updated = [...cartItems];
    updated[index].quantity = Number(value);
    setCartItems(updated);
  };

  const removeItem = async (index) => {
    const token = localStorage.getItem('token');
    const item = cartItems[index];

    try {
      await axios.delete(`http://localhost:8000/api/cart/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = [...cartItems];
      updated.splice(index, 1);
      setCartItems(updated);
      setStatusMsg(`✅ Removed item: ${item.subproduct_name || item.product_type}`);
    } catch {
      setStatusMsg('❌ Error removing item.');
    }
  };

  const toggleSelect = (index) => {
    const updated = [...cartItems];
    updated[index].selected = !updated[index].selected;
    setCartItems(updated);
  };

  const handleSubmitOrder = async () => {
    const token = localStorage.getItem('token');
    const selectedItems = cartItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      alert('Please select at least one item to submit.');
      return;
    }

    const formData = new FormData();

    selectedItems.forEach((item, idx) => {
      formData.append(`items[${idx}][cart_id]`, item.id);
      formData.append(`items[${idx}][product_type]`, item.product_type);
      if (item.subproduct_name) formData.append(`items[${idx}][subproduct_name]`, item.subproduct_name);
      if (item.width) formData.append(`items[${idx}][width]`, item.width);
      if (item.height) formData.append(`items[${idx}][height]`, item.height);
      if (item.size) formData.append(`items[${idx}][size]`, item.size);
      formData.append(`items[${idx}][quantity]`, item.quantity);
      formData.append(`items[${idx}][delivery_address]`, 'default address');
      if (item.note) formData.append(`items[${idx}][note]`, item.note);
      if (item.product_specs) {
        formData.append(`items[${idx}][product_specs]`, item.product_specs);
      }
    });

    try {
      setSubmitting(true);
      await axios.post('http://localhost:8000/api/orders/submit', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatusMsg('✅ Order submitted successfully!');
      setCartItems(cartItems.filter(item => !item.selected));
    } catch (err) {
      setStatusMsg('❌ Error submitting order.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => setPreviewImage(null);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {statusMsg && <div className="status-message">{statusMsg}</div>}

      {loading ? (
        <p>Loading cart items...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-table-container">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Product</th>
                  <th>Subproduct</th>
                  <th>Qty</th>
                  <th>Size</th>
                  <th>Upload</th>
                  <th>Note</th>
                  <th>Specs</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelect(idx)}
                      />
                    </td>
                    <td>{item.product_type}</td>
                    <td>{item.subproduct_name || '—'}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(idx, e.target.value)}
                        className="quantity-input"
                      />
                    </td>
                    <td>{item.size || '—'}</td>
                    <td>
                      {item.artwork_path ? (
                        item.artwork_path.endsWith('.pdf') ? (
                          <a
                            href={`http://localhost:8000/storage/${item.artwork_path}`}
                            download
                            className="download-link"
                          >
                            PDF
                          </a>
                        ) : (
                          <div className="upload-cell">
                            <img
                              src={`http://localhost:8000/storage/${item.artwork_path}`}
                              alt="Artwork"
                              className="thumbnail"
                              onClick={() =>
                                setPreviewImage(`http://localhost:8000/storage/${item.artwork_path}`)
                              }
                            />
                            <a
                              href={`http://localhost:8000/storage/${item.artwork_path}`}
                              download
                              className="download-link"
                            >
                              Download
                            </a>
                          </div>
                        )
                      ) : (
                        'No artwork'
                      )}
                    </td>
                    <td>{item.note || '—'}</td>
                    <td>
                      {(() => {
                        try {
                          const specs = JSON.parse(item.product_specs || '{}');
                          if (typeof specs !== 'object' || Array.isArray(specs)) {
                            return <span style={{ color: 'red' }}>Invalid Specs</span>;
                          }

                          const rendered = Object.entries(specs).reduce((acc, [key, value]) => {
                            if (key.endsWith('Qty')) return acc;

                            const label = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (s) => s.toUpperCase());

                            const qty = specs[`${key}Qty`];
                            const line = `${value}${qty ? ` (Qty: ${qty})` : ''}`;

                            acc.push(
                              <li key={key}>
                                <strong>{label}:</strong> {line}
                              </li>
                            );
                            return acc;
                          }, []);

                          return rendered.length > 0 ? (
                            <ul style={{ paddingLeft: '1rem', margin: 0 }}>{rendered}</ul>
                          ) : (
                            <span>—</span>
                          );
                        } catch {
                          return <span style={{ color: 'red' }}>Invalid Specs</span>;
                        }
                      })()}
                    </td>
                    <td className="action-col">
                      <button className="remove-btn" onClick={() => removeItem(idx)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="btn submit-btn"
            onClick={handleSubmitOrder}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </>
      )}

      {previewImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
