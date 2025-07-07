import React, {useState} from 'react'
import { Car, Menu } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom';
import Logout from '../Logout';
import { useSelector } from 'react-redux';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      <nav className="bg-white shadow-lg h-19 py-2 sticky top-0 z-50">
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
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/cars" className="text-gray-600 hover:text-orange-600 transition-colors">Cars</NavLink>
              <NavLink to="/locations" className="text-gray-600 hover:text-orange-600 transition-colors">Locations</NavLink>
              <NavLink to="/about" className="text-gray-600 hover:text-orange-600 transition-colors">About</NavLink>
              <NavLink to="/contact" className="text-gray-600 hover:text-orange-600 transition-colors">Contact</NavLink>
              {
                !isAuthenticated ? (<NavLink to="/signin" className="text-orange-600 hover:text-orange-700 font-medium">Sign In</NavLink>) : (<Logout />)
              }
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="block px-3 py-2 text-gray-600 hover:text-orange-600">Cars</a>
                <a href="#" className="block px-3 py-2 text-gray-600 hover:text-orange-600">Locations</a>
                <a href="#" className="block px-3 py-2 text-gray-600 hover:text-orange-600">About</a>
                <a href="#" className="block px-3 py-2 text-gray-600 hover:text-orange-600">Contact</a>
                <a href="#" className="block px-3 py-2 text-orange-600 font-medium">Sign In</a>
                <button className="w-full mt-2 bg-orange-600 text-white px-4 py-2 rounded-lg">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
