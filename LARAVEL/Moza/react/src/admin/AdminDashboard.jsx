import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaUserTie,
  FaQuestionCircle,
  FaClipboardList,
  FaShoppingCart,
  FaSignOutAlt
} from 'react-icons/fa';
import Product from './Product';
import Record from './Records';
import Agent from './RegisterAgent';
import './AdminDashboard.css';
import Order from './Orders'; // Import the Orders component


const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'orders', label: 'Orders', icon: <FaBoxOpen /> },
    { key: 'agents', label: 'Agents', icon: <FaUserTie /> },
    { key: 'products', label: 'Products', icon: <FaShoppingCart /> },
    { key: 'Records', label: 'Product Records', icon: <FaClipboardList /> },
  ];

  const [activeMenu, setActiveMenu] = useState('orders');
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  useEffect(() => {
    if (activeMenu === 'agents') {
      setLoadingAgents(true);
      fetch('http://127.0.0.1:8000/api/agents')
        .then((res) => res.json())
        .then((data) => {
          setAgents(data);
          setLoadingAgents(false);
        })
        .catch((err) => {
          console.error('Error fetching agents:', err);
          setLoadingAgents(false);
        });
    }
  }, [activeMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'agents':
        return <Agent />;
 
      case 'Records':
        return <Record />;
      case 'products':
        return <Product />;
               case 'orders':
      return <Order />;

  
    
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`menu-item ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Header */}
        <header className="header">
          <h1 className="title">
            {menuItems.find((item) => item.key === activeMenu)?.label || 'Dashboard'}
          </h1>

          {/* Logout Button Top Right */}
          <div className="logout-btn-container">
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* Dynamic Section */}
        <section className="content-section">{renderContent()}</section>
      </main>
    </div>
  );
};

export default AdminDashboard;
