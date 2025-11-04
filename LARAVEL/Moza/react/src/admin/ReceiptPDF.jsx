import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 280,
    height: 80,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  section: { marginBottom: 10 },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    borderBottomStyle: 'solid',
    paddingVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    marginTop: 5,
  },
  colNo: { width: '6%', textAlign: 'center' },
  colProduct: { width: '22%', paddingLeft: 5 },
  colSpecs: { width: '20%', paddingLeft: 5, flexDirection: 'column' },
  colSize: { width: '10%', textAlign: 'center' },
  colQty: { width: '8%', textAlign: 'center' },
  colPrice: { width: '12%', textAlign: 'right', paddingRight: 5 },
  colAmount: { width: '12%', textAlign: 'right', paddingRight: 5, fontWeight: 'bold' },
  specBullet: {
    marginBottom: 2,
  },
});

const formatKey = (key) =>
  key
    .replace(/Qty$/i, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

const OrderReceiptPDF = ({ orders, orderDate }) => {
  const user = orders.length > 0 ? orders[0].user || {} : {};
  const userTypeRaw = user.usertype || 'customer'; // default customer
  const userType = String(userTypeRaw).toLowerCase();

  // Calculate price per order and total
  const ordersWithAmount = orders.map(order => {
    let price = 0;

    if (userType === 'agent') {
      price = Number(order.agent_price ?? order.customer_price ?? 0);
    } else {
      price = Number(order.customer_price ?? 0);
    }

    const quantity = Number(order.quantity ?? 0);
    const amount = price * quantity;

    return { ...order, price, amount };
  });

  const totalAmount = ordersWithAmount.reduce((sum, o) => sum + o.amount, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/headerpdf.png" />
          <Text style={styles.headerText}>Moza Design Receipt</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text>Customer Name: {user.name || '-'}</Text>
          <Text>Email: {user.email || '-'}</Text>
          <Text>Phone: {user.phone_number || '-'}</Text>
          <Text>Order Date: {orderDate || '-'}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.colNo}>No.</Text>
          <Text style={styles.colProduct}>Product</Text>
          <Text style={styles.colSpecs}>Specs</Text>
          <Text style={styles.colSize}>Size</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Price (RM)</Text>
          <Text style={styles.colAmount}>Amount (RM)</Text>
        </View>

        {/* Table Rows */}
        {ordersWithAmount.map((order, index) => {
          let specs = order.product_specs;
          try {
            if (typeof specs === 'string') specs = JSON.parse(specs);
          } catch {
            specs = null;
          }

          const specsList =
            specs && typeof specs === 'object'
              ? Object.entries(specs)
                  .filter(([key, val]) => val !== null && val !== '' && !key.toLowerCase().includes('qty'))
                  .map(([key, val]) => {
                    const parts = String(val).split(',').map(s => s.trim());
                    return {
                      key: formatKey(key),
                      parts,
                    };
                  })
              : [];

          return (
            <View style={styles.tableRow} key={order.id || index}>
              <Text style={styles.colNo}>{index + 1}</Text>

              <Text style={styles.colProduct}>
                {order.product_type || 'Product'} {order.subproduct_name ? `(${order.subproduct_name})` : ''}
              </Text>

              <View style={styles.colSpecs}>
                {specsList.length > 0 ? (
                  specsList.map(({ key, parts }) => (
                    <View key={key} style={{ marginBottom: 2 }}>
                      <Text>{key}:</Text>
                      {parts.length > 1
                        ? parts.map((part, idx) => (
                            <Text key={idx} style={styles.specBullet}>
                              • {part}
                            </Text>
                          ))
                        : <Text style={styles.specBullet}>• {parts[0]}</Text>}
                    </View>
                  ))
                ) : (
                  <Text>N/A</Text>
                )}
              </View>

              <Text style={styles.colSize}>{order.size || '-'}</Text>
              <Text style={styles.colQty}>{order.quantity}</Text>
              <Text style={styles.colPrice}>{priceToFixed(order.price)}</Text>
              <Text style={styles.colAmount}>{priceToFixed(order.amount)}</Text>
            </View>
          );
        })}

        {/* Total Row */}
        <View style={styles.totalRow}>
          <Text style={[styles.colNo, { textAlign: 'left' }]}>Total</Text>
          {/* Empty columns for spacing */}
          <Text style={styles.colProduct}></Text>
          <Text style={styles.colSpecs}></Text>
          <Text style={styles.colSize}></Text>
          <Text style={styles.colQty}></Text>
          <Text style={styles.colPrice}></Text>
          <Text style={[styles.colAmount]}>{priceToFixed(totalAmount)}</Text>
        </View>
      </Page>
    </Document>
  );
};

const priceToFixed = (value) => {
  const num = Number(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default OrderReceiptPDF;
