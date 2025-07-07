import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../services/apiService';

export default function ResetPass() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async() => {
    console.log("Reset")
    if(newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid token");
      return;
    }
    
    setIsLoading(true);
    
    try {
        const res = await resetPassword(token, { newPassword });
        
        toast.success("Password reset successfully, You Can Now Signin");
        navigate('/signin');
        setNewPassword('');
        setConfirmPassword('');
    } catch (error) {
        console.error("Error resetting password:", error);
        toast.error("Failed to reset password. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {isLoading ? 'Resetting your password...' : 'Enter your new password below'}
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none transition-colors duration-200 placeholder-gray-400 ${
                    isLoading 
                      ? 'bg-gray-50 cursor-not-allowed' 
                      : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
                    isLoading 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none transition-colors duration-200 placeholder-gray-400 ${
                    isLoading 
                      ? 'bg-gray-50 cursor-not-allowed' 
                      : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
                    isLoading 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className={`bg-gray-50 rounded-lg p-4 transition-opacity duration-200 ${
              isLoading ? 'opacity-50' : 'opacity-100'
            }`}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                  Contains uppercase and lowercase letters
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                  Contains at least one number
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                  Contains at least one special character
                </li>
              </ul>
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center justify-center text-orange-600 py-2">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Resetting your password...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg flex items-center justify-center ${
                isLoading
                  ? 'bg-orange-300 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 hover:shadow-xl transform hover:-translate-y-0.5'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link 
                to="/signin" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isLoading
                    ? 'text-gray-400 cursor-not-allowed pointer-events-none'
                    : 'text-orange-600 hover:text-orange-700'
                }`}
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? <span className={`cursor-pointer transition-colors duration-200 ${
              isLoading 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-orange-600 hover:text-orange-700'
            }`}>Contact Support</span>
          </p>
        </div>
      </div>
    </div>
  );
}