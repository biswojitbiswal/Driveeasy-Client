import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Phone, CreditCard, Car, Clock, Fuel, Users, Settings, Palette, ArrowRight, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchBookingById } from '../features/booking/bookingSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadRazorpayScript } from '../utils/loadRazorpay.util';
import { createPayment, paymentVerify } from '../services/apiService';
import { useNavigate } from 'react-router-dom';


const BookingSummary = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const bookingsState = useSelector((state) => state.bookings);
  const navigate = useNavigate()

  const { booking, status, error } = bookingsState;

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true)
    if (id) {
      dispatch(fetchBookingById(id));
    }
    setLoading(false)
  }, [dispatch, id])



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePayNow = async () => {
    setLoading(true)
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load.");
        return;
      }

      const orderRes = await createPayment({ amount: booking.totalAmount })

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, // in paise
        currency: order.currency,
        name: "DriveEasy",
        description: "Booking Transaction",
        order_id: order.id,
        handler: function (response) {
          navigate('/verifying-payment', {
            state: {
              paymentData: response,
              bookingId: booking.id,
            },
          });
        },

        prefill: {
          name: booking.bookingName,
          email: booking.email || booking.bookedBy.email,
          contact: booking.contact,
        },
        theme: {
          color: "#ea580c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error)
      throw new error
    } finally {
      setLoading(false)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex items-center justify-center">
        <p className="text-red-600">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Compact Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Booking Summary</h1>
              {/* <p className="text-orange-600 font-medium text-sm">{booking.bookingId}</p> */}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                {booking.bookingId}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Car Details - Compact */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4">
            <div className="flex gap-4">
              <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={booking.bookedCar.images[0]}
                  alt={booking.bookedCar.model}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{booking.bookedCar.model}</h3>
                    <p className="text-orange-600 text-sm font-medium">{booking.bookedCar.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Per Hour</p>
                    <p className="font-bold text-orange-600">₹{booking.bookedCar.pricePerDay}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1">
                    <Users className="w-3 h-3 mr-1 text-gray-500" />
                    <span>{booking.bookedCar.seats} Seats</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1">
                    <Fuel className="w-3 h-3 mr-1 text-gray-500" />
                    <span>{booking.bookedCar.fuel}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1">
                    <Settings className="w-3 h-3 mr-1 text-gray-500" />
                    <span>{booking.bookedCar.transmission}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1">
                    <Palette className="w-3 h-3 mr-1 text-gray-500" />
                    <span>{booking.bookedCar.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary - Compact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span>₹{booking.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Logistics</span>
                <span>₹{booking.logisticCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST ({booking.gst}%)</span>
                <span>₹{booking.gstAmount}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-orange-600 text-lg">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Details & Customer Info - Ultra Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Trip Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-500" />
              Trip Details
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm">{booking.pickupLocation}</span>
                    <span className="text-xs text-gray-500">{formatTime(booking.pickupDt)}</span>
                  </div>
                  <p className="text-xs text-gray-600">{formatDate(booking.pickupDt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-1">
                <div className="w-px h-6 bg-gray-300"></div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm">{booking.dropupLocation}</span>
                    <span className="text-xs text-gray-500">{formatTime(booking.dropupDt)}</span>
                  </div>
                  <p className="text-xs text-gray-600">{formatDate(booking.dropupDt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Agent Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
              <User className="w-4 h-4 mr-2 text-orange-500" />
              Customer & Agent
            </h3>

            <div className="space-y-3">
              {/* Customer */}
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{booking.bookingName}</p>
                  <p className="text-xs text-gray-600">{booking.contact}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sticky Pay Button */}
        <div className="mt-6 sticky bottom-4">
          <button
            disabled={loading}
            onClick={handlePayNow}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;