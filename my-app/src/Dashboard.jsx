
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/check-auth", { 
          withCredentials: true 
        });
        
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        } else {
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
      navigate('/');
    }
  };

  const articles = [
    {
      id: 1,
      title: "Introduction to Cloud Computing",
      excerpt: "Cloud computing delivers computing services over the internet, offering faster innovation, flexible resources, and economies of scale.",
      content: `Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.

      Key benefits include:
      • Pay-as-you-go pricing
      • Improved scalability and flexibility
      • Enhanced security features
      • Automatic software updates
      • Disaster recovery capabilities`,
    },
    {
      id: 2,
      title: "Types of Cloud Services: IaaS, PaaS, and SaaS",
      excerpt: "Understanding the three main types of cloud services and their use cases in modern business applications.",
      content: `The three main types of cloud services are:

      1. Infrastructure as a Service (IaaS):
      • Provides virtualized computing resources
      • Examples: AWS EC2, Google Compute Engine

      2. Platform as a Service (PaaS):
      • Development and deployment environment
      • Examples: Google App Engine, Heroku

      3. Software as a Service (SaaS):
      • Complete software solutions
      • Examples: Google Workspace, Salesforce`,
    },
    {
      id: 3,
      title: "Cloud Security Best Practices",
      excerpt: "Essential security measures and best practices for protecting your cloud infrastructure and data.",
      content: `Securing your cloud infrastructure is crucial. Key practices include:

      • Data encryption at rest and in transit
      • Strong access control and authentication
      • Regular security audits and monitoring
      • Compliance with industry standards
      • Backup and disaster recovery planning`,
      imageUrl: "https://example.com/cloud3.jpg"
    }
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      {/* Header with profile */}
      <header className="dashboard-header">
        <h1>Cloud Computing Hub</h1>
        <div className="profile-section">
          <div className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="profile-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="username">{user.username}</span>
          </div>
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-info">
                <strong>{user.username}</strong>
                <span>{user.email}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-content">
        <section className="featured-article">
          <h2>Featured Article</h2>
          <div className="article-card featured">
            <h3>{articles[0].title}</h3>
            <p>{articles[0].content}</p>
          </div>
        </section>

        <section className="articles-grid">
          <h2>Latest Articles</h2>
          <div className="grid">
            {articles.slice(1).map(article => (
              <div key={article.id} className="article-card">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <button className="read-more">Read More</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;