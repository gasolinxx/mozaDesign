
import React, { useEffect, useState } from 'react';
import './AboutUs.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';



import CompanyImage from '../assets/logo.png'; 
import BannerImage from '../assets/Banner.jpeg'; 
import FlyersImage from '../assets/flyers.jpeg'; 
import SignboardImage from '../assets/signboard.jpg'; 


const AboutUs = () => {

  const [feedbacks, setFeedbacks] = useState([]);

useEffect(() => {
  fetch('http://127.0.0.1:8000/api/feedback') // Replace with your real backend endpoint
    .then(res => res.json())
    .then(data => setFeedbacks(data))
    .catch(err => console.error("Error fetching feedback:", err));
}, []);

const averageRating = feedbacks.length > 0 
  ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length).toFixed(1)
  : 0;


  return (
  
    <div className="about-us">
   <section className="company-background">
  <div className="company-content">
    <div className="company-text">
      <h2>COMPANY BACKGROUND</h2>
      <p>
       

Ditubuhkan pada tahun 2002, Moza Design ialah syarikat percetakan yang dipercayai di Taiping, Perak. Dengan lebih 20 tahun pengalaman, kami pakar dalam perkhidmatan percetakan berkualiti seperti banner, papan tanda, dan produk khas. Komitmen kami terhadap kreativiti, ketepatan dan kepuasan pelanggan menjadikan kami pilihan utama.
      </p>

      <div className="specializations">
        <p>Kami Pakar :</p>
        <div className="specialty-list">
          <p>✅ Custom Design</p>
          <p>✅ Signboard & Installation</p>
          <p>✅ Digital Printing</p>
          <p>✅ Cetak Banner</p>
        </div>
      </div>
    </div>

         <div className="company-image-container">
            <img
              src={CompanyImage}
              alt="Moza Design Office"
              className="company-image"
            />
          </div>
        </div>
      </section>



    {/* WHAT WE DO */}
    <section className="what-we-do section">
        <h2>WHAT WE DO</h2>
        <p>Ready to serve you!</p>
        <div className="service-grid">
          <div className="service-card">
            <img src={BannerImage} alt="Banner" />
            <h3>Banner</h3>
             ✅Siap dalam 1 hari sahaja.<br />
                  ✅Saiz boleh ditempah khas.<br />
                  ✅Tahan cuaca & tahan lama.<br />
                  ✅Material berkualiti.
          </div>


          
          <div className="service-card">
            <img src={SignboardImage}  alt="Signboard" />
            <h3>Signboard</h3>
            
             ✅Reka bentuk khas mengikut perniagaan anda.<br />
    ✅Material UV dan lain-lain disediakan. <br />
    ✅Pemasangan disertakan – mudah dan tanpa masalah!
          </div>

          <div className="service-card">
            <img src={FlyersImage} alt="Digital Printing" />
            <h3>Digital Printing</h3>
                ✅Warna terang dan tajam. <br />
                ✅Tersedia dalam cetakan offset dan kuantiti kecil. <br />
                ✅Ada pakej bersama pemotongan.
          </div>
        </div>
      </section>

    
<section className="our-experience section">
  <h2>OUR EXPERIENCE</h2>

  <div className="experience-container">
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      className="experience-slider"
    >
      
      <SwiperSlide>
        <img src="/experience/exp1.jpg" alt="Experience 1" />
        <p>Proses penampalan huruf di monumen Perbadanan Pembangunan Pertanian Negeri Perak.</p>
      </SwiperSlide>


       <SwiperSlide>
        <img src="/experience/exp2.jpg" alt="Experience 2" />
        <p>Kerja-kerja pemasangan signboard untuk kedai Adawiyah di Changkat Jering.</p>
      </SwiperSlide>

       <SwiperSlide>
        <img src="/experience/exp3.jpg" alt="Experience 3" />
        <p>Kerja pemasangan signboard sekolah di SMK Dato Wan Ahmad Rasdi. Mereka memilih material UV supaya warna signboard lebih tahan lama meskipun terkena sinaran matahari.</p>
      </SwiperSlide>

       <SwiperSlide>
        <img src="/experience/exp4.jpg" alt="Experience 4" />
        <p>Kerja pemasangan papan tanda arklik di kelas bakery di Noble school Taiping . Pangunaan "arcylic signage' ini menampakkan ia lebih moden dan menarik.</p>
      </SwiperSlide>

       <SwiperSlide>
        <img src="/experience/exp5.jpg" alt="Experience 5" />
        <p>Pemasangan arcylic signage yang telah ditampal dengan sticker bagi pameran muzium.</p>
      </SwiperSlide>

          <SwiperSlide>
        <img src="/experience/exp6.jpg" alt="Experience 6" />
        <p>Contoh hasil pemasangan sticker di Muzium Taiping sempena pameran sejarah Tanah Melayu.</p>
      </SwiperSlide>
      
    </Swiper>

    
  </div>
</section>



{/* Get In Touch Section */}
<section className="contact">
  <h2>GET IN TOUCH</h2>
  <p>Let's make something great together</p>
  <div className="contact-container">
    <div className="contact-info">
      <div className="location">
        <i className="fas fa-map-marker-alt"></i>
        <span>TAIPING , PERAK</span>
      </div>
      <p>Address: 42A, Jalan TBC 3, TAIPING BUSINESS CENTRE, 34000 Taiping, Perak</p>
      <div className="operating-hours">
        <p><strong>Operating Hours:</strong></p>
        <p>Mon - Saturday (9 am - 6 pm)</p>
        <p>Sunday: Closed</p>
      </div>

      <div className="contact-row" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <div className="contact-methods" style={{ flex: 1, minWidth: '200px'}}>
          <div className="method">
            <i className="fas fa-phone"></i>
            <a href="tel:+6058552115">05 - 8059099</a>
          </div>
          <div className="method">
            <i className="fab fa-whatsapp"></i>
            <a href="https://wa.me/60135345874" target="_blank" rel="noopener noreferrer">013 - 5345874</a>
          </div>
          <div className="method">
            <i className="fas fa-envelope"></i>
            <a href="mailto:Mozadesignofficial@gmail.com">Mozadesignofficial@gmail.com</a>
          </div>
          <div className="method">
            <a href="https://www.facebook.com/MozaDesign" target="_blank" rel="noopener noreferrer" className="moza-design-text">
              <i className="fab fa-facebook"></i> MOZA Design
            </a>
          </div>
        </div>

        <div className="map-container" style={{ flex: 1, minWidth: '300px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.584917725236!2d100.74760457298225!3d4.841106440428532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31caaf8a1b183ccf%3A0x9e4276a046a2f8d7!2sMOZA%20DESIGN!5e0!3m2!1sen!2smy!4v1749696638402!5m2!1sen!2smy"
            style={{ border: 0, width: '100%', height: '200px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Moza Design Location"
          />
        </div>
      </div>
    </div>
  </div>
</section>



<section className="feedback">
  <h2>CUSTOMER FEEDBACK</h2>
  <div className="feedback-rating">
    <div className="rating-circle">
      <span>{averageRating}</span>
    </div>
  </div>

  <Swiper
    modules={[Pagination]}
    spaceBetween={20}
    slidesPerView={1}  // Show 1 slide at a time, each slide contains 4 cards in 2x2 grid
    pagination={{ clickable: true }}
    className="feedback-slider"
  >
    {Array.from({ length: Math.ceil(feedbacks.length / 4) }).map((_, slideIndex) => {
      const feedbackGroup = feedbacks.slice(slideIndex * 4, slideIndex * 4 + 4);
      return (
        <SwiperSlide key={slideIndex}>
          <div className="feedback-grid-2x2">
            {feedbackGroup.map((item, index) => (
              <div className="feedback-item" key={index}>
                <p className="testimonial-text">"{item.comments}"</p>
                <p className="testimonial-author">- {item.user}</p>
                <div className="star-rating">
                  {"★".repeat(item.rating) + "☆".repeat(5 - item.rating)}
                </div>
              </div>
            ))}
          </div>
        </SwiperSlide>
      );
    })}
  </Swiper>
</section>
    </div>
 
  );
};

export default AboutUs;
