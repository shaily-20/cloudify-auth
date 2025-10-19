
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = ({ user, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Welcome page mounted with user:', user);
  }, [user]);

  const handleLogout = () => {
    console.log('Logout requested');
    onLogout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>{getGreeting()}, {user?.username || 'User'}! </h1>
        {user?.profilePicture && (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="profile-picture"
          />
        )}
        <p>You have successfully signed in to your account.</p>
        <div className="quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a onClick={() => navigate('/article')}>Cloud Computing Article</a></li>
            <li><a onClick={() => navigate('/hub')}>Cloud Computing Hub</a></li>
            <li><a onClick={() => navigate('/dashboard')}>Dashboard</a></li>
          </ul>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;