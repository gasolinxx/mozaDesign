import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

const Bunting = () => {
  const [orders, setOrders] = useState([
    {
      subproduct: '',
      unit: '',
      size: '',
      width: '',
      height: '',
      quantity: '',
      deliveryAddress: '',
      pipe: '',
      topPipe: '',
      bottomPipe: '',
      artwork: null,
      note: ''
    }
  ]);

  const [buntingSubproducts, setBuntingSubproducts] = useState([]);
  const [actionType, setActionType] = useState('cart');

  useEffect(() => {
    const fetchBuntingSubproducts = async () => {
      try {
        const productsRes = await axios.get('http://localhost:8000/api/products');
        const buntingProduct = productsRes.data.find(p => p.name === 'Bunting');

        if (buntingProduct) {
          const subproductsRes = await axios.get(
            `http://localhost:8000/api/products/${buntingProduct.id}/subproducts`
          );
          setBuntingSubproducts(subproductsRes.data);
        } else {
          console.warn('No product found with name "Bunting".');
        }
      } catch (error) {
        console.error('❌ Error fetching subproducts:', error);
      }
    };

    fetchBuntingSubproducts();
  }, []);

  const handleOrderChange = (index, field, value) => {
    const newOrders = [...orders];
    newOrders[index][field] = value;

    // Clear topPipe and bottomPipe if pipe is not "With Pipe"
    if (field === 'pipe' && value !== 'With Pipe') {
      newOrders[index].topPipe = '';
      newOrders[index].bottomPipe = '';
    }

    setOrders(newOrders);
  };

  const handleSubproductChange = (index, subName) => {
    const selectedSub = buntingSubproducts.find(s => s.name === subName);
    const newOrders = [...orders];
    newOrders[index].subproduct = subName;
    newOrders[index].unit = selectedSub?.unit || '';
    newOrders[index].size = '';
    newOrders[index].width = '';
    newOrders[index].height = '';
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
        unit: '',
        size: '',
        width: '',
        height: '',
        quantity: '',
        deliveryAddress: '',
        pipe: '',
        topPipe: '',
        bottomPipe: '',
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

    const endpoint =
      actionType === 'cart'
        ? 'http://localhost:8000/api/cart/add'
        : 'http://localhost:8000/api/orders/submit';

    try {
      for (const [index, order] of orders.entries()) {
        const data = new FormData();
        data.append('product_type', 'Bunting');
        data.append('subproduct', order.subproduct);
        data.append('size', `${order.width}x${order.height} ft`);
        data.append('quantity', order.quantity);
        data.append('note', order.note);

        // Append artwork only if exists
        if (order.artwork) {
          data.append('artwork', order.artwork);
        }

        const productSpecs = {
          pipe: order.pipe,
          topPipe: order.pipe === 'With Pipe' ? order.topPipe : '',
          bottomPipe: order.pipe === 'With Pipe' ? order.bottomPipe : ''
        };
        data.append('product_specs', JSON.stringify(productSpecs));

        const response = await axios.post(endpoint, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        console.log(`✅ Item ${index + 1} submitted:`, response.data);
      }

      alert(
        actionType === 'cart'
          ? 'All items added to cart!'
          : 'Order submitted successfully!'
      );
    } catch (err) {
      console.error('❌ Submission failed:', err);
      if (err.response) {
        alert(`Submission failed: ${err.response.data.message || 'Server Error'}`);
      } else {
        alert(`Submission failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="banner-form">
        <h2 className="form-title">Bunting Order Form</h2>

        {orders.map((order, index) => (
          <div key={index} className="order-section">
            <h3 className="section-title">Item: {index + 1}</h3>

            <div>
              <label>Variation</label>
              <select
                value={order.subproduct}
                onChange={(e) => handleSubproductChange(index, e.target.value)}
                required
              >
                <option value="">- Select -</option>
                {buntingSubproducts.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
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
              <label>Pipe</label>
              <select
                value={order.pipe}
                onChange={(e) => handleOrderChange(index, 'pipe', e.target.value)}
              >
                <option value="">- Select -</option>
                <option value="With Pipe">With Pipe</option>
                <option value="Without Pipe">Without Pipe</option>
              </select>
            </div>

            {/* Conditionally render Top Pipe and Bottom Pipe inputs */}
            {order.pipe === 'With Pipe' && (
              <>
                <div>
                  <label>Top Pipe</label>
                  <input
                    type="text"
                    value={order.topPipe}
                    onChange={(e) => handleOrderChange(index, 'topPipe', e.target.value)}
                  />
                </div>

                <div>
                  <label>Bottom Pipe (Additional Charge)</label>
                  <input
                    type="text"
                    value={order.bottomPipe}
                    onChange={(e) => handleOrderChange(index, 'bottomPipe', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="upload-artwork">
              <label>Upload Artwork</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                // removed required to make artwork optional
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

export default Bunting;
