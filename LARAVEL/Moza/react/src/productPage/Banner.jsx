import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

const Banner = () => {
  const [orders, setOrders] = useState([
    {
      subproduct: '',
      width: '',
      height: '',
      quantity: '',
      topEyelet: '',
      topEyeletQty: '',
      bottomEyelet: '',
      bottomEyeletQty: '',
      artwork: null,
      note: ''
    }
  ]);

 
  const [bannerSubproducts, setBannerSubproducts] = useState([]);
  const [actionType, setActionType] = useState('cart');

  useEffect(() => {
    const fetchBannerSubproducts = async () => {
      try {
        const productsRes = await axios.get('http://localhost:8000/api/products');
        const bannerProduct = productsRes.data.find(p => p.name === 'Banner');

        if (bannerProduct) {
          const subproductsRes = await axios.get(`http://localhost:8000/api/products/${bannerProduct.id}/subproducts`);
          setBannerSubproducts(subproductsRes.data);
        } else {
          console.warn('No product found with name "Banner".');
        }
      } catch (error) {
        console.error('❌ Error fetching subproducts:', error);
      }
    };

    fetchBannerSubproducts();
  }, []);

  const handleOrderChange = (index, field, value) => {
    const newOrders = [...orders];
    newOrders[index][field] = value;
    setOrders(newOrders);
  };

  const handleFileChange = (index, file) => {
    const newOrders = [...orders];
    newOrders[index].artwork = file;
    setOrders(newOrders);
  };

  const removeOrder = (index) => {
    if (orders.length === 1) return;
    const newOrders = [...orders];
    newOrders.splice(index, 1);
    setOrders(newOrders);
  };

  const addNewOrder = () => {
    setOrders([
      ...orders,
      {
        subproduct: '',
        width: '',
        height: '',
        quantity: '',
        topEyelet: '',
        topEyeletQty: '',
        bottomEyelet: '',
        bottomEyeletQty: '',
        artwork: null,
        note: ''
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      return;
    }

 
    const endpoint = actionType === 'cart'
      ? 'http://localhost:8000/api/cart/add'
      : 'http://localhost:8000/api/orders/submit';

    try {
      for (const [index, order] of orders.entries()) {
        const data = new FormData();
        data.append('product_type', 'Banner');
        data.append('subproduct', order.subproduct);
        data.append('size', `${order.width}x${order.height} ft`);
        data.append('quantity', order.quantity);
        data.append('note', order.note);


        if (order.artwork) {
          data.append('artwork', order.artwork);
        }

        const productSpecs = {
          ...(order.topEyelet && { topEyelet: order.topEyelet }),
          ...(order.topEyelet === 'Yes' && order.topEyeletQty && { topEyeletQty: order.topEyeletQty }),
          ...(order.bottomEyelet && { bottomEyelet: order.bottomEyelet }),
          ...(order.bottomEyelet === 'Yes' && order.bottomEyeletQty && { bottomEyeletQty: order.bottomEyeletQty }),
        };

        data.append('product_specs', JSON.stringify(productSpecs));

        const response = await axios.post(endpoint, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        });

        console.log(`✅ Item ${index + 1} submitted:`, response.data);
      }

      alert(actionType === 'cart' ? 'All items added to cart!' : 'Order submitted successfully!');
    } catch (err) {
      console.error('❌ Submission failed:', err);
      if (err.response) {
        console.error('📦 Server Response:', err.response.data);
        alert(`Submission failed: ${err.response.data.message || 'Server Error'}`);
      } else if (err.request) {
        console.error('📡 No response received:', err.request);
        alert('Submission failed: No response from server.');
      } else {
        alert(`Submission failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="banner-form">
        <h2 className="form-title">Banner Order Form</h2>

        {orders.map((order, index) => (
          <div key={index} className="order-section">
            <h3 className="section-title">Item :{index + 1}</h3>

            <div>
              <label>Variation</label>
              <select
                value={order.subproduct}
                onChange={(e) => handleOrderChange(index, 'subproduct', e.target.value)}
                required
              >
                <option value="">- Select -</option>
                {bannerSubproducts.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div>
                <label>Width (ft)</label>
                <input
                  type="number"
                  value={order.width}
                  onChange={(e) => handleOrderChange(index, 'width', e.target.value)}
                  min={1}
                  required
                />
              </div>
              <div>
                <label>Height (ft)</label>
                <input
                  type="number"
                  value={order.height}
                  onChange={(e) => handleOrderChange(index, 'height', e.target.value)}
                  min={1}
                  required
                />
              </div>
            </div>

            <div>
              <label>Quantity</label>
              <input
                type="number"
                value={order.quantity}
                onChange={(e) => handleOrderChange(index, 'quantity', e.target.value)}
                min={1}
                required
              />
            </div>

            <div>
              <label>Top Eyelet</label>
              <select
                value={order.topEyelet}
                onChange={(e) => handleOrderChange(index, 'topEyelet', e.target.value)}
                required
              >
                <option value="">- Select -</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {order.topEyelet === 'Yes' && (
                <input
                  type="number"
                  placeholder="Top Eyelet Qty"
                  value={order.topEyeletQty}
                  onChange={(e) => handleOrderChange(index, 'topEyeletQty', e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <label>Bottom Eyelet</label>
              <select
                value={order.bottomEyelet}
                onChange={(e) => handleOrderChange(index, 'bottomEyelet', e.target.value)}
                required
              >
                <option value="">- Select -</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {order.bottomEyelet === 'Yes' && (
                <input
                  type="number"
                  placeholder="Bottom Eyelet Qty"
                  value={order.bottomEyeletQty}
                  onChange={(e) => handleOrderChange(index, 'bottomEyeletQty', e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div className="upload-artwork">
              <label>Upload Artwork</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
              />
            </div>

            <div>
              <label>Note</label>
              <textarea
                rows={3}
                placeholder="Optional remarks"
                value={order.note}
                onChange={(e) => handleOrderChange(index, 'note', e.target.value)}
              />
            </div>

            <hr className="divider" />
            {orders.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeOrder(index)}
              >
                Remove This Subproduct
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addNewOrder} className="btn-secondary">
          + Add Another Subproduct
        </button>


        <div className="button-group">
          <button
            type="submit"
            className="btn-secondary"
            onClick={() => setActionType('cart')}
          >
            Add to Cart
          </button>
        
        </div>
      </form>
    </div>
  );
};

export default Banner;
