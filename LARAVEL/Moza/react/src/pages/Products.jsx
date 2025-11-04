import React, { useState } from 'react';
import './Products.css';
import { Link } from 'react-router-dom';

const allCategories = [
  'All Categories',
  'Banner',
  'Bunting',
  'Signboard',
  'Perspek',
  'Stiker Produk',
  'Digital Print',
  'Booklet',
  'Flyers',
  'Brochure',
  'Business Card',
  'Cop',
  'Mug',
  'Lanyard',
  'Foamboard',
  'Button Badge',
  'Frame kayu',
  'Calendar',
  'Sampul Raya',
  'Bill book',
  'Sublimation Shirt',
  'Tote bag'
];

const toRoute = (name) =>
  '/' + name.toLowerCase().replace(/\s+/g, '').replace(/[/]+/, '');

const productList = [
  { name: 'Banner', image: '/products/banner.jpg', route: '/Banner' },
  { name: 'Bunting', image: '/products/bunting.jpg', route: '/Bunting' },
  { name: 'Signboard', image: '/products/signboard.jpg', route: '/Signboard' },
  { name: 'Perspek', image: '/products/perspek.jpg', route: '/Perspek' },
  { name: 'Stiker Produk', image: '/products/StickerProduk.jpg', route: '/StikerProduk' },
  { name: 'Digital Print', image: '/products/digitalPrint2.jpg', route: '/DigitalPrint' },
  { name: 'Booklet', image: '/products/booklet.jpg', route: '/Booklet' },
  { name: 'Flyers', image: '/products/Flyers.jpg', route: '/Flyers' },
  { name: 'Brochure', image: '/products/Brochure.jpg', route: '/Brochure' },
  { name: 'Business Card', image: '/products/bussiness-card.jpg', route: '/BusinessCard' },
  { name: 'Cop', image: '/products/stamp.jpg', route: '/Stamp' },
  { name: 'Mug', image: '/products/mug2.jpg', route: '/Mug' },
  { name: 'Lanyard', image: '/products/lanyard.png', route: '/Lanyard' },
  { name: 'Foamboard', image: '/products/foamboard.png', route: '/Foamboard' },
  { name: 'Button Badge', image: '/products/buttonbadge.jpg', route: '/ButtonBadge' },
  { name: 'Frame kayu', image: '/products/framekayu.jpg', route: '/Frame' },
  { name: 'Calendar', image: '/products/calendar.jpg', route: '/Calendar' },
  { name: 'Sampul Raya', image: '/products/sampulRaya.jpg', route: '/SampulRaya' },
  { name: 'Bill book', image: '/products/billbook.jpg', route: '/BillBook' },
  { name: 'Sublimation Shirt', image: '/products/shirt2.jpg', route: '/SublimationShirt' },
  { name: 'Tote bag', image: '/products/totebag.jpg', route: '/Totebag' }
];

const Products = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleItems = allCategories.slice(startIndex, startIndex + 4);

  const handleToggle = () => {
    if (startIndex + 4 < allCategories.length) {
      setStartIndex(i => i + 1);
    } else {
      setStartIndex(0);
    }
  };

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="navbar2">
        <div className="navbar-center">
          <div className="navbar-items">
            {visibleItems.map((item, i) => {
              const route = toRoute(item);
              return (
                <Link
                  key={i}
                  to={route}
                  className={`nav-item ${
                    i === visibleItems.length - 1 ? 'nav-item-last' : ''
                  }`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {item}
                </Link>
              );
            })}
            <button className="toggle-button" onClick={handleToggle}>
              &#9660;
            </button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Type here ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product, index) => (
          <div className="product-item" key={index}>
            <Link to={product.route} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-box">
                <img src={product.image} alt={product.name} />
              </div>
              <p>{product.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
