import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import './MyOrders.css';

const getFileType = (filePath) => {
  const ext = filePath.split('.').pop().toLowerCase();
  return ext === 'pdf' ? 'pdf' : 'image';
};

const handleDownload = (url, filename = 'file') => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
axios.get('http://127.0.0.1:8000/api/profile', {
  headers: { Authorization: `Bearer ${token}` },
})

      .then(res => setUser(res.data))
      .catch(err => console.error('Error fetching user:', err));

    axios.get('http://127.0.0.1:8000/api/user-orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  const groupedOrders = orders.reduce((groups, order) => {
    const timeKey = new Date(order.created_at).toISOString().slice(0, 16);
    if (!groups[timeKey]) groups[timeKey] = [];
    groups[timeKey].push(order);
    return groups;
  }, {});


  const downloadInvoice = async (group, timeKey) => {
  const orderDate = new Date(group[0].created_at).toLocaleString(); // first order date
  const blob = await pdf(
    <InvoicePDF orders={group} user={user} orderDate={orderDate} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  handleDownload(url, `invoice-${timeKey}.pdf`);
  URL.revokeObjectURL(url);
};


  return (
    <div className="order-container">
      <h2>Your Orders</h2>

      {previewImage && (
        <div className="preview-modal">
          <div className="preview-content">
            <button className="close-button" onClick={() => setPreviewImage(null)}>
              &times;
            </button>
            {getFileType(previewImage) === 'pdf' ? (
              <iframe src={previewImage} title="PDF Preview" width="100%" height="600px" />
            ) : (
              <img src={previewImage} alt="Artwork Preview" className="preview-full" />
            )}
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Subproduct</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Specs</th>
              <th>Note</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Artwork</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedOrders).map(([timeKey, group]) => (
              <React.Fragment key={timeKey}>
                {group.map((order, i) => {
                  let specs = order.product_specs;
                  try {
                    if (typeof specs === 'string') specs = JSON.parse(specs);
                  } catch {
                    specs = null;
                  }

                  const fileUrl = `http://localhost:8000/storage/${order.artwork_path}`;
                  const specsEntries = specs && typeof specs === 'object'
                    ? Object.entries(specs).filter(
                        ([, value]) => value !== null && value !== ''
                      )
                    : [];

                  return (
                    <tr key={order.id}>
                      <td>{i + 1}</td>
                      <td>{order.subproduct_name}</td>
                      <td>{order.size}</td>
                      <td>{order.quantity}</td>
                      <td>
                        {specsEntries.length > 0 ? (
                          <ul className="specs-list">
                            {specsEntries.map(([key, val]) => (
                              <li key={key}><strong>{key}:</strong> {val}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td>{order.note}</td>
                      <td>
                        <span className={`payment ${order.payment_status?.toLowerCase() || ''}`}>
                          {order.payment_status || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${order.order_status?.toLowerCase() || ''}`}>
                          {order.order_status || '-'}
                        </span>
                      </td>
                      <td>
                        {order.artwork_path ? (
                          getFileType(order.artwork_path) === 'pdf' ? (
                            <button onClick={() => handleDownload(fileUrl, 'artwork.pdf')}>
                              Download PDF
                            </button>
                          ) : (
                            <div className="upload-cell">
                              <img
                                src={fileUrl}
                                alt="Artwork Thumbnail"
                                className="thumbnail"
                                onClick={() => setPreviewImage(fileUrl)}
                              />
                              <button onClick={() => handleDownload(fileUrl, 'artwork.jpg')}>
                                Download
                              </button>
                            </div>
                          )
                        ) : (
                          'No artwork'
                        )}
                      </td>
                      {i === 0 && (
                        <td rowSpan={group.length}>
                          <button onClick={() => downloadInvoice(group, timeKey)}>Download</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
