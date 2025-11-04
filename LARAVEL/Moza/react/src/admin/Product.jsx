import { useEffect, useState } from 'react';
import './Product.css';
import Records from './Records';

const Product = () => {
  const [tab, setTab] = useState('add');

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productId, setProductId] = useState('');

  const [subproducts, setSubproducts] = useState([]);
  const [subproductName, setSubproductName] = useState('');
  const [subproductImage, setSubproductImage] = useState(null);
  const [subproductId, setSubproductId] = useState('');

  const [variantData, setVariantData] = useState({
    material: '',
    size: '',
    color: '',
    type: '',
    printing_side: '',
    price_lo: '',
    agent_price: '',
    customer_price: '',
    unit: '',
    notes: '',
  });

  const [records, setRecords] = useState([]);

  // Reusable fetch wrapper to handle JSON and HTML error responses gracefully
  const safeFetchJson = async (url, options = {}) => {
    try {
      options.headers = {
        ...(options.headers || {}),
        'Accept': 'application/json',
      };

      const res = await fetch(url, options);
      const text = await res.text();

      if (!res.ok) {
        let errorMsg = text;
        try {
          const data = JSON.parse(text);
          errorMsg = data.message || JSON.stringify(data);
        } catch {
          // Keep errorMsg as raw text if not JSON
        }
        throw new Error(`HTTP ${res.status}: ${errorMsg}`);
      }

      return JSON.parse(text);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
    fetchAllSubproducts();
    fetchRecords();
  }, []);

  useEffect(() => {
    if (categoryId) fetchProducts(categoryId);
  }, [categoryId]);

  useEffect(() => {
    if (tab === 'spec') fetchAllProducts();
  }, [tab]);

  const fetchCategories = async () => {
    try {
      const data = await safeFetchJson('http://127.0.0.1:8000/api/categories');
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      alert("❌ Failed to fetch categories: " + error.message);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const data = await safeFetchJson('http://127.0.0.1:8000/api/products');
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      alert("❌ Failed to fetch products: " + error.message);
    }
  };

  const fetchProducts = async (catId) => {
    try {
      const data = await safeFetchJson(`http://127.0.0.1:8000/api/categories/${catId}/products`);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products for category:", error);
      alert("❌ Failed to fetch products: " + error.message);
    }
  };

  const fetchAllSubproducts = async () => {
    try {
      const data = await safeFetchJson("http://127.0.0.1:8000/api/subproducts");
      setSubproducts(data);
    } catch (error) {
      console.error("❌ Failed to fetch subproducts:", error);
      alert("❌ Failed to fetch subproducts: " + error.message);
    }
  };

 const fetchRecords = async () => {
  try {
    const data = await safeFetchJson('http://127.0.0.1:8000/api/product-records');
    setRecords(data);
  } catch (error) {
    console.error("❌ Failed to fetch records:", error);
    alert("❌ Failed to fetch records: " + error.message);
  }
};


  const handleAddCategory = async () => {
    try {
      const data = await safeFetchJson('http://127.0.0.1:8000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      });
      alert("✅ Category added successfully");
      setCategoryName('');
      fetchCategories();
    } catch (error) {
      alert("❌ Error adding category: " + error.message);
    }
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('category_id', categoryId);
      if (productImage) formData.append('image', productImage);

      // Note: Don't set Content-Type header when sending FormData; browser does it automatically
      const res = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }, // Request JSON response
      });

      const text = await res.text();
      if (!res.ok) {
        let errMsg = text;
        try {
          const data = JSON.parse(text);
          errMsg = data.message || JSON.stringify(data);
        } catch {}
        throw new Error(`HTTP ${res.status}: ${errMsg}`);
      }

      alert("✅ Product added successfully");
      setProductName('');
      setProductImage(null);
      fetchProducts(categoryId);
      fetchAllProducts();

    } catch (error) {
      alert("❌ Error adding product: " + error.message);
    }
  };

  const handleAddSubproduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', subproductName);
      formData.append('product_id', productId);
      if (subproductImage) formData.append('image', subproductImage);

      const res = await fetch('http://127.0.0.1:8000/api/subproducts', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      const text = await res.text();
      if (!res.ok) {
        let errMsg = text;
        try {
          const data = JSON.parse(text);
          errMsg = data.message || JSON.stringify(data);
        } catch {}
        throw new Error(`HTTP ${res.status}: ${errMsg}`);
      }

      alert("✅ Subproduct added successfully");
      setSubproductName('');
      setSubproductImage(null);
      fetchAllSubproducts();

      // Reset file input manually (if needed)
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      alert("❌ Error adding subproduct: " + error.message);
      console.error("Add subproduct error:", error);
    }
  };

  const handleAddVariant = async () => {
    if (!subproductId) return alert("Please select a subproduct.");

    const payload = {
      subproduct_id: subproductId,
      material: variantData.material,
      size: variantData.size,
      color: variantData.color,
      type: variantData.type,
      printing_side: variantData.printing_side,
      price_lo: variantData.price_lo,
      agent_price: variantData.agent_price,
      customer_price: variantData.customer_price,
      unit: variantData.unit,
      notes: variantData.notes,
    };

    try {
      const data = await safeFetchJson("http://127.0.0.1:8000/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("✅ Variant added successfully!");
      setVariantData({
        material: '',
        size: '',
        color: '',
        type: '',
        printing_side: '',
        price_lo: '',
        agent_price: '',
        customer_price: '',
        unit: '',
        notes: '',
      });
      fetchAllSubproducts();

    } catch (error) {
      alert("❌ Error adding variant: " + error.message);
    }
  };

  return (
    <div className="product-container">
      <div className="tab-buttons">
        {['add', 'spec', 'records'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-button ${tab === t ? 'active' : ''}`}
          >
            {t === 'add' && 'Add Product'}
            {t === 'spec' && 'Add Subproduct / Variant'}
            {t === 'records' && 'View Records'}
          </button>
        ))}
      </div>

      {tab === 'add' && (
        <div className="section">
          <h2>Add Category</h2>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="input"
          />
          <button onClick={handleAddCategory} className="btn yellow">
            Add Category
          </button>

          <h2>Add Product</h2>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="input"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input"
          />
          <input
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
            className="input"
          />
          <button onClick={handleAddProduct} className="btn yellow">
            Add Product
          </button>
        </div>
      )}

      {tab === 'spec' && (
        <div className="section">
          <h2>Add Subproduct</h2>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="input"
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.category ? `(${p.category.name})` : ''}
              </option>
            ))}
          </select>
          <input
            value={subproductName}
            onChange={(e) => setSubproductName(e.target.value)}
            className="input"
          />
          <input
            type="file"
            onChange={(e) => setSubproductImage(e.target.files[0])}
            className="input"
          />
          <button onClick={handleAddSubproduct} className="btn yellow">
            Add Subproduct
          </button>

          <h2>Add Variant</h2>
          <select
        value={subproductId}
        onChange={(e) => setSubproductId(e.target.value)}
        className="input"
      >
        <option value="">-- Select Subproduct --</option>
        {subproducts.map((s) => (
          <option key={s.id} value={s.id}>
            {s.product ? `${s.product.name} (${s.name})` : s.name}
          </option>
        ))}
      </select>


          {[
            'material',
            'size',
            'color',
            'type',
            'printing_side',
            'price_lo',
            'agent_price',
            'customer_price',
            'notes',
          ].map((field) => (
            <input
              key={field}
              name={field}
              value={variantData[field]}
              onChange={(e) =>
                setVariantData({ ...variantData, [field]: e.target.value })
              }
              placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              className="input"
            />
          ))}

          <select
            name="unit"
            value={variantData.unit}
            onChange={(e) => setVariantData({ ...variantData, unit: e.target.value })}
            className="input"
          >
            <option value="">-- Select Unit --</option>
            <option value="sqft">sqft</option>
            <option value="A3">A3</option>
            <option value="pcs">pcs</option>
            <option value="unit">unit</option>
          </select>

          <button onClick={handleAddVariant} className="btn yellow">
            Add Variant
          </button>
        </div>
      )}

      {tab === 'records' && (
        <div className="section">
          <Records records={records} />
        </div>
      )}
    </div>
  );
};

export default Product;
