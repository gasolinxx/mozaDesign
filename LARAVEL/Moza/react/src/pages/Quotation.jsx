import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './Quotation.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotationPDF from './QuotationPDF';

const currentUser = {
  usertype: 'agent',
};

const Quotation = () => {
  const [customer, setCustomer] = useState({ name: '', address: '' });
  const [subproducts, setSubproducts] = useState([]);
  const [items, setItems] = useState([
    {
      subproduct_id: '',
      variant: null,
      quantity: '',
      payment_type: '',
      size: { width: '', height: '', unit: '' },
      price: 0,
      searchTerm: '',
      dropdownOpen: false,
      visibleCount: 10,
    },
  ]);

  // Fetch subproducts
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/subproducts')
      .then((res) => res.json())
      .then((data) => setSubproducts(data))
      .catch((err) => console.error('Error fetching subproducts:', err));
  }, []);

  // Fetch variant for selected subproduct
  const fetchVariants = (subproductId, index) => {
    fetch(`http://127.0.0.1:8000/api/product-variants/by-subproduct/${subproductId}`)
      .then((res) => res.json())
      .then((data) => {
        const variant = data[0] || null;
        const newItems = [...items];
        const sub = subproducts.find((sp) => sp.id === parseInt(subproductId));

        newItems[index].variant = variant;

        // unit comes from subproduct.product.unit if available, otherwise from variant
        newItems[index].size.unit = sub?.product?.unit || variant?.unit || '';

        updatePrice(newItems[index]);
        setItems(newItems);
      })
      .catch((err) => console.error('Error fetching variants:', err));
  };

  const updatePrice = (item) => {
    if (!item.variant || !item.payment_type) return;

    const qty = parseFloat(item.quantity) || 0;
    const width = parseFloat(item.size.width) || 0;
    const height = parseFloat(item.size.height) || 0;
    const unit = item.size.unit; // ✅ use from size.unit

    let basePrice = 0;
    if (item.payment_type === 'lo') basePrice = parseFloat(item.variant.price_lo);
    if (item.payment_type === 'customer') basePrice = parseFloat(item.variant.customer_price);
    if (item.payment_type === 'agent') basePrice = parseFloat(item.variant.agent_price);

    item.price = unit === 'sqft' ? qty * width * height * basePrice : qty * basePrice;
  };

  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (index, field, value, subfield = null) => {
    const newItems = [...items];

    if (field === 'subproduct_id') {
      newItems[index].subproduct_id = value;
      fetchVariants(value, index);
    } else if (subfield) {
      newItems[index][field][subfield] = value;
    } else {
      newItems[index][field] = value;
    }

    updatePrice(newItems[index]);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        subproduct_id: '',
        variant: null,
        quantity: '',
        payment_type: '',
        size: { width: '', height: '', unit: '' },
        price: 0,
        searchTerm: '',
        dropdownOpen: false,
        visibleCount: 10,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div className="quotation-container">
      <h2 className="quotation-title">
        Dapatkan Quotation anda segera dengan isi maklumat di bawah:
      </h2>

      {/* Customer Info */}
      <div className="form-group">
        <label>Bill to:</label>
        <input
          type="text"
          placeholder="Nama pelanggan"
          className="input-full"
          value={customer.name}
          onChange={(e) => handleCustomerChange('name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Alamat"
          className="input-full"
          value={customer.address}
          onChange={(e) => handleCustomerChange('address', e.target.value)}
        />
      </div>

      {/* Quotation Items */}
      {items.map((item, index) => {
        const selectedSubproduct = subproducts.find((sp) => sp.id === parseInt(item.subproduct_id));
        const showSize = item.size.unit === 'sqft'; // ✅ now checks product.unit or variant.unit

        return (
          <div key={index} className="product-item">
            <div className="item-header">
              <label>Produk:</label>
              {items.length > 1 && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeItem(index)}
                  title="Padam item"
                >
                  🗑
                </button>
              )}
            </div>

            {/* Custom Dropdown */}
            <div className="custom-dropdown" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search subproduct..."
                className="input-full"
                value={
                  item.subproduct_id
                    ? `${selectedSubproduct?.product?.name || ''} (${selectedSubproduct?.name || ''})`
                    : item.searchTerm
                }
                onFocus={() => {
                  const newItems = [...items];
                  newItems[index].dropdownOpen = true;
                  newItems[index].visibleCount = 10;
                  setItems(newItems);
                }}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].searchTerm = e.target.value;
                  newItems[index].subproduct_id = '';
                  setItems(newItems);
                }}
              />

              {item.dropdownOpen && (
                <ul
                  className="dropdown-list-scrollable"
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    position: 'absolute',
                    width: '100%',
                    zIndex: 10,
                  }}
                >
                  {(item.searchTerm
                    ? subproducts.filter((sp) =>
                        `${sp.product?.name || ''} ${sp.name}`
                          .toLowerCase()
                          .includes(item.searchTerm.toLowerCase())
                      )
                    : subproducts
                  )
                    .slice(0, item.visibleCount)
                    .map((sp) => (
                      <li
                        key={sp.id}
                        onClick={() => {
                          const newItems = [...items];
                          newItems[index].subproduct_id = sp.id;
                          newItems[index].searchTerm = '';
                          newItems[index].dropdownOpen = false;
                          fetchVariants(sp.id, index);
                          setItems(newItems);
                        }}
                        style={{ padding: '8px', cursor: 'pointer' }}
                      >
                        {sp.product?.name} ({sp.name})
                      </li>
                    ))}

                  {item.searchTerm &&
                    subproducts.filter((sp) =>
                      `${sp.product?.name || ''} ${sp.name}`
                        .toLowerCase()
                        .includes(item.searchTerm.toLowerCase())
                    ).length === 0 && (
                      <li style={{ padding: '8px', color: '#888' }}>
                        Tiada hasil dijumpai
                      </li>
                    )}
                </ul>
              )}
            </div>

            {/* Payment Type */}
            <label>Pilihan Harga:</label>
            <select
              value={item.payment_type}
              onChange={(e) => handleChange(index, 'payment_type', e.target.value)}
              className="input-full"
            >
              <option value="">-- Pilih Harga --</option>
              <option value="lo">L/O</option>
              <option value="customer">Customer</option>
              {currentUser.usertype === 'agent' && <option value="agent">Agent</option>}
            </select>

            {/* Quantity & Size */}
            <div className="item-row">
              <label>Quantity:</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                className="input-small"
              />
              {showSize && (
                <>
                  <label>Size (W x H) in ft:</label>
                  <div className="size-inputs">
                    <input
                      type="number"
                      placeholder="Width (ft)"
                      value={item.size.width}
                      onChange={(e) => handleChange(index, 'size', e.target.value, 'width')}
                      className="input-small"
                    />
                    <span>x</span>
                    <input
                      type="number"
                      placeholder="Height (ft)"
                      value={item.size.height}
                      onChange={(e) => handleChange(index, 'size', e.target.value, 'height')}
                      className="input-small"
                    />
                    <span className="unit-display">ft</span>
                  </div>
                </>
              )}
            </div>

            <div className="item-price">💰 Harga: RM {item.price.toFixed(2)}</div>
          </div>
        );
      })}

      {/* Add Item Button */}
      <button onClick={addItem} className="add-button">
        + Tambah Item
      </button>

      {/* Download Quotation PDF */}
      {items.length > 0 && (
        <PDFDownloadLink
          document={
            <QuotationPDF
              customer={customer}
              items={items.map((item) => {
                const product = subproducts.find(
                  (sp) => parseInt(sp.id) === parseInt(item.subproduct_id)
                );
                return {
                  ...item,
                  product_name: `${product?.product?.name || ''} (${product?.name || ''})`,
                  size: {
                    width: item.size?.width || '-',
                    height: item.size?.height || '-',
                    unit: item.size?.unit || '',
                  },
                  price: item.price || 0,
                };
              })}
            />
          }
          fileName={`Quotation_${customer.name || 'Customer'}.pdf`}
          style={{ textDecoration: 'none', marginTop: '20px' }}
        >
          {({ loading }) =>
            loading ? (
              <button className="generate-button" disabled>
                Preparing PDF...
              </button>
            ) : (
              <button className="generate-button">Download Quotation</button>
            )
          }
        </PDFDownloadLink>
      )}

      {/* WhatsApp Support */}
      <div className="customer-service">
        <p>Anda perlukan bantuan pelanggan?</p>
        <a
          href="https://wa.me/60135345874"
          target="_blank"
          rel="noopener noreferrer"
          className="wasap-button"
        >
          <FaWhatsapp className="whatsapp-icon" />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Quotation;
