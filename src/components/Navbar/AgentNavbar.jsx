import React, { useState } from 'react'
import { Car, ChevronDown, User, LogOut, Menu, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Logout from '../Logout';



function AgentNavbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const user = useSelector((state) => state.auth.user)




    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-600 p-2 rounded-lg">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">DriveEasy</span>
                        <span className="hidden sm:block text-sm text-gray-500 ml-2">Agent Portal</span>
                    </div>

                    {/* Desktop Profile Menu */}
                    <div className="hidden md:flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.firstNameame ? user.firstName.charAt(0).toUpperCase() : 'A'}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user?.firstName || 'Agent'}
                                    </div>
                                    <div className="text-xs text-gray-500">Agent</div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold">
                                                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user?.firstName || 'Agent Name'}</div>
                                                <div className="text-sm text-gray-500">{user?.email || 'agent@driveeasy.com'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <NavLink
                                            to="/agent/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="w-4 h-4 mr-3" />
                                            Profile Settings
                                        </NavLink>

                                        <div
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />

                                            <Logout className='w-full' />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                        {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{user?.firstName || 'Agent Name'}</div>
                                    <div className="text-sm text-gray-500">{user?.email || 'agent@driveeasy.com'}</div>
                                </div>
                            </div>

                            <NavLink to="/agent/profile" className="block px-3 py-2 text-gray-600 hover:text-orange-600">
                                Profile Settings
                            </NavLink>
                            <div
                                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-3" />
                                <Logout />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default AgentNavbar
