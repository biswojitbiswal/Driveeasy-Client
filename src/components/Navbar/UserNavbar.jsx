import React, { useState } from 'react'
import { Car, Menu, X, User, LogOut, Calendar, Info, Home } from 'lucide-react'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logout from '../Logout';
import { useSelector } from 'react-redux';

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-lg h-19 py-2 sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">DriveEasy</span>
            </Link>

            {/* Desktop Menu */}
            <div className="flex items-center space-x-8">
              <NavLink
                to="/cars"
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-600'}`
                }
              >
                Cars
              </NavLink>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-600'}`
                }
              >
                Bookings
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-600'}`
                }
              >
                About
              </NavLink>

              {!isAuthenticated ? (
                <NavLink
                  to="/signin"
                  className="text-gray-600 hover:text-orange-700 font-medium"
                >
                  Sign In
                </NavLink>
              ) : (<Logout />)}

              <div className="flex items-center space-x-4">
                {/* Simple Profile Icon */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full hover:from-orange-500 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Profile"
                >
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </button>


              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar (minimal) */}
      <nav className="bg-white shadow-lg py-2 sticky top-0 z-50 md:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DriveEasy</span>
            </Link>

            {/* Profile or Sign In */}
            {isAuthenticated ? (
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
              >
                <span className="text-white font-semibold text-xs">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </span>
              </button>
            ) : (
              <NavLink
                to="/signin"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 min-w-0 ${isActive ? 'text-orange-600' : 'text-gray-600'
              }`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </NavLink>

          <NavLink
            to="/cars"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 min-w-0 ${isActive ? 'text-orange-600' : 'text-gray-600'
              }`
            }
          >
            <Car className="w-6 h-6" />
            <span className="text-xs mt-1">Cars</span>
          </NavLink>

          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 min-w-0 ${isActive ? 'text-orange-600' : 'text-gray-600'
              }`
            }
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1">Bookings</span>
          </NavLink>

{/* TODO: Add content in About page */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 min-w-0 ${isActive ? 'text-orange-600' : 'text-gray-600'
              }`
            }
          >
            <Info className="w-6 h-6" />
            <span className="text-xs mt-1">About</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 min-w-0 ${isActive ? 'text-orange-600' : 'text-gray-600'
                }`
              }
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* Add bottom padding to main content when bottom nav is present */}
      {/* <div className="md:hidden h-2"></div> */}
    </>
  )
}

export default Navbar