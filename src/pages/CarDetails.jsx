import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Zap, Fuel, Users, Calendar, Gauge, Star, MapPin, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchCarById } from '../features/car/carSlice';
import { toast } from 'react-toastify';
import { createBooking } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const CarDetailsPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    bookingName: '',
    contact: '',
    dlNo: '',
    dob: '',
    pickupDt: '',
    dropupDt: '',
    pickupLocation: '',
    dropupLocation: '',
    bookedCarId: id
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const vehicle = useSelector(state => state.cars.car)

  useEffect(() => {
    dispatch(fetchCarById(id))
  }, [id]);

  if (!vehicle) return <div className="text-center py-20 text-xl font-semibold">Loading car details...</div>;

  const FuelIcon = vehicle.fuel === 'ELECTRIC' ? Zap : Fuel;

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'bookingName':
        if (!value.trim()) {
          error = 'Booking name is required';
        } else if (value.trim().length < 2) {
          error = 'Booking name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'Booking name should contain only letters and spaces';
        }
        break;

      case 'contact':
        if (!value.trim()) {
          error = 'Contact number is required';
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          error = 'Please enter a valid 10-digit Indian mobile number';
        }
        break;

      case 'dlNo':
        if (!value.trim()) {
          error = 'Driving license number is required';
        } else if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11}$/.test(value.trim().toUpperCase())) {
          error = 'Please enter a valid driving license number (e.g., DL1420110012345)';
        }
        break;

      case 'dob':
        if (!value) {
          error = 'Date of birth is required';
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          if (age < 18) {
            error = 'You must be at least 18 years old to book a car';
          } else if (age > 100) {
            error = 'Please enter a valid date of birth';
          }
        }
        break;

      case 'pickupDt':
        if (!value) {
          error = 'Pickup date and time is required';
        } else {
          const pickupTime = new Date(value);
          const minPickupTime = new Date();
          minPickupTime.setHours(minPickupTime.getHours() + 2);
          
          if (pickupTime < minPickupTime) {
            error = 'Pickup time must be at least 2 hours from now';
          }
        }
        break;

      case 'dropupDt':
        if (!value) {
          error = 'Dropoff date and time is required';
        } else if (formData.pickupDt) {
          const dropoffTime = new Date(value);
          const pickupTime = new Date(formData.pickupDt);
          const minDropoffTime = new Date(pickupTime);
          minDropoffTime.setHours(minDropoffTime.getHours() + 4);
          
          if (dropoffTime < minDropoffTime) {
            error = 'Dropoff time must be at least 4 hours after pickup time';
          }
        }
        break;

      case 'pickupLocation':
        if (!value.trim()) {
          error = 'Pickup location is required';
        } else if (value.trim().length < 3) {
          error = 'Pickup location must be at least 3 characters';
        }
        break;

      case 'dropupLocation':
        if (!value.trim()) {
          error = 'Dropoff location is required';
        } else if (value.trim().length < 3) {
          error = 'Dropoff location must be at least 3 characters';
        }
        break;

      default:
        break;
    }
    
    return error;
  };

  const getMinPickupTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    now.setMinutes(0);
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

  const getMinDropoffTime = () => {
    if (!formData.pickupDt) return '';
    const dropMin = new Date(formData.pickupDt);
    dropMin.setHours(dropMin.getHours() + 4);
    dropMin.setMinutes(0);
    dropMin.setSeconds(0, 0);
    return dropMin.toISOString().slice(0, 16);
  };

  const getMaxDob = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().slice(0, 10);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear previous error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Special handling for pickup date time
    if (name === 'pickupDt') {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
      
      // Clear dropoff time if pickup time changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        dropupDt: ''
      }));
    } 
    // Special handling for dropoff date time
    else if (name === 'dropupDt') {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } 
    // Regular handling for other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateAllFields = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'bookedCarId') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validateAllFields()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    // Format the data to match your DTO structure
    const bookingData = {
      bookingName: formData.bookingName.trim(),
      bookedCarId: formData.bookedCarId,
      contact: formData.contact.trim(),
      dlNo: formData.dlNo.trim().toUpperCase(),
      dob: new Date(formData.dob).toISOString(),
      pickupDt: new Date(formData.pickupDt).toISOString(),
      dropupDt: new Date(formData.dropupDt).toISOString(),
      pickupLocation: formData.pickupLocation.trim(),
      dropupLocation: formData.dropupLocation.trim()
    };

    try {
      const res = await createBooking(bookingData)

      navigate(`/booking/${res.data.id}`)
    } catch (error) {
      console.log(error)
      throw new error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Image Slider */}
        <div className="relative h-80 md:h-[26rem] rounded-2xl overflow-hidden mb-8 shadow-2xl group">
          <div
            className="flex h-full transition-all duration-700 ease-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {vehicle.images?.map((image, index) => (
              <div key={index} className="relative w-full h-full flex-shrink-0">
                <img
                  src={image}
                  alt={`Vehicle ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Enhanced Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {vehicle.images?.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentImageIndex
                  ? 'bg-orange-500 scale-125 shadow-lg'
                  : 'bg-white/60 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Car Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3 leading-tight">{vehicle.model}</h1>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(vehicle.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">{vehicle.rating}</span>
                <span className="text-sm text-gray-500">(248 reviews)</span>
              </div>
              <p className="text-gray-600 text-lg">Color: <span className="font-medium">{vehicle.color}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FuelIcon, label: vehicle.fuel, color: 'text-orange-500', bg: 'bg-orange-50' },
                { icon: Users, label: `${vehicle.seats} Seats`, color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Calendar, label: vehicle.transmission, color: 'text-purple-500', bg: 'bg-purple-50' },
                { icon: Gauge, label: `${vehicle.mileage} ${vehicle.fuel === 'ELECTRIC' ? 'km/battery' : 'km/ltr'}`, color: 'text-red-500', bg: 'bg-red-50' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-3 ${item.bg} p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-gray-700 font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200 shadow-lg">
              <h3 className="text-3xl font-bold text-orange-600 mb-2">
                {formatPrice(vehicle.pricePerDay)}
                <span className="text-lg text-gray-500 ml-2 font-normal">/hour</span>
              </h3>
              <p className="text-gray-600 mb-3">Starting from ₹{Math.round(vehicle.pricePerDay * 24)}/day</p>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free cancellation up to 24 hours</span>
              </div>
            </div>
          </div>

          {/* Enhanced Contact & Location */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Location & Contact</h3>
            <div className="space-y-4">
              {[
                { icon: MapPin, label: 'Noida, Uttar Pradesh', color: 'text-red-500' },
                { icon: Phone, label: '+91 6371642583', color: 'text-green-500' },
                { icon: Mail, label: 'info@driveeasy.com', color: 'text-blue-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-gray-700 font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Why Choose Us?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 24/7 Customer Support</li>
                <li>• Sanitized Vehicles</li>
                <li>• Flexible Booking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Booking Form */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-orange-100 hover:shadow-3xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-orange-600">Book This Car</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Available Now</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Booking Name */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Booking Name*
                </label>
                <input
                  type="text"
                  name="bookingName"
                  value={formData.bookingName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter booking name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 ${
                    errors.bookingName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.bookingName && <p className="text-red-500 text-sm mt-1">{errors.bookingName}</p>}
              </div>

              {/* Contact */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Contact Number*
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 ${
                    errors.contact ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
              </div>

              {/* Driving License */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Driving License No*
                </label>
                <input
                  type="text"
                  name="dlNo"
                  value={formData.dlNo}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter DL number (e.g., DL1420110012345)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 ${
                    errors.dlNo ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.dlNo && <p className="text-red-500 text-sm mt-1">{errors.dlNo}</p>}
              </div>

              {/* Date of Birth */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Date of Birth*
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  max={getMaxDob()}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 ${
                    errors.dob ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                <p className="text-xs text-gray-500 mt-1">Must be at least 18 years old</p>
              </div>
            </div>
            
            {/* Date Time Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pickup Date Time */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Pickup Date & Time*
                </label>
                <input
                  type="datetime-local"
                  name="pickupDt"
                  value={formData.pickupDt}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min={getMinPickupTime()}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 ${
                    errors.pickupDt ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.pickupDt && <p className="text-red-500 text-sm mt-1">{errors.pickupDt}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum 2 hours from now</p>
              </div>

              {/* Dropoff Date Time */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Dropoff Date & Time*
                </label>
                <input
                  type="datetime-local"
                  name="dropupDt"
                  value={formData.dropupDt}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min={getMinDropoffTime()}
                  disabled={!formData.pickupDt}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.dropupDt ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.dropupDt && <p className="text-red-500 text-sm mt-1">{errors.dropupDt}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum 4 hours after pickup</p>
              </div>
            </div>

            {/* Location Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pickup Location */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Pickup Location*
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter pickup address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 ${
                    errors.pickupLocation ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
              </div>

              {/* Dropoff Location */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 group-focus-within:text-orange-600 transition-colors duration-200">
                  Dropoff Location*
                </label>
                <input
                  type="text"
                  name="dropupLocation"
                  value={formData.dropupLocation}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter dropoff address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 ${
                    errors.dropupLocation ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.dropupLocation && <p className="text-red-500 text-sm mt-1">{errors.dropupLocation}</p>}
              </div>
            </div>

            {/* Show booking summary if both times are selected */}
            {formData.pickupDt && formData.dropupDt && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Booking Summary</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Duration: {Math.round((new Date(formData.dropupDt) - new Date(formData.pickupDt)) / (1000 * 60 * 60))} hours</p>
                  <p>Total Cost: ₹{((new Date(formData.dropupDt) - new Date(formData.pickupDt)) / (1000 * 60 * 60) * vehicle.pricePerDay).toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full py-4 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isHovered ? '🚗 Let\'s Go!' : 'Confirm Booking'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;