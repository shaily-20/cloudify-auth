
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CloudComputingArticle.css';

const CloudComputingArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/check-auth", { 
          withCredentials: true 
        });
        
        if (!res.data.isAuthenticated) {
          navigate('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="article-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-container">
      <header className="article-header">
        <h1>Cloud Computing: A Comprehensive Guide</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <main className="article-content">
        <section className="article-section">
          <h2>Introduction to Cloud Computing</h2>
          <p>
            Cloud computing is the delivery of computing services—including servers, storage, databases, 
            networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer 
            faster innovation, flexible resources, and economies of scale.
          </p>
        </section>

        <section className="article-section">
          <h2>Key Benefits of Cloud Computing</h2>
          <ul>
            <li>Cost Efficiency: Pay only for what you use</li>
            <li>Scalability: Easily scale up or down based on demand</li>
            <li>Flexibility: Access resources from anywhere</li>
            <li>Disaster Recovery: Built-in backup and recovery options</li>
            <li>Security: Advanced security features and compliance</li>
          </ul>
        </section>

        <section className="article-section">
          <h2>Types of Cloud Computing</h2>
          <div className="cloud-types">
            <div className="cloud-type">
              <h3>Public Cloud</h3>
              <p>Services delivered over the public internet and shared across organizations.</p>
            </div>
            <div className="cloud-type">
              <h3>Private Cloud</h3>
              <p>Services maintained on a private network for exclusive use by a single organization.</p>
            </div>
            <div className="cloud-type">
              <h3>Hybrid Cloud</h3>
              <p>Combination of public and private clouds, allowing data and applications to be shared.</p>
            </div>
          </div>
        </section>

        <section className="article-section">
          <h2>Cloud Service Models</h2>
          <div className="service-models">
            <div className="service-model">
              <h3>Infrastructure as a Service (IaaS)</h3>
              <p>Provides virtualized computing resources over the internet.</p>
            </div>
            <div className="service-model">
              <h3>Platform as a Service (PaaS)</h3>
              <p>Provides a platform allowing customers to develop, run, and manage applications.</p>
            </div>
            <div className="service-model">
              <h3>Software as a Service (SaaS)</h3>
              <p>Delivers software applications over the internet, on a subscription basis.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CloudComputingArticle;