import React, { useState, useRef, useEffect } from 'react';
import { Mail, Shield, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { resendCode, verifyCode } from '../services/apiService';
import { toast } from 'react-toastify';


export default function OTPVerification() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [isVerified, setIsVerified] = useState(false);
    const inputRefs = useRef([]);
    const { token } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleInputChange = (index, value) => {
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6);
            const newOtp = [...otp];
            for (let i = 0; i < pastedCode.length && i < 6; i++) {
                newOtp[i] = pastedCode[i];
            }
            setOtp(newOtp);
            const nextIndex = Math.min(pastedCode.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter valid 6-digit code');
            return;
        }

        setIsVerifying(true);
        setError('');
        try {
            const res = await verifyCode({ token, code })

            toast.success(res.message || "Verification Successful, Please Signin")
            setIsVerified(true)
            setOtp(['', '', '', '', '', ''])
        } catch (error) {
            console.log('Verification Error: ', error)
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setError('');
        try {
            const res = await resendCode(token);

            toast.success(res.message);
            setTimeLeft(120);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.log(error)
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isVerified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h1>
                        <p className="text-gray-600 mb-8">Your email has been verified successfully. You can now Signin your account.</p>
                        <button onClick={() => navigate("/signin")} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                            Continue to Signin
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center flex-col mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <br></br>
                    <button onClick={() => navigate('/signup')} className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to signup
                    </button>


                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                    <p className="text-gray-600">
                        We've sent a 6-digit verification code to
                    </p>
                </div>

                {/* OTP Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
                    <div className="space-y-6">
                        {/* OTP Input Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                Enter Verification Code
                            </label>
                            <div className="flex justify-center space-x-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength="6"
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                                            } ${digit ? 'border-orange-500 bg-orange-50' : ''}`}
                                        placeholder="0"
                                    />
                                ))}
                            </div>
                            {error && (
                                <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
                            )}
                        </div>

                        {/* Timer */}
                        <div className="text-center">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-gray-600">
                                    Code expires in{' '}
                                    <span className="font-mono font-semibold text-orange-600">
                                        {formatTime(timeLeft)}
                                    </span>
                                </p>
                            ) : (
                                <></>
                            )}
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            disabled={isVerifying || otp.join('').length !== 6}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {isVerifying ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    <span>Verify Code</span>
                                </>
                            )}
                        </button>

                        {/* Resend Code */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                            <button
                                onClick={handleResend}
                                disabled={isResending || timeLeft > 0}
                                className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                                <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                            </button>
                        </div>

                        
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Need help?{' '}
                        <a href="#" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}