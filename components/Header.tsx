
import React, { useState, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogoIcon, MenuIcon, CloseIcon } from './Icon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    setIsMenuOpen(false);
    if (path.startsWith('/#')) {
      navigate(path);
    }
  };

  const navLinkClass = `py-2 px-3 rounded-md text-sm font-medium transition-colors duration-300 text-dark hover:text-primary`;
  const activeNavLinkClass = `py-2 px-3 rounded-md text-sm font-medium transition-colors duration-300 bg-primary/10 text-primary`;

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <>
      <Link to="/#about" onClick={() => handleNavClick('/#about')} className={navLinkClass}>About</Link>
      <Link to="/#services" onClick={() => handleNavClick('/#services')} className={navLinkClass}>Services</Link>
      <NavLink 
        to="/courses" 
        className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}
        onClick={() => setIsMenuOpen(false)}
      >
        Courses
      </NavLink>
      {isLoggedIn && user?.role === 'student' ? (
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </NavLink>
      ) : (
        <NavLink 
          to="/discount-test" 
          className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}
          onClick={() => setIsMenuOpen(false)}
        >
          Discount Test
        </NavLink>
      )}
      <Link to="/#contact" onClick={() => handleNavClick('/#contact')} className={navLinkClass}>Contact</Link>
       {user?.role === 'admin' && (
         <NavLink 
            to="/admin/dashboard" 
            className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            Admin
          </NavLink>
       )}
    </>
  );

  return (
    <header className="bg-light-100/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <LogoIcon className="h-14 w-auto" />
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            <NavLinks />
            {isLoggedIn ? (
               <button onClick={logout} className="ml-4 py-2 px-4 rounded-md text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-300">
                  Logout
                </button>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login" className="py-2 px-4 rounded-md text-sm font-medium text-primary border border-primary/50 hover:bg-primary/10 transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="py-2 px-4 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-all duration-300">
                  Enroll Now
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-700 hover:text-primary hover:bg-neutral-100 focus:outline-none"
            >
              {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLinks isMobile />
            {isLoggedIn ? (
               <button onClick={() => { logout(); setIsMenuOpen(false); }} className="mt-2 w-full text-left py-2 px-3 rounded-md text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-300">
                  Logout
                </button>
            ) : (
                <div className="mt-2 pt-2 border-t border-neutral-200 space-y-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-2 px-4 text-sm font-medium text-primary border border-primary/50 rounded-md hover:bg-primary/10 transition-colors duration-300">
                        Login
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-2 px-4 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-all duration-300">
                        Enroll Now
                    </Link>
                </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;