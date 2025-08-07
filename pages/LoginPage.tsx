
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Email and password are required.');
        return;
    }
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
        const user = login(email, password);
        if (user) {
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError('Invalid credentials. Please make sure you have registered first.');
          setIsLoading(false);
        }
    }, 500);
  };

  const inputClass = "w-full px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-md text-dark focus:ring-2 focus:ring-primary focus:outline-none transition-shadow";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto mt-10 bg-light-100 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-dark text-center mb-6">Student Login</h1>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={inputClass}
              required 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={inputClass}
              required
            />
          </div>
          <div>
            <button 
              type="submit" 
              className="w-full flex justify-center items-center bg-primary text-white font-bold py-3 px-6 rounded-md text-lg hover:bg-primary-dark transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                'Login'
              )}
            </button>
          </div>
          <p className="text-center text-sm text-dark-700">
              Don't have an account? <Link to="/register" className="font-medium text-primary hover:text-primary-dark">Register here</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
