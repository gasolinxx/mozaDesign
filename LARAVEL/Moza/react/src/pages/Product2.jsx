import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Product2.css';

const Product2 = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const productRefs = useRef({});
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const highlight = params.get('highlight')?.toLowerCase();
  const categoryFromUrl = params.get('category');

  const promoImages = [
    '/promosi/slider1.jpg',
    '/promosi/promo2.jpg',
    '/promosi/promo3.jpg',
    '/promosi/promo4.jpg'
  ];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories')
      .then(res => {
        setCategories(res.data);
        fetchProducts(res.data);
      })
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  const fetchProducts = (categoryList) => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(res => {
        const products = res.data;
        const grouped = {};

        categoryList.forEach(cat => {
          grouped[cat.name] = products.filter(p => p.category_id === cat.id);
        });

        const uncategorized = products.filter(p => !p.category_id);
        if (uncategorized.length) grouped['Lain-lain'] = uncategorized;

        setProductsByCategory(grouped);
      })
      .catch(err => console.error('Failed to load products', err));
  };

  const handleOrderClick = (product, subproduct) => {
    if (!product || !subproduct) return;

    const lower = product.name.toLowerCase();
    const path = `/orderform/${product.name.toLowerCase().replace(/\s/g, '')}/${subproduct.id}`;



    navigate(path, { state: { product, subproduct } });
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const nextPromo = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % promoImages.length);
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prev) => (prev - 1 + promoImages.length) % promoImages.length);
  };

  const allProducts = Object.values(productsByCategory).flat();

  const filteredProductList = allProducts.filter(product => {
    const productName = product.name?.toLowerCase() || '';
    const subNames = product.subproducts?.map(s => s.name.toLowerCase()) || [];
    return (
      productName.includes(searchTerm.toLowerCase()) ||
      subNames.some(sub => sub.includes(searchTerm.toLowerCase()))
    );
  });

  const displayedProducts = selectedCategory
    ? (productsByCategory[selectedCategory] || []).filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.subproducts || []).some(sub =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : filteredProductList;

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    if (highlight) {
      const keywords = highlight.split('&').map(s => s.trim().toLowerCase());
      const matchedKey = Object.keys(productRefs.current).find(key =>
        keywords.some(k => key.includes(k))
      );
      if (matchedKey && productRefs.current[matchedKey]) {
        productRefs.current[matchedKey].scrollIntoView({ behavior: 'smooth', block: 'center' });
        productRefs.current[matchedKey].classList.add('highlighted-product');
      }
    }
  }, [productsByCategory, highlight]);

  return (
    <div className="product2-container">
      {/* Promo Slider */}
      <div className="promo-slider">
        <button className="arrow left" onClick={prevPromo}>&#10094;</button>
        <img
          src={promoImages[currentPromoIndex]}
          alt={`Promo ${currentPromoIndex + 1}`}
          className="promo-image"
        />
        <button className="arrow right" onClick={nextPromo}>&#10095;</button>
      </div>

      <div className="promosi-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2
            className="kategori-reset"
            onClick={() => {
              setSelectedCategory(null);
            }}
            style={{ cursor: 'pointer' }}
          >
            Kategori
          </h2>

          {categories.map(cat => (
            <div className="category-dropdown" key={cat.id}>
              <div
                className="category-title"
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name}
              </div>
              <div className="dropdown-content">
                {productsByCategory[cat.name]?.map(product => (
                  <button
                    key={product.id}
                    className="product-button"
                    onClick={() => handleOrderClick(product, product.subproducts?.[0])}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="gallery-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search product or subproduct..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <h2>{selectedCategory ? `Kategori: ${selectedCategory}` : 'Semua Produk'}</h2>
          <div className="gallery">
            {displayedProducts.map(product => {
              const key = product.name.toLowerCase();
              return (
                <div
                  key={product.id}
                  ref={el => productRefs.current[key] = el}
                  className="gallery-item"
                >
                 {product.image_path ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${product.image_path}`}
                  alt={product.name}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <div className="no-image">Tiada Gambar</div>
              )}

               
                  <h4>{product.name}</h4>
                  <button
                    className="product-learn-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(product, product.subproducts?.[0]);
                    }}
                  >
                    Order Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product2;
