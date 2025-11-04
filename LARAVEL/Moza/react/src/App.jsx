import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/navbar';
import OrderFormRouter from './pages/OrderFormRouter';



import AboutUs from './pages/AboutUs';
import Agent from './pages/Agent';
import Homepage from './pages/Homepage';
import Products from './pages/Product2';
import Promosi from './pages/Promosi';
import Quotation from './pages/Quotation';
import TestConnection from './pages/TestConnection';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AdminDashboard from './admin/AdminDashboard';
import Profile from './Users/profile';
import CartPage from './Users/cart'; 
import MyOrders from './Users/MyOrders'; 
import AgentRegistrationForm from './admin/RegisterAgent';



import Banner from './productPage/Banner';
import Bunting from './productPage/Bunting';
import Signboard from './productPage/Signboard';
import Sampul from './productPage/SampulRaya';
import Billbook from './productPage/Billbook';
import Perspek from './productPage/Perspek';
import Sticker from './productPage/StikerProduk';
import DigitalPrint from './productPage/DigitalPrint';
import Booklet from './productPage/Booklet';
import Flyers from './productPage/Flyers';
import Brochure from './productPage/Brochure';
import BussinessCard from './productPage/BussinessCard';
import Stamp from './productPage/Stamp';
import Mug from './productPage/Mug';
import Lanyard from './productPage/Lanyard';
import Foamboard from './productPage/Foamboard';
import ButtonBadge from './productPage/Buttonbadge';
import Frame from './productPage/Frame';
import Calendar from './productPage/Calendar';
import SublimationShirt from './productPage/SublimationShirt';
import Totebag from './productPage/Totebag';

function App() {
  const location = useLocation();
  const noNavbarFooterPaths = ['/admin'];
  const hideNavFooter = noNavbarFooterPaths.includes(location.pathname);

  return (
    <div className="App"> 
      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register-agent" element={<AgentRegistrationForm />} />

        <Route path="/" element={<Homepage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/promosi" element={<Promosi />} />
        <Route path="/agents" element={<Agent />} />
        <Route path="/quotation" element={<Quotation />} />
 
<Route path="/orderform/:productName/:id" element={<OrderFormRouter />} />


        <Route path="/Banner" element={<Banner />} />
        <Route path="/Bunting" element={<Bunting />} />
        <Route path="/Signboard" element={<Signboard />} />
        <Route path="/SampulRaya" element={<Sampul />} />
        <Route path="/BillBook" element={<Billbook />} />
        <Route path="/Perspek" element={<Perspek />} />
        <Route path="/StikerProduk" element={<Sticker />} />
        <Route path="/DigitalPrint" element={<DigitalPrint />} />
        <Route path="/Booklet" element={<Booklet />} />
        <Route path="/Flyers" element={<Flyers />} />
        <Route path="/Brochure" element={<Brochure />} />
        <Route path="/BussinessCard" element={<BussinessCard />} />
        <Route path="/Stamp" element={<Stamp />} />
        <Route path="/Mug" element={<Mug />} />
        <Route path="/Lanyard" element={<Lanyard />} />
        <Route path="/Foamboard" element={<Foamboard />} />
        <Route path="/ButtonBadge" element={<ButtonBadge />} />
        <Route path="/Frame" element={<Frame />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/SublimationShirt" element={<SublimationShirt />} />
        <Route path="/Totebag" element={<Totebag />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />
         <Route path="/order" element={<MyOrders />} />

        
       
      </Routes>

      {!hideNavFooter && <Footer />}
      <TestConnection />
    </div>
  );
}

export default App;
