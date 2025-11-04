import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const promoImages = [
    "/promosi/promo1.jpg",
    "/promosi/promo2.jpg",
    "/promosi/promo3.jpg",
    "/promosi/promo4.jpg"
  ];

  const productImages = [
    { src: "/products/banner.jpg", alt: "Banner ", category: "Tarpaulin" },
    { src: "/products/bunting.jpg", alt: "Bunting", category: "Tarpaulin" },
    { src: "/products/lanyard.jpg", alt: "Lanyard", category: "Souvenier" },
    { src: "/products/buttonbadge.jpg", alt: "Button Badge", category: "Souvenier" },
    { src: "/products/bussinesscard.png", alt: "Bussiness Card", category: "Digital Printing" },
    { src: "/products/StickerProduk.jpg", alt: "Sticker Produk", category: "Digital Printing" },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promoImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promoImages.length) % promoImages.length);
  };

  return (
    <div className="homepage">
      {/* HERO SECTION */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/experience/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1>Pakar<br />Pemasaran<br />Anda !</h1>
        </div>
      </section>

      {/* PROMOSI SECTION */}
      <section className="promosi">
        <div className="slider-wrapper">
          <div className="promosi-header">
            <h2>Promosi Terkini</h2>
            <p className="promosi-subtitle">Dapatkan tawaran menarik sebelum tamat!</p>
          </div>
          <button className="arrow left" onClick={prevSlide}>&#10094;</button>
          <div className="slider">
            <img
              src={promoImages[currentIndex]}
              alt={`Promo ${currentIndex + 1}`}
              className="slider-image"
            />
          </div>
          <button className="arrow right" onClick={nextSlide}>&#10095;</button>
        </div>

        <div className="dots">
          {promoImages.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              onMouseEnter={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </section>
{/* PRODUCTS SECTION */}
<section className="products">
  <h2>Our Products</h2>
  <div className="products-container">
    <div className="product-grid">
      {productImages.map((item, idx) => (
        <div className="product-wrapper" key={idx}>

{/*
  TITLE ABOVE CARD
  <p className="product-title">{item.alt}</p>
*/}


          {/* CARD + IMAGE */}
          <div className="product-card">
            <Link to={`/products?category=${item.category}`}>
              <img
                src={item.src}
                alt={item.alt}
                className="product-image"
              />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

</div> // ← assuming this closes a parent component
);
};

export default Homepage;
