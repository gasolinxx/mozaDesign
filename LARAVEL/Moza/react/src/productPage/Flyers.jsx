import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    size: '',
    customWidth: '',
    customLength: '',
    printColor: '',
    offset: '',
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
    data.append('product_type', 'Flyers');
    data.append('size', formData.size);
    data.append('quantity', formData.quantity);
    data.append('delivery_address', formData.deliveryAddress);
    data.append('note', formData.note || '');

    if (formData.artwork) {
      data.append('artwork', formData.artwork);
    }

    const productSpecs = {
      printColor: formData.printColor,
      offset: formData.offset,
      ...(formData.size === 'Custom' && {
        customWidth: formData.customWidth,
        customLength: formData.customLength,
      }),
    };

    data.append('product_specs', JSON.stringify(productSpecs));

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
        <h2 className="form-title">Flyers Order Form</h2>

        {/* Product Details */}
        <section>
          <h3 className="section-title">Product Details</h3>
          <div className="grid-2">
            <div>
              <label>Size</label>
              <select name="size" value={formData.size} onChange={handleChange} required>
                <option value="">- Select Size -</option>
                <option value="A3">A3 (11.7 in × 16.5 in)</option>
                <option value="A4">A4 (8.3 in × 11.7 in)</option>
                <option value="A5">A5 (5.8 in × 8.3 in)</option>
                <option value="Custom">Custom</option>
              </select>

              {formData.size === 'Custom' && (
                <div style={{ marginTop: '10px' }}>
                  <label>
                    Width (cm):
                    <input
                      type="number"
                      name="customWidth"
                      value={formData.customWidth}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    Length (cm):
                    <input
                      type="number"
                      name="customLength"
                      value={formData.customLength}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              )}
            </div>

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

          <div className="grid-2">
            <div>
              <label>Print Color</label>
              <select name="printColor" value={formData.printColor} onChange={handleChange} required>
                <option value="">- Select -</option>
                <option value="Front Only">Front Only</option>
                <option value="Both Sides">Both Sides</option>
              </select>
            </div>

         
          </div>
        </section>

        

        {/* Delivery Info */}
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

        {/* Artwork */}
        <section className="upload-artwork">
          <h3 className="section-title">Upload Artwork</h3>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
        </section>

        {/* Notes */}
        <section>
          <h3 className="section-title">Note (Optional)</h3>
          <textarea name="note" value={formData.note} onChange={handleChange} rows="3" />
        </section>

        {/* Summary */}
        <section className="summary-box">
          <h3>Summary</h3>
          <p><strong>Size:</strong> {formData.size === 'Custom' ? `${formData.customWidth} x ${formData.customLength} cm` : formData.size}</p>
          <p><strong>Quantity:</strong> {formData.quantity}</p>
          <p><strong>Print Color:</strong> {formData.printColor}</p>
          <p><strong>Address:</strong> {formData.deliveryAddress}</p>
          <p><strong>Note:</strong> {formData.note || '—'}</p>
          <p><strong>Artwork:</strong> {formData.artwork?.name || 'None uploaded'}</p>
        </section>

        {/* Submit */}
        <div className="button-group">
          <button type="submit" className="btn-red">Add to Cart</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
