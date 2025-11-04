import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    product_type: 'Mug',
    quantity: '',
    deliveryAddress: '',
    note: '',
    artwork: null,

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, artwork: e.target.files[0] }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in first.');
    return;
  }

  const data = new FormData();
  data.append('product_type', 'Mug');
  data.append('quantity', formData.quantity);
  data.append('delivery_address', formData.deliveryAddress);
  data.append('note', formData.note || '');
  
  if (formData.artwork) {
    data.append('artwork', formData.artwork);
  }

  data.append('product_specs', JSON.stringify({})); // ✅ fix

  try {
    await axios.post('http://localhost:8000/api/cart/add', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Item added to cart!');
  } catch (err) {
    console.error(err);
    alert('Failed to submit.');
  }
};

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="banner-form">
        <h2 className="form-title">Mug Order Form</h2>

        <section>
          <h3 className="section-title">Product Details</h3>
          <div className="grid-2">
            <div>
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          
          </div>
        </section>

        <section>
          <h3 className="section-title">Delivery Info</h3>
          <label>Delivery Address</label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
          />
        </section>

        <section>
          <label>Note (optional)</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
          />
        </section>

        <section className="upload-artwork">
          <h3 className="section-title">Upload Artwork</h3>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
          />
        </section>

        <section>
          <h3 className="section-title">Important Notes</h3>
          <p>
            <strong>Estimated completed:</strong>{' '}
            {formData.quantity
              ? formData.quantity > 400
                ? '12 working days'
                : formData.quantity > 100
                ? '7 working days'
                : '4 working days'
              : 'Enter quantity to see estimated time'}
          </p>
        </section>

        <section className="summary-box">
          <h3>Summary</h3>
          <p><strong>Quantity:</strong> {formData.quantity}</p>
          <p><strong>Address:</strong> {formData.deliveryAddress}</p>
          <p><strong>Note:</strong> {formData.note || '—'}</p>
          <p><strong>Artwork:</strong> {formData.artwork?.name || 'None uploaded'}</p>
        </section>

        <div className="button-group">
          <button type="submit" className="btn-red">Add to Cart</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
