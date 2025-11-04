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
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },

  header: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 280, height: 80, marginBottom: 20 },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  section: { 
    marginBottom: 20, // bigger gap after customer info block
  },

  customerInfoText: {
    marginBottom: 4, // gap between each line in customer info
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    marginBottom: 10, // added gap below header
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    borderBottomStyle: 'solid',
    paddingVertical: 4,
  },

  colBil: { width: '8%', textAlign: 'center' },
  colItem: { width: '32%', paddingLeft: 5 },
  colSize: { width: '20%', textAlign: 'center' },
  colQty: { width: '12%', textAlign: 'center' },
  colSpec: { width: '28%', paddingLeft: 5, flexDirection: 'column' }, // to allow multiple lines vertically
  specBullet: {
    marginBottom: 2,
  },
});

const InvoicePDF = ({ orders, user, orderDate }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/headerpdf.png" />
          <Text style={styles.headerText}>Moza Design Invoice</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.customerInfoText}>Customer Name: {user?.name || '-'}</Text>
          <Text style={styles.customerInfoText}>Email: {user?.email || '-'}</Text>
          <Text style={styles.customerInfoText}>Phone: {user?.phone_number || '-'}</Text>
          <Text style={styles.customerInfoText}>Order Date: {orderDate || '-'}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.colBil}>No.</Text>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colSize}>Size</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colSpec}>Spec</Text>
        </View>

        {/* Table Rows */}
        {orders.map((order, index) => {
          let specs = order.product_specs;
          try {
            if (typeof specs === 'string') specs = JSON.parse(specs);
          } catch {
            specs = null;
          }

          return (
            <View style={styles.tableRow} key={order.id}>
              <Text style={styles.colBil}>{index + 1}</Text>
              <Text style={styles.colItem}>{order.subproduct_name}</Text>
              <Text style={styles.colSize}>{order.size}</Text>
              <Text style={styles.colQty}>{order.quantity}</Text>

              {/* Spec column with bullet list */}
              <View style={styles.colSpec}>
                {specs && typeof specs === 'object' ? (
                  Object.entries(specs).map(([key, val]) => {
                    // split val by comma and trim each part
                    const parts = String(val).split(',').map(s => s.trim());
                    return (
                      <View key={key} style={{ marginBottom: 4 }}>
                        <Text>
                          <Text>{key}: </Text>
                        </Text>
                        {parts.length > 1 ? (
                          parts.map((part, idx) => (
                            <Text key={idx} style={styles.specBullet}>
                              • {part}
                            </Text>
                          ))
                        ) : (
                          <Text style={styles.specBullet}>• {val}</Text>
                        )}
                      </View>
                    );
                  })
                ) : (
                  <Text>N/A</Text>
                )}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
