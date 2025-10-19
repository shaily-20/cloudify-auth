import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CloudComputingHub.css';

const CloudComputingHub = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="hub-container">
      <header className="hub-header">
        <h1>Cloud Computing Hub</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <main className="hub-content">
        <section className="welcome-section">
          <h2>Welcome to Cloud Computing Hub</h2>
          <p>Your central platform for cloud computing services and resources.</p>
        </section>

        <section className="services-grid">
          <div className="service-card">
            <h3>Virtual Machines</h3>
            <p>Deploy and manage your virtual machines in the cloud.</p>
          </div>
          
          <div className="service-card">
            <h3>Storage</h3>
            <p>Access and manage your cloud storage solutions.</p>
          </div>
          
          <div className="service-card">
            <h3>Networking</h3>
            <p>Configure and monitor your network infrastructure.</p>
          </div>
          
          <div className="service-card">
            <h3>Security</h3>
            <p>Manage security settings and access controls.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CloudComputingHub; 