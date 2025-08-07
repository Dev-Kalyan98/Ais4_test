import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon, LinkedinIcon, WhatsAppIcon, MailIcon, PhoneIcon } from './Icon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-slate-300 mt-12">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <LogoIcon className="h-14 w-auto" />
            </div>
            <p className="text-sm text-slate-400">A boutique technology firm making advanced SAP and AI technology practical and affordable for growing businesses.</p>
             <div className="flex space-x-4 mt-6">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors"><LinkedinIcon className="h-6 w-6" /></a>
                <a href="https://wa.me/917001835025" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors"><WhatsAppIcon className="h-6 w-6" /></a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#about" className="text-slate-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/#services" className="text-slate-400 hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/#clients" className="text-slate-400 hover:text-primary transition-colors">Our Clients</Link></li>
              <li><Link to="/courses" className="text-slate-400 hover:text-primary transition-colors">Training Portal</Link></li>
              <li><Link to="/#contact" className="text-slate-400 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Training Links */}
           <div>
            <h3 className="text-lg font-semibold text-white mb-4">Student Zone</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="text-slate-400 hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link to="/discount-test" className="text-slate-400 hover:text-primary transition-colors">Get a Discount</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-primary transition-colors">Enrollment</Link></li>
            </ul>
          </div>
          
          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get In Touch</h3>
            <address className="text-sm text-slate-400 not-italic space-y-3">
               <p>
                AI4S Solutions Pvt. Ltd.<br />
                72/5/2 Nabalia Para Road, Behala Chowrasta<br />
                Kolkata 700008<br />
                West Bengal, India
              </p>
              <a href="tel:+917001835025" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <PhoneIcon className="h-4 w-4" />
                <span>+91 70018 35025</span>
              </a>
               <a href="mailto:info@ai4spro.com" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <MailIcon className="h-4 w-4" />
                <span>info@ai4spro.com</span>
              </a>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AI4S Solutions Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;