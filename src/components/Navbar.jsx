import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
       
        <div className="navbar-brand">
          <h1 className="navbar-title">Employee Management</h1>
        </div>

        <div className="navbar-menu">
          {/* user info */}
          <div className="user-info">
            <span className="username">
              {user.username || user.email}
            </span>
            <span className={`role-badge ${user.role?.toLowerCase()}`}>
              {user.role === 'Admin' ? 'Admin' : 'Employee'}
            </span>
          </div>

          {/* logout button */}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
