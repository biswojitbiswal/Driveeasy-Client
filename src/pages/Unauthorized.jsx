import React, { useState, useEffect } from 'react';
import { Shield, Lock, ArrowLeft, AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white bg-opacity-10 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white bg-opacity-5 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 max-w-lg mx-4 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Glass morphism card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
          {/* Icon Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-orange-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white bg-opacity-20 rounded-full p-6 inline-block">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-red-500 bg-opacity-20 rounded-full px-4 py-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-200" />
              <span className="text-red-200 font-semibold">Error 401</span>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Access Denied
            </h1>
            <p className="text-orange-100 text-lg mb-2">
              You don't have permission to access this resource
            </p>
            <p className="text-orange-200 text-sm opacity-80">
              Please contact your administrator or try logging in with proper credentials
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoBack}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 backdrop-blur-sm border border-white border-opacity-20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Return Home</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-white border-opacity-20">
            <div className="flex items-center justify-center space-x-2 text-orange-200 text-sm">
              <Lock className="w-4 h-4" />
              <span>Secure Area - Authentication Required</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-black bg-opacity-20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Unauthorized Access Detected</span>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black from-opacity-20 to-transparent"></div>
    </div>
  );
}