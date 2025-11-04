import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Auto-close dropdown after 3 seconds
  useEffect(() => {
    if (dropdownOpen) {
      const timer = setTimeout(() => {
        setDropdownOpen(false);
      }, 6000); //timer for toogle 6s
      return () => clearTimeout(timer); // cleanup on re-render
    }
  }, [dropdownOpen]);

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">MOZA DESIGN</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/products">Our Product</Link></li>
        <li><Link to="/promosi">Promosi</Link></li>
        <li><Link to="/agents">Agents</Link></li>
        <li><Link to="/quotation">Dapatkan Quotation ?</Link></li>
      </ul>

      <div className="burger-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span className="menu-icon">☰</span>
        <span className="profile-circle">
          <img src="/icon-menu.png" alt="Profile" />
        </span>
      </div>

      {dropdownOpen && (
        <div className="dropdown">
          {isLoggedIn ? (
            <>
              <Link to="/profile">MyProfile</Link>
               <Link to="/cart">MyCart</Link>
              <Link to="/order">MyOrders</Link>
              <button onClick={handleLogout} className="logout-btn" style={{ color: 'black' }}>
               Logout</button>
             
            </>
          ) : (
            <>
              <Link to="/SignUp">Sign up</Link>
              <Link to="/login">Log in</Link>
             
              
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
