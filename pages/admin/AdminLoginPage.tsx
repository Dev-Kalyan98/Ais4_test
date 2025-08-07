
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogoIcon } from '../../components/Icon';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Email and password are required.');
        return;
    }
    const user = login(email, password);
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  const inputClass = "w-full px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-md text-dark focus:ring-2 focus:ring-primary focus:outline-none transition-shadow";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800">
      <div className="w-full max-w-md bg-light-100 p-8 rounded-lg shadow-2xl m-4">
        <div className="flex justify-center mb-6">
            <LogoIcon className="h-20 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-dark text-center mb-2">Admin Console Login</h1>
        <p className="text-sm text-dark-700 text-center mb-6">Enter your administrator credentials</p>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={inputClass}
              required 
              placeholder="kalyanpradhan275@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={inputClass}
              required
              placeholder="Your Password"
            />
          </div>
          <div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md text-lg hover:bg-primary-dark transition-colors duration-300">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;