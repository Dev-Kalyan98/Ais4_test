
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CourseContext } from '../context/CourseContext';

const RegisterPage: React.FC = () => {
  const { courses } = useContext(CourseContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fullAddress: '',
    dob: '',
    gender: '',
    qualification: '',
    passingYear: '',
    course: courses.length > 0 ? courses[0].name : '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const requiredFields = { ...formData };
    delete (requiredFields as any).confirmPassword;

    if (Object.values(requiredFields).some(value => (value || '').trim() === '')) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    // Don't store confirmPassword in the user object
    const { confirmPassword, ...registrationData } = formData;
    register(registrationData);

    // Simulate network delay
    setTimeout(() => {
        setSuccess('Registration successful! You will be redirected to the login page shortly.');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    }, 500);
  };

  const inputClass = "w-full px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-md text-dark focus:ring-2 focus:ring-primary focus:outline-none transition-shadow";
  const labelClass = "block text-sm font-medium text-dark-700 mb-2";

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-light-100 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-dark text-center mb-2">Enroll Now</h1>
        <p className="text-dark-700 text-center mb-8">Start your SAP journey by filling out the form below.</p>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-6">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={labelClass}>Full Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone Number</label>
                  <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="dob" className={labelClass}>Date of Birth</label>
                  <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className={inputClass} required />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="fullAddress" className={labelClass}>Full Address</label>
                  <textarea name="fullAddress" id="fullAddress" value={formData.fullAddress} onChange={handleChange} className={inputClass} rows={3} required />
                </div>
                 <div>
                  <label htmlFor="gender" className={labelClass}>Gender</label>
                  <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputClass} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
            </div>
            </div>

            <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Educational Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label htmlFor="qualification" className={labelClass}>Highest Qualification</label>
                <input type="text" name="qualification" id="qualification" value={formData.qualification} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                <label htmlFor="passingYear" className={labelClass}>Year of Passing</label>
                <input type="number" name="passingYear" id="passingYear" value={formData.passingYear} onChange={handleChange} className={inputClass} placeholder="YYYY" required />
                </div>
            </div>
            </div>

            <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Account Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className={labelClass}>Password (min. 8 characters)</label>
                  <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Re-enter Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            </div>

            <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Course Selection</h2>
            <div>
                <label htmlFor="course" className={labelClass}>Interested Module</label>
                <select name="course" id="course" value={formData.course} onChange={handleChange} className={inputClass}>
                    {courses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            </div>
            
            <div>
            <button 
              type="submit" 
              className="w-full flex justify-center items-center bg-primary text-white font-bold py-3 px-6 rounded-md text-lg hover:bg-primary-dark transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading || !!success}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                'Register & Proceed'
              )}
            </button>
            </div>
        </form>
        </div>
    </div>
  );
};

export default RegisterPage;
