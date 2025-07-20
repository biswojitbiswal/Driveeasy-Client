import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, Car, User, Phone, Mail, FileText, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cancelBooking } from '../services/apiService';
import { toast } from 'react-toastify';

const BookingDetailed = () => {
    const location = useLocation();
    const [booking, setBooking] = useState(location.state);

    const [cancelReason, setCancelReason] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false)

    const navigate = useNavigate()

    // TODO: handle contact
    const handleContact = () => {
        window.open(`tel:${booking.assignedAgent.phone}`, '_self');
    };
    // TODO: handle cancel booking
    const handleCancel = async (cancelReason) => {
        try {
            const res = await cancelBooking(booking.id, {reason: cancelReason})

            toast.success("Booking Cancelled, Refund Successful")

            setBooking(prev => ({
                ...prev,
                status: 'CANCELLED',
                deliveryStatus: 'CANCELLED',
                paymentStatus: 'REFUNDED',
                customerOTP: '',
                cancellationReason: cancelReason
            }));

            setShowCancelModal(false); // Close modal
        } catch (error) {
            console.log(error);
            throw new error
        }
    }


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRM':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const onBack = () => {
        navigate("/my-bookings")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Bookings
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Details</h1>
                            <p className="text-orange-600 font-medium">#{booking.bookingId}</p>
                        </div>
                        <div>
                            <div className='flex gap-2'>
                            {booking.customerOTP && booking.status !== 'CANCELLED' && (
                                <span className="px-4 py-2 rounded-full text-sm font-medium bg-orange-200 text-gray-800">
                                    {booking.customerOTP}
                                </span>
                            )}

                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                        <p className="text-orange-600 font-medium">{booking.cancellationReason}</p>
                        </div>

                    </div>
                </div>

                {/* Car Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <img
                                src={booking.bookedCar.images[0]}
                                alt={booking.bookedCar.model}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{booking.bookedCar.model}</h3>
                                <p className="text-gray-600">{booking.bookedCar.registrationNo}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Type</p>
                                    <p className="font-medium">{booking.bookedCar.type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Fuel</p>
                                    <p className="font-medium">{booking.bookedCar.fuel}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Seats</p>
                                    <p className="font-medium">{booking.bookedCar.seats}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Transmission</p>
                                    <p className="font-medium">{booking.bookedCar.transmission}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 mb-1">Pickup Date & Time</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium">{formatDate(booking.pickupDt)}</span>
                                    <Clock className="w-4 h-4 text-orange-500 ml-2" />
                                    <span className="font-medium">{formatTime(booking.pickupDt)}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Return Date & Time</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium">{formatDate(booking.dropupDt)}</span>
                                    <Clock className="w-4 h-4 text-orange-500 ml-2" />
                                    <span className="font-medium">{formatTime(booking.dropupDt)}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Pickup Location</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium">{booking.pickupLocation}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Drop Location</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium">{booking.dropupLocation}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 mb-1">Customer Name</p>
                                <p className="font-medium">{booking.bookingName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Contact</p>
                                <p className="font-medium">{booking.contact}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Driver License</p>
                                <p className="font-medium">{booking.dlNo}</p>
                            </div>
                            {/* <div>
                                <p className="text-gray-500 mb-1">Customer OTP</p>
                                <p className="font-medium text-orange-600">{booking.customerOTP}</p>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Agent Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Assigned Agent</h2>
                    <div className="flex items-center gap-4">
                        <img
                            src={booking.assignedAgent.profileImg}
                            alt={`${booking.assignedAgent.firstName} ${booking.assignedAgent.lastName}`}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                {booking.assignedAgent.firstName} {booking.assignedAgent.lastName}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    <span>{booking.assignedAgent.phone}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{booking.assignedAgent.email}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Experience: {booking.assignedAgent.experience} years
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Base Price</span>
                            <span className="font-medium">₹{booking.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">GST ({booking.gst}%)</span>
                            <span className="font-medium">₹{booking.gstAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Logistic Charge</span>
                            <span className="font-medium">₹{booking.logisticCharge}</span>
                        </div>
                        <div className="border-t pt-3">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total Amount</span>
                                <span className="text-orange-600">₹{booking.totalAmount}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment Status</span>
                            <span className={`font-medium ${booking.paymentStatus === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                                {booking.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Invoice */}
                {booking.invoice && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Invoice ID: {booking.invoice.invoiceId}</p>
                                <p className="text-sm text-gray-600">
                                    Generated on {formatDate(booking.invoice.invoiceDate)}
                                </p>
                            </div>
                            <a
                                href={booking.invoice.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Download
                            </a>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {
                    booking.status !== 'CANCELLED' && <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleContact}
                            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Contact Agent
                        </button>
                        {booking.status === 'CONFIRM' && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel Booking
                            </button>
                        )}
                    </div>
                }
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cancel Booking</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </p>

                        <label className="block text-orange-700 font-medium mb-2" htmlFor="reason">
                            Cancellation Reason
                        </label>
                        <textarea
                            id="reason"
                            name='reason'
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows="3"
                            className="w-full border border-orange-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                            placeholder="Enter reason for cancellation"
                        />

                        <div className="flex gap-4 justify-end mt-6">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-700"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={() => handleCancel(cancelReason)}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Cancel Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};


export default BookingDetailed
