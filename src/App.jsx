import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function AppContent() {
  const { isLoggedIn, user, loading, logout } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {isLoggedIn && (
        <header className="navbar">
          <div className="navbar-content">
            <h1>Employee Management</h1>
            <div className="user-info">
              <span>Welcome, {user?.username}!</span>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />}
        />
        <Route
          path="/employee"
          element={isLoggedIn ? <EmployeeForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/employee/:id"
          element={isLoggedIn ? <EmployeeForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
