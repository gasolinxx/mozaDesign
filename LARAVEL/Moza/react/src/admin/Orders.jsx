import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import ReceiptPDF from './ReceiptPDF'; // Your PDF invoice component
import './Orders.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Receipt modal state
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [editableOrders, setEditableOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleEdit = (order) => {
    let paymentStatus = order.payment_status || 'unpaid';
    let depositAmount = '';

    const depositMatch = paymentStatus.match(/Deposit\s*\(RM\s*(\d+(\.\d+)?)\)/i);
    if (depositMatch) {
      paymentStatus = 'deposit';
      depositAmount = depositMatch[1];
    }

    setEditingId(order.id);
    setEditData({
      order_status: order.order_status || 'pending',
      payment_status: paymentStatus,
      deposit_amount: depositAmount,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async (id) => {
    try {
      let payload = { ...editData };

      if (payload.payment_status === 'deposit' && payload.deposit_amount) {
        payload.payment_status = `Deposit (RM ${payload.deposit_amount})`;
        delete payload.deposit_amount;
      }

      await axios.put(`http://127.0.0.1:8000/api/admin/orders/${id}`, payload);
      setEditingId(null);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const basePaymentStatus = (status) => {
    if (!status) return 'unpaid';
    const s = status.toLowerCase();
    if (s.startsWith('deposit')) return 'deposit';
    if (s === 'paid') return 'paid';
    if (s === 'unpaid') return 'unpaid';
    if (s === 'l/o' || s === 'lo') return 'lo';
    return 'unknown';
  };

  // Normalize and initialize editable orders with price logic and amounts
  const initEditableOrders = (data) => {
    let specs = data.product_specs;
    try {
      if (typeof specs === 'string') specs = JSON.parse(specs);
    } catch {
      specs = null;
    }

    const userType = (data.usertype || data.user?.usertype || 'customer').toLowerCase();

    // Payment status lower for checking
    const paymentStatus = (data.payment_status || '').toLowerCase();

    // Price priority logic:
    // 1) agent/customer price by userType
    // 2) fallback to price_lo if payment status is 'lo' or 'l/o'
    let price = 0;
    if (paymentStatus === 'lo' || paymentStatus === 'l/o') {
      price = data.price_lo ?? 0;
    } else if (userType === 'agent') {
      price = data.agent_price ?? data.customer_price ?? 0;
    } else {
      price = data.customer_price ?? 0;
    }

    const quantity = data.quantity || 0;
    const amount = price * quantity;

    return {
      id: data.order_id || data.id,
      user: {
        name: data.user_name || data.user?.name || '-',
        email: data.user_email || data.user?.email || '-',
        phone_number: data.user_phone || data.user?.phone_number || '-',
        usertype: userType,
      },
      product_type: data.product_type || '-',
      subproduct_name: data.subproduct_name || '',
      product_specs: specs,
      size: data.size || '-',
      quantity,
      order_status: data.order_status || '-',
      payment_status: data.payment_status || '-',
      artwork_path: data.artwork_path || '',
      order_date: data.order_date || data.created_at || '-',
      price,
      amount,
    };
  };

  // When you open receipt modal, load receipt data and init editableOrders
  const handleDownloadReceipt = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/orders/${orderId}/receipt-data`);
      setReceiptData(res.data);
      // Initialize editable orders array with one order here
      const editableOrder = initEditableOrders(res.data);
      setEditableOrders([editableOrder]);
      setReceiptModalOpen(true);
    } catch (err) {
      console.error('Error fetching receipt data:', err);
      alert('Failed to load receipt data');
    }
  };

  // Handler to update editable price or quantity for a line item
  const handleEditableChange = (index, field, value) => {
    setEditableOrders((prev) => {
      const newOrders = [...prev];
      if (field === 'price' || field === 'quantity') {
        let numVal = Number(value);
        if (isNaN(numVal) || numVal < 0) numVal = 0;
        newOrders[index][field] = numVal;
        // Recalculate amount
        newOrders[index].amount = newOrders[index].price * newOrders[index].quantity;
      }
      return newOrders;
    });
  };

  // Save updated price & quantity to backend API
  const handleSaveReceiptChanges = async () => {
    if (!editableOrders.length) return;
    try {
      const editedOrder = editableOrders[0];
      const payload = {
        quantity: editedOrder.quantity,
        price: editedOrder.price,
      };
      // Adjust API endpoint & payload keys to match your backend
      await axios.put(`http://localhost:8000/api/admin/orders/${editedOrder.id}/update-price-qty`, payload);
      alert('Receipt price and quantity updated successfully.');
      setReceiptModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Failed to save receipt changes:', error);
      alert('Failed to save changes.');
    }
  };

  // Calculate total for editable orders
  const totalAmount = editableOrders.reduce((sum, o) => sum + o.amount, 0);

  // Generate PDF with editable orders data
  const handleDownloadPdfClientSide = async () => {
    if (!editableOrders.length) return;

    try {
      const pdfBlob = await pdf(
        <ReceiptPDF
          orders={editableOrders}
          user={editableOrders[0].user}
          orderDate={editableOrders[0].order_date}
        />
      ).toBlob();

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_order_${editableOrders[0].id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  const getFileType = (path) => {
    if (!path) return '';
    return path.split('.').pop().toLowerCase();
  };

  const closeModal = () => setPreviewImage(null);

  return (
    <div className="admin-orders">
      <h2>Admin - Manage Orders</h2>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>User</th>
              <th>Product</th>
              <th>Specs</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Artwork</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td
                    title={`Email: ${order.user?.email || 'N/A'}\nPhone: ${
                      order.user?.phone_number || 'N/A'
                    }`}
                  >
                    {order.user?.name || 'Unknown'}
                  </td>
                  <td>
                    {order.product_type ? order.product_type : 'Product'}{' '}
                    {order.subproduct_name ? `(${order.subproduct_name})` : ''}
                  </td>

                  <td>
                    {(() => {
                      let specs = order.product_specs;
                      try {
                        if (typeof specs === 'string') specs = JSON.parse(specs);
                      } catch {
                        specs = null;
                      }
                      if (!specs || typeof specs !== 'object') return '—';

                      const formatKey = (key) => {
                        return key
                          .replace(/Qty$/i, '')
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim();
                      };

                      const filteredSpecs = Object.entries(specs).filter(
                        ([_, val]) => val !== null && val !== ''
                      );

                      return (
                        <ul className="specs-list">
                          {filteredSpecs.map(([key, val]) => {
                            if (key.toLowerCase().includes('qty')) return null;
                            const qtyKey = key + 'Qty';
                            const quantity = specs[qtyKey];
                            const displayQty = quantity ? ` (${quantity})` : '';

                            return (
                              <li key={key}>
                                <strong>{formatKey(key)}:</strong> {val}
                                {displayQty}
                              </li>
                            );
                          })}
                        </ul>
                      );
                    })()}
                  </td>

                  <td>{order.size || '—'}</td>
                  <td>{order.quantity}</td>
                  <td>
                    {editingId === order.id ? (
                      <select
                        name="order_status"
                        value={editData.order_status}
                        onChange={handleChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`status ${order.order_status}`}>{order.order_status}</span>
                    )}
                  </td>
                  <td>
                    {editingId === order.id ? (
                      <>
                        <select
                          name="payment_status"
                          value={editData.payment_status}
                          onChange={handleChange}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="deposit">Deposit</option>
                          <option value="paid">Paid</option>
                          <option value="lo">L/O</option>
                        </select>
                        {editData.payment_status === 'deposit' && (
                          <input
                            type="number"
                            name="deposit_amount"
                            value={editData.deposit_amount}
                            onChange={handleChange}
                            placeholder="Enter deposit amount"
                            min="0"
                            style={{ marginTop: '5px', width: '100%' }}
                          />
                        )}
                      </>
                    ) : (
                      <span className={`payment ${basePaymentStatus(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    )}
                  </td>
                  <td>
                    {order.artwork_path ? (
                      getFileType(order.artwork_path) === 'pdf' ? (
                        <a
                          href={`http://localhost:8000/storage/${order.artwork_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="download-link"
                        >
                          PDF
                        </a>
                      ) : (
                        <div className="upload-cell">
                          <img
                            src={`http://localhost:8000/storage/${order.artwork_path}`}
                            alt="Artwork"
                            className="thumbnail"
                            onClick={() =>
                              setPreviewImage(`http://localhost:8000/storage/${order.artwork_path}`)
                            }
                          />
                          <a
                            href={`http://localhost:8000/storage/${order.artwork_path}`}
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
                  <td>
                    {editingId === order.id ? (
                      <button className="btn-save" onClick={() => handleUpdate(order.id)}>
                        Save
                      </button>
                    ) : (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(order)}>
                          Edit
                        </button>
                        {order.order_status === 'completed' && (
                          <button
                            className="btn-download"
                            style={{ marginLeft: '8px' }}
                            onClick={() => handleDownloadReceipt(order.id)}
                          >
                            Download Receipt
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}

      {/* PDF Receipt Modal with editable fields */}
      {receiptModalOpen && receiptData && (
        <div className="modal" onClick={() => setReceiptModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', height: '90vh', padding: 20, overflowY: 'auto' }}
          >
            <h3>Receipt Preview - Order #{editableOrders[0]?.id}</h3>

            {/* Editable form table */}
            <table style={{ width: '100%', marginBottom: 20, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Product</th>
                  <th>Specs</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price (RM)</th>
                  <th>Amount (RM)</th>
                </tr>
              </thead>
              <tbody>
                {editableOrders.map((order, idx) => {
                  let specs = order.product_specs;
                  try {
                    if (typeof specs === 'string') specs = JSON.parse(specs);
                  } catch {
                    specs = null;
                  }

                  const specsText = specs
                    ? Object.entries(specs)
                        .filter(([k, v]) => v && !k.toLowerCase().includes('qty'))
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(', ')
                    : '-';

                  return (
                    <tr key={order.id || idx} style={{ borderBottom: '1px solid #ccc' }}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td>
                        {order.product_type} {order.subproduct_name ? `(${order.subproduct_name})` : ''}
                      </td>
                      <td>{specsText}</td>
                      <td style={{ textAlign: 'center' }}>{order.size}</td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          value={order.quantity}
                          onChange={(e) => handleEditableChange(idx, 'quantity', e.target.value)}
                          style={{ width: 60 }}
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={order.price}
                          onChange={(e) => handleEditableChange(idx, 'price', e.target.value)}
                          style={{ width: 80, textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        {order.amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Total:
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* PDF Preview */}
            <PDFViewer style={{ width: '100%', height: '60vh' }}>
              <ReceiptPDF orders={editableOrders} user={editableOrders[0].user} orderDate={editableOrders[0].order_date} />
            </PDFViewer>

            <div style={{ marginTop: 10, textAlign: 'right' }}>
              <button onClick={() => setReceiptModalOpen(false)} style={{ marginRight: 10 }}>
                Close
              </button>
              <button onClick={handleSaveReceiptChanges} style={{ marginRight: 10 }}>
                Save Changes
              </button>
              <button onClick={handleDownloadPdfClientSide}>Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
