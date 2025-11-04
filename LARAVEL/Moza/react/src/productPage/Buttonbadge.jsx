// ProductForm.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import './Form.css';

const ProductForm = ({ productId, productName }) => {
  const [orders, setOrders] = useState([
    { subproduct: '', size: '', quantity: 20, note: '', artwork: null }
  ]);

  const [subproducts, setSubproducts] = useState([]);
  const [sizes, setSizes] = useState({}); // key: row index, value: array of sizes {id, size}
  const [actionType, setActionType] = useState('cart');

  // Fetch subproducts for "Button Badge" product
  useEffect(() => {
    const fetchBadgeSubproducts = async () => {
      try {
        const productsRes = await axios.get('http://localhost:8000/api/products');
        const badgeProduct = productsRes.data.find(
          (p) => p.name === 'Button Badge'
        );

        if (badgeProduct) {
          const subproductsRes = await axios.get(
            `http://localhost:8000/api/products/${badgeProduct.id}/subproducts`
          );
          setSubproducts(subproductsRes.data);
        } else {
          console.warn('No product found with name "Button Badge".');
        }
      } catch (error) {
        console.error('❌ Error fetching subproducts:', error);
      }
    };

    fetchBadgeSubproducts();
  }, []);

  // Fetch available sizes for a subproduct for specific row
  const fetchSizes = async (subproductId, rowIndex) => {
    if (!subproductId) {
      console.warn("fetchSizes called without subproductId");
      return;
    }
    try {
      console.log(`Fetching sizes for subproductId=${subproductId} row=${rowIndex}`);
      const res = await axios.get(
        `http://localhost:8000/api/subproducts/${subproductId}/sizes`
      );
      console.log(`Sizes for row ${rowIndex} :`, res.data);
      setSizes((prev) => ({
        ...prev,
        [rowIndex]: res.data // expected format: [{id, size}, ...]
      }));
    } catch (err) {
      console.error('Error fetching sizes:', err);
    }
  };

  const handleOrderChange = (index, field, value) => {
    const newOrders = [...orders];
    newOrders[index][field] = value;

    if (field === 'subproduct') {
      console.log('Subproduct changed:', value);
      newOrders[index].size = ''; // reset size on subproduct change
      setOrders(newOrders);
      fetchSizes(value, index);
    } else {
      setOrders(newOrders);
    }
  };

  const handleFileChange = (index, file) => {
    const newOrders = [...orders];
    newOrders[index].artwork = file;
    setOrders(newOrders);
  };

  const addNewOrder = () => {
    setOrders([
      ...orders,
      { subproduct: '', size: '', quantity: 20, note: '', artwork: null } // default quantity 20
    ]);
  };

  const removeOrder = (index) => {
    if (orders.length === 1) return;
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


      // Validate quantities before submitting
  for (const [index, order] of orders.entries()) {
    if (!order.quantity || parseInt(order.quantity) < 20) {
      alert(`Quantity for item ${index + 1} must be at least 20.`);
      return; // Stop submission
    }
  }

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
        data.append('product_type', 'Button Badge');

        // Get subproduct name by ID
        const subproductName =
          subproducts.find(sp => sp.id.toString() === order.subproduct)?.name || '';
        data.append('subproduct', subproductName);

        // Get size string by ID for this order index
        const sizeName =
          sizes[index]?.find(sz => sz.id.toString() === order.size)?.size || '';
        data.append('size', sizeName);

        data.append('quantity', order.quantity);
        data.append('note', order.note);

        if (order.artwork) {
          data.append('artwork', order.artwork);
        }

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
        <h2 className="form-title">{productName || 'Button Badge'} Order Form</h2>
        <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>
          * Order is completed within 7 working days.
        </p>

        {orders.map((order, index) => (
          <div key={index} className="order-section">
            <h3 className="section-title">Item: {index + 1}</h3>

            {/* Subproduct */}
            <div>
              <label>Variation</label>
              <select
                value={order.subproduct}
                onChange={(e) =>
                  handleOrderChange(index, 'subproduct', e.target.value)
                }
                required
              >
                <option value="">- Select -</option>
                {subproducts.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div>
              <label>Size</label>
              <select
                value={order.size}
                onChange={(e) => handleOrderChange(index, 'size', e.target.value)}
                required
              >
                <option value="">- Select -</option>
                {(sizes[index] || []).map((sz) => (
                  <option key={sz.id} value={sz.id}>
                    {sz.size}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label>Quantity (min: 20)</label>
          <input
            type="number"
            min={20}
            value={order.quantity}
            onChange={(e) => handleOrderChange(index, 'quantity', e.target.value)}
            required
          />
            </div>

            {/* Artwork */}
            <div className="upload-artwork">
              <label>Upload Artwork</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(index, e.target.files[0])
                }
              />
            </div>

            {/* Note */}
            <div>
              <label>Note</label>
              <textarea
                rows={3}
                placeholder="Optional remarks"
                value={order.note}
                onChange={(e) =>
                  handleOrderChange(index, 'note', e.target.value)
                }
              />
            </div>

            <hr className="divider" />
            {orders.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeOrder(index)}
              >
                Remove This Item
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addNewOrder} className="btn-secondary">
          + Add Another Item
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

export default ProductForm;
