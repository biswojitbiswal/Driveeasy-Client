import React from 'react'
import { Mail, X, Loader2 } from 'lucide-react'
import { forgotPassword } from '../services/apiService'
import { toast } from 'react-toastify'

function Forgot({ isOpen, setIsOpen }) {
    const [email, setEmail] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async() => {
        if (!email) {
            toast.error('Please enter your email address.')
            return
        }

        setIsLoading(true)
        
        try {
            const res = await forgotPassword(email)
            
            toast.success('Please Check Your Email For Reset Link')
            setEmail('')
            setIsOpen(false)
        } catch (error) {
            console.error('Error sending forgot password request:', error)
            toast.error('Failed to send forgot password request. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    // Prevent closing modal while loading
    const handleClose = () => {
        if (!isLoading) {
            setIsOpen(false)
        }
    }

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {/* Modal Content */}
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {isLoading ? 'Sending Email...' : 'Enter Email'}
                                </h2>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className={`p-1 rounded-full transition-colors duration-200 ${
                                    isLoading 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors duration-200 placeholder-gray-400 ${
                                        isLoading 
                                            ? 'bg-gray-50 cursor-not-allowed' 
                                            : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                                    }`}
                                />
                            </div>

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="mb-4 flex items-center justify-center text-orange-600">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    <span className="text-sm">Sending reset link...</span>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                                        isLoading
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg ${
                                        isLoading
                                            ? 'bg-orange-300 cursor-not-allowed'
                                            : 'bg-orange-500 hover:bg-orange-600 hover:shadow-xl'
                                    } text-white flex items-center justify-center`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Forgot