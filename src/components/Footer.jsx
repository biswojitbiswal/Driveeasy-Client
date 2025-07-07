import React from 'react'
import { Car } from 'lucide-react'

function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-orange-600 p-2 rounded-lg">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">DriveEasy</span>
              </div>
              <p className="text-gray-400 mb-4">Your trusted partner for premium car rental services.</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 cursor-pointer transition-colors">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 cursor-pointer transition-colors">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 cursor-pointer transition-colors">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Car Rental</a></li>
                <li><a href="#" className="hover:text-white">Long-term Lease</a></li>
                <li><a href="#" className="hover:text-white">Corporate Fleet</a></li>
                <li><a href="#" className="hover:text-white">Airport Transfer</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>123 Main Street</p>
                <p>New York, NY 10001</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@driveeasy.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DriveEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
