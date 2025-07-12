import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Car, User, Phone, Mail, FileText, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { myBookings } from '../services/apiService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const user = useSelector((state) => state.auth.user);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const res = await myBookings(user.id);
                setBookings(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                throw new Error(error);
            }
        };

        fetchUserBookings();
    }, [user.id]);

    const onSelectBooking = (booking) => {
        if (!booking?.id) return;

        navigate(`/my-bookings/${booking.id}`, {
            state: booking
        });
    };

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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CONFIRM':
                return '✓';
            case 'PENDING':
                return '⏳';
            case 'CANCELLED':
                return '✗';
            default:
                return '•';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
                    <p className="text-gray-600">View and manage your car rental bookings</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>Total Bookings: {bookings.length}</span>
                        <span>•</span>
                        <span>Active: {bookings.filter(b => b.status === 'CONFIRM').length}</span>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-6">
                    {bookings?.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group"
                            onClick={() => onSelectBooking(booking)}
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Car Image */}
                                <div className="lg:w-80 h-48 lg:h-auto relative overflow-hidden">
                                    <img
                                        src={booking.bookedCar.images[0]}
                                        alt={booking.bookedCar.model}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)} {booking.status}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-sm font-medium text-gray-800">{booking.bookedCar.registrationNo}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                                                {booking.bookedCar.model}
                                            </h3>
                                            <p className="text-orange-600 font-medium text-sm">#{booking.bookingId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-800">₹{booking.totalAmount.toLocaleString()}</p>
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                        </div>
                                    </div>

                                    {/* Car Details */}
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                            <Car className="w-4 h-4 text-orange-500" />
                                            <span>{booking.bookedCar.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                            <span className="w-4 h-4 text-orange-500">⛽</span>
                                            <span>{booking.bookedCar.fuel}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                            <span className="w-4 h-4 text-orange-500">👥</span>
                                            <span>{booking.bookedCar.seats} Seats</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                            <span className="w-4 h-4 text-orange-500">⚙️</span>
                                            <span>{booking.bookedCar.transmission}</span>
                                        </div>
                                    </div>

                                    {/* Booking Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <span className="font-medium">Pickup:</span>
                                                <span>{formatDate(booking.pickupDt)}</span>
                                                <Clock className="w-4 h-4 text-orange-500 ml-2" />
                                                <span>{formatTime(booking.pickupDt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <span className="font-medium">Return:</span>
                                                <span>{formatDate(booking.dropupDt)}</span>
                                                <Clock className="w-4 h-4 text-orange-500 ml-2" />
                                                <span>{formatTime(booking.dropupDt)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                <span className="font-medium">Pickup:</span>
                                                <span className="truncate">{booking.pickupLocation}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                <span className="font-medium">Drop:</span>
                                                <span className="truncate">{booking.dropupLocation}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agent & Action */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={booking.assignedAgent.profileImg}
                                                alt={`${booking.assignedAgent.firstName} ${booking.assignedAgent.lastName}`}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {booking.assignedAgent.firstName} {booking.assignedAgent.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">Your Agent</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectBooking(booking);
                                            }}
                                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            View Details
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {bookings.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car className="w-12 h-12 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-4">Start your journey by booking your first car</p>
                        <button
                            onClick={() => navigate('/cars')}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Browse Cars
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;