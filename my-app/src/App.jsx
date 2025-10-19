
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import CloudComputingArticle from './CloudComputingArticle';
import CloudComputingHub from './CloudComputingHub';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login/Home Route */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Cloud Computing Article */}
        <Route path="/article" element={<CloudComputingArticle />} />
        
        {/* Cloud Computing Hub */}
        <Route path="/hub" element={<CloudComputingHub />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;