import React, { useEffect, useState } from 'react';
import { CheckCircle, CreditCard, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { paymentVerify } from '../services/apiService';
import { toast } from 'react-toastify';

const VerifyingPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);

    const { paymentData, bookingId } = location.state || {};

    const verificationSteps = [
        {
            icon: CreditCard,
            title: "Processing Payment",
            description: "Validating payment details"
        },
        {
            icon: Shield,
            title: "Security Check",
            description: "Verifying transaction security"
        },
        {
            icon: CheckCircle,
            title: "Finalizing",
            description: "Confirming your booking"
        }
    ];

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % verificationSteps.length);
        }, 1500);

        const verify = async () => {
            if (!paymentData || !bookingId) {
                toast.error("Invalid payment details.");
                navigate('/my-bookings');
                return;
            }

            try {
                const res = await paymentVerify({
                    bookingId,
                    razorpay_order_id: paymentData.razorpay_order_id,
                    razorpay_payment_id: paymentData.razorpay_payment_id,
                    razorpay_signature: paymentData.razorpay_signature,
                });

                console.log(res)

                if (res.status === 'success') {
                    toast.success("Payment verified!");
                    const { booking, invoice } = res.data;
                    console.log(booking, invoice)
                    navigate('/payment-success', {
                        state: {
                            booking,
                            invoice,
                        },
                    });
                } else {
                    console.log(error)
                    toast.error("Payment verification failed.");
                    navigate('/my-bookings');
                }
            } catch (error) {
                console.error("Verification error:", error);
                toast.error("Server error during verification.");
                navigate('/my-bookings');
            }
        };

        verify();

        return () => clearInterval(stepInterval);
    }, [paymentData, bookingId, navigate]);

    const PulsingDot = ({ delay = 0 }) => (
        <div
            className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
        />
    );

    const AnimatedIcon = ({ IconComponent, isActive }) => (
        <div className={`relative transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
            <div className={`absolute inset-0 rounded-full ${isActive ? 'bg-orange-100 animate-ping' : ''}`} />
            <div className={`relative p-4 rounded-full ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'} transition-all duration-500`}>
                <IconComponent size={24} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
            <div className="text-center p-8 max-w-md mx-auto">
                {/* Main Animation Circle */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto relative">
                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-spin border-t-orange-500" />

                        {/* Inner pulsing circle */}
                        <div className="absolute inset-4 rounded-full bg-orange-500 animate-pulse flex items-center justify-center">
                            <CreditCard size={32} className="text-white" />
                        </div>

                        {/* Floating particles */}
                        <div className="absolute -top-2 left-8 w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="absolute -bottom-2 right-8 w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        <div className="absolute top-8 -right-2 w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
                        <div className="absolute bottom-8 -left-2 w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }} />
                    </div>
                </div>

                {/* Verification Steps */}
                <div className="mb-8">
                    <div className="flex justify-center items-center space-x-4 mb-6">
                        {verificationSteps.map((step, index) => (
                            <AnimatedIcon
                                key={index}
                                IconComponent={step.icon}
                                isActive={index === currentStep}
                            />
                        ))}
                    </div>

                    <div className="h-20 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 transition-all duration-500">
                            {verificationSteps[currentStep].title}
                        </h2>
                        <p className="text-gray-600 transition-all duration-500">
                            {verificationSteps[currentStep].description}
                        </p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <PulsingDot delay={0} />
                        <PulsingDot delay={200} />
                        <PulsingDot delay={400} />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${((currentStep + 1) / verificationSteps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Status Text */}
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                        Verifying Your Payment
                    </p>
                    <p className="text-sm text-gray-500 flex items-center justify-center">
                        <Clock size={16} className="mr-2" />
                        This may take a few moments
                    </p>
                </div>

                {/* Security Badge */}
                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center text-green-700">
                        <Shield size={16} className="mr-2" />
                        <span className="text-sm font-medium">Secure Payment Processing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyingPayment;