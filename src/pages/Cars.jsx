import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Car, Calendar, Fuel, Users, Heart, MapPin, Star, Clock, ChevronDown, Gauge, Zap, Phone, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchAllCars } from '../features/car/carSlice';
import { useNavigate } from 'react-router-dom';
import { toggleLike } from '../services/apiService'
import { toast } from 'react-toastify';

const CarRentalInventory = () => {
  const { cars: fetchedCars } = useSelector(state => state.cars)
  const {total} = useSelector(state => state.cars.cars)
  const dispatch = useDispatch();

  const [allCars, setAllCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    fuel: '',
    transmission: '',
    priceRange: [0, 2000],
    seats: '',
    available: ''
  });

  const navigate = useNavigate()

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    type: filters.type,
    fuel: filters.fuel,
    transmission: filters.transmission,
    priceRange: filters.priceRange[1],
    seats: filters.seats,
    isAvailable: filters.available,
    sortOrder: sortOrder
  }), [currentPage, itemsPerPage, debouncedSearchTerm, filters, sortOrder]);


  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      try {
        await dispatch(fetchAllCars(queryParams));
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [dispatch, queryParams]);


  useEffect(() => {
    setCurrentPage(1);
    setAllCars([]);
  }, [debouncedSearchTerm, filters, sortOrder]);


  useEffect(() => {
    if (currentPage === 1) {
      setAllCars(fetchedCars.data);
    } else {
      setAllCars((prev) => {
        const carMap = new Map();
        [...prev, ...fetchedCars.data].forEach((car) => {
          carMap.set(car.id, car); // id should be unique
        });
        return Array.from(carMap.values());
      });
    }
  }, [fetchedCars, currentPage]);


  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      SUV: 'bg-purple-100 text-purple-800',
      SEDAN: 'bg-blue-100 text-blue-800',
      HATCHBACK: 'bg-green-100 text-green-800',
      COUPE: 'bg-red-100 text-red-800',
      CONVERTIBLE: 'bg-yellow-100 text-yellow-800',
      MPV: 'bg-pink-100 text-pink-800',
      TRUCK: 'bg-orange-100 text-orange-800',
      VAN: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getMileageDisplay = (vehicle) => {
    if (vehicle.fuel === 'ELECTRIC') {
      return `${vehicle.mileage} km/battery`;
    }
    return `${vehicle.mileage} km/ltr`;
  };

  const getFuelIcon = (fuel) => {
    return fuel === 'ELECTRIC' ? Zap : Fuel;
  };

  const handleCardClick = (vehicleId) => {
    navigate(`/car/${vehicleId}`)
  };

  const handleToggleLike = async (e, id) => {
    e.stopPropagation();

    setAllCars(prevCars =>
      prevCars?.map(car =>
        car.id === id ? { ...car, liked: !car.liked } : car
      )
    );

    try {
      const res = await toggleLike({ carId: id });


      toast.success(res?.message);

    } catch (error) {
      setAllCars(prevCars =>
        prevCars?.map(car =>
          car.id === id ? { ...car, liked: !car.liked } : car
        )
      );

      console.error(error);
      toast.error("Something went wrong.");
    }
  };




  if (loading && allCars?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-8 border-t-orange-600 animate-spin shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-orange-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search cars, brands, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <span>
                  {sortOrder === 'asc' ? 'Price: Low to High' : 'Price: High to Low'}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''
                    }`}
                />
              </button>

            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">All</option>
                    <option value="SUV">SUV</option>
                    <option value="SEDAN">SEDAN</option>
                    <option value="HATCHBACK">HATCHBACK</option>
                    <option value="COUPE">COUPE</option>
                    <option value="CONVERTIBLE">CONVERTIBLE</option>
                    <option value="MPV">MPV</option>
                    <option value="TRUCK">TRUCK</option>
                    <option value="VAN">VAN</option>

                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fuel</label>
                  <select
                    value={filters.fuel}
                    onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">All</option>
                    <option value="PETROL">PETROL</option>
                    <option value="DIESEL">DIESEL</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                    <option value="HYBRID">HYBRID</option>
                    <option value="CNG">CNG</option>

                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">All</option>
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="SEMI_AUTOMATIC">Semi Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Seats</label>
                  <select
                    value={filters.seats}
                    onChange={(e) => setFilters({ ...filters, seats: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">All</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Availability</label>
                  <select
                    value={filters.available}
                    onChange={(e) => setFilters({ ...filters, available: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600 mt-1">₹0 - ₹{filters.priceRange[1]}</div>
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allCars?.map((vehicle) => {
            const FuelIcon = getFuelIcon(vehicle.fuel);

            return (
              <div
                key={vehicle?.id}
                onClick={() => handleCardClick(vehicle?.id)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden backdrop-blur-sm"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={vehicle?.images[0]}
                    alt={vehicle?.model}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(vehicle?.type)} shadow-sm`}>
                      {vehicle?.type?.charAt(0).toUpperCase() + vehicle?.type?.slice(1)}
                    </span>
                  </div>

                  {/* Like Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => handleToggleLike(e, vehicle?.id)}
                      className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm ${vehicle?.liked
                        ? 'bg-red-500 text-white shadow-red-200'
                        : 'bg-white/90 text-gray-600 hover:bg-white'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${vehicle?.liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Availability Overlay */}
                  {!vehicle.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-white font-bold text-lg">Not Available</span>
                        <p className="text-white/80 text-sm mt-1">Check back later</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                        {vehicle?.model}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">{vehicle?.color} |  🛋 {vehicle?.seats} Seats | ⛽ {vehicle?.fuel} | ⚙️ {vehicle?.transmission}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{vehicle?.rating}</span>
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  {/* <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <FuelIcon className={`h-4 w-4 ${vehicle.fuel === 'ELECTRIC' ? 'text-green-500' : 'text-orange-500'}`} />
                      <span className="text-sm text-gray-700 font-medium">{vehicle?.fuel}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700 font-medium">{vehicle?.seats} seats</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-700 font-medium">{vehicle?.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <Gauge className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-700 font-medium">{getMileageDisplay(vehicle)}</span>
                    </div>
                  </div> */}

                  {/* Pricing */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {formatPrice(vehicle?.pricePerDay)}
                          <span className='text-gray-500 text-sm font-normal ml-1'>/hour</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Best rate guaranteed</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Starting from</div>
                        <div className="text-sm font-semibold text-gray-700">₹{Math.round(vehicle?.pricePerDay * 24)}/day</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={!vehicle?.isAvailable}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform active:scale-95 ${vehicle?.isAvailable
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-200 hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {vehicle?.isAvailable ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span>Book Now</span>
                        <span className="text-xs">→</span>
                      </span>
                    ) : (
                      'Not Available'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className='w-full flex justify-center mt-5'>
          {allCars?.length < total && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                }`}
            >
              {loading ? 'Loading...' : 'More'}
            </button>
          )}

        </div>

        {/* No Results */}
        {allCars?.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Car className="h-16 w-16 text-orange-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find available cars.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRentalInventory;