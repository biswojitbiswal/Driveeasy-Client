import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function PaymentSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, invoice } = location.state || {};
    console.log(invoice)
    if (!booking || !invoice) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-medium">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-green-100 text-lg">Thank you for booking with DriveEasy</p>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8">
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Booking Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Booking ID:</span>
                                    <span className="font-semibold text-gray-800">{booking.bookingId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-semibold text-gray-800">{booking.bookingName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vehicle:</span>
                                    <span className="font-semibold text-gray-800">{booking.bookedCar?.model}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pickup:</span>
                                    <span className="font-semibold text-gray-800 text-right">{booking.pickupLocation}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pickup Date:</span>
                                    <span className="font-semibold text-gray-800 text-right">{new Date(booking.pickupDt).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Drop Location:</span>
                                    <span className="font-semibold text-gray-800 text-right">{booking.dropupLocation}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Drop Date:</span>
                                    <span className="font-semibold text-gray-800 text-right">{new Date(booking.dropupDt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-800">Total Paid:</span>
                                <span className="text-2xl font-bold text-green-600">₹{booking.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Section */}
                    <div className="bg-orange-50 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Invoice Details
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-gray-600 mb-1">Invoice ID:</p>
                                <p className="font-semibold text-gray-800 text-lg">{invoice.invoiceId}</p>
                            </div>
                            <Link
                                to={invoice.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                                Download Invoice
                            </Link>
                        </div>
                    </div>
                </div>
{/* TODO:fix payment success page */}
                {/* Action Buttons */}
                <div className="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl shadow-md font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View My Bookings
                    </button>
                    <button
                        onClick={() => navigate('/cars')}
                        className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-3 rounded-xl border-2 border-gray-300 font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Explore More Cars
                    </button>
                </div>
            </div>
        </div>
    );
}