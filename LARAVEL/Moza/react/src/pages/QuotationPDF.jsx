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
    alignItems: 'center',     // center horizontally
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
    textAlign: 'center',      // center text
    marginBottom: 10,
    margintop:20,
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
  tableFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    paddingVertical: 6,
    marginTop: 5,
  },
  colBil: { width: '10%', textAlign: 'center' },
  colItem: { width: '40%', paddingLeft: 5 },
  colSize: { width: '25%', textAlign: 'center' },
  colAmount: { width: '25%', textAlign: 'right', paddingRight: 5 },
});

const QuotationPDF = ({ customer, items }) => {
  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="/headerpdf.png" />
          <Text style={styles.headerText}>Moza Design Quotation</Text>
        </View>

        <View style={styles.section}>
          <Text>Customer: {customer.name || '-'}</Text>
          <Text>Address: {customer.address || '-'}</Text>
        </View>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={styles.colBil}>Bil</Text>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colSize}>Size (W x H)</Text>
          <Text style={styles.colAmount}>Amount (RM)</Text>
        </View>

        {/* Table rows */}
        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.colBil}>{index + 1}</Text>
            <Text style={styles.colItem}>{item.product_name || '-'}</Text>
            <Text style={styles.colSize}>
              {item.size.width || '-'} x {item.size.height || '-'} {item.size.unit || ''}
            </Text>
            <Text style={styles.colAmount}>
              {item.price ? item.price.toFixed(2) : '0.00'}
            </Text>
          </View>
        ))}

        {/* Total row */}
        <View style={styles.tableFooter}>
          <Text style={styles.colBil}></Text>
          <Text style={styles.colItem}></Text>
          <Text style={[styles.colSize, { fontWeight: 'bold' }]}>Total</Text>
          <Text style={[styles.colAmount, { fontWeight: 'bold' }]}>
            RM {totalAmount.toFixed(2)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotationPDF;
