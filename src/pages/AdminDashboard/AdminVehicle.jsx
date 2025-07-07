import React, { useEffect, useState } from 'react'
import { X, Plus, Trash2, Eye, Car, Fuel, Users, Settings, Calendar, ChevronLeft, SquarePen, ChevronRight } from 'lucide-react';
import { fetchAllCars, fetchCarById, fetchStats } from '../../features/car/carSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCarById } from '../../services/apiService';
import { toast } from 'react-toastify';
import AddCarModal from '../../components/Admin/AddCar'
import EditCarModal from '../../components/Admin/EditCar';


function AdminVehicle() {
  const [selectedImages, setSelectedImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [searchStr, setSearchStr] = useState("")
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const { cars, page, total, limit } = useSelector(state => state.cars);
  // TODO:Call stats api after any vehicle edit
  const { stats } = useSelector(state => state.cars)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllCars({ page: currentPage, limit: itemsPerPage, search: '' }));
  }, [dispatch, currentPage])

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch])


  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);


  const handleDelete = async (vehicleId) => {
    try {
      const res = await deleteCarById(vehicleId);
      console.log(res)

      toast.success("Car Deleted Successfully")
      dispatch(fetchAllCars({ page: currentPage, limit: itemsPerPage, search: '' }))
    } catch (error) {
      console.log(error)
    }
  };


  const getStatusBadge = (isAvailable) => {
    return isAvailable ? (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };


  const openModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVehicle(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (currentVehicle) {
      setCurrentImageIndex((prev) =>
        prev === currentVehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (currentVehicle) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? currentVehicle.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                <Car className="w-10 h-10 text-orange-600 mr-3" />
                Vehicle Management
              </h1>
              <p className="text-gray-600">Manage your fleet of vehicles</p>
            </div>
            <div className="text-right bg-white rounded-lg px-6 py-2">
              <div className="text-3xl font-bold text-orange-600">{total}</div>
              <div className="text-sm text-gray-500">Total Vehicles</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.activeCars?.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Car className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Inactive Vehicles</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.inactiveCars?.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Settings className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Price/Hour</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{stats?.avgPrice?._avg?.pricePerDay != null
                    ? stats.avgPrice._avg.pricePerDay.toFixed(2)
                    : '0.00'}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Vehicle List</h2>
            <button onClick={() => setIsModalOpen(true)} className='flex justify-center bg-orange-600 text-white p-2 rounded-md font-medium text-lg'>
              <Plus className='mr-1' />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cars?.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-lg font-semibold text-gray-900">{vehicle?.model}</div>
                        <div className="text-sm text-gray-500">{vehicle?.registrationNo}</div>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${vehicle.type === 'SEDAN' ? 'bg-blue-100 text-blue-800' :
                            vehicle.type === 'SUV' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {vehicle?.type}
                          </span>
                          <span className="text-xs text-gray-500">{vehicle?.color}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Fuel className="w-4 h-4 text-orange-500 mr-2" />
                          <span className="font-medium">{vehicle.fuel}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 text-orange-500 mr-2" />
                          <span>{vehicle?.seats} Seats</span>
                        </div>
                        <div className="text-sm text-gray-600">{vehicle?.transmission}</div>
                        <div className="text-sm text-gray-600">{vehicle?.mileage}{vehicle?.fuel === 'ELECTRIC' ? ' km/battery' : ' km/ltr'}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-2xl font-bold text-orange-600">₹{vehicle?.pricePerDay}</div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(vehicle?.isAvailable)}

                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => openModal(vehicle)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Gallery
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setIsEditModalOpen(true)
                            setSelectedCarId(vehicle.id)
                          }}
                          className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <SquarePen className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {modalOpen && currentVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentVehicle.model}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4">
                  {/* Main Image */}
                  <div className="relative mb-4">
                    <img
                      src={currentVehicle.images[currentImageIndex]}
                      alt={`${currentVehicle.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover rounded-lg high-quality-image"
                      loading="eager"
                      decoding="async"
                    />

                    {/* Navigation Arrows */}
                    {currentVehicle.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {currentVehicle.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  {currentVehicle.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {currentVehicle.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                            ? 'border-orange-500 ring-2 ring-orange-200'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex} to {endIndex} of {total} Cars
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex space-x-1">
                  {getPageNumbers()?.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`px-3 py-2 text-sm rounded-lg ${page === currentPage
                        ? 'bg-orange-600 text-white font-medium'
                        : page === '...'
                          ? 'text-gray-400 cursor-default'
                          : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        isModalOpen && <AddCarModal currentPage={currentPage} itemsPerPage={itemsPerPage} search={searchStr} setIsModalOpen={setIsModalOpen} />
      }

      {
        isEditModalOpen && <EditCarModal setIsEditModalOpen={setIsEditModalOpen} selectedCarId={selectedCarId} currentPage={currentPage} itemsPerPage={itemsPerPage} search={searchStr} />
      }
    </div>
  );
};

export default AdminVehicle
