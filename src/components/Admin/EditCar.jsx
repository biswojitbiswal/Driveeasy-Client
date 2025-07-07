import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, Car } from 'lucide-react';
import { addCar, updateCarById } from '../../services/apiService';
import { useDispatch } from 'react-redux';
import { fetchAllCars, fetchCarById } from '../../features/car/carSlice';
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';

const EditCarModal = ({ currentPage, itemsPerPage, search, setIsEditModalOpen, selectedCarId }) => {
    const dispatch = useDispatch()
    const car = useSelector(state => state.cars.car)

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        model: '',
        type: '',
        fuel: '',
        seats: '',
        pricePerDay: '',
        existingImages: [],
        newImages: [],
        transmission: '',
        mileage: '',
        color: '',
        registrationNo: '',
        isAvailable: true,
        gst: '',
        logistic: ''
    });

    useEffect(() => {
        if (car) {
            setFormData({
                model: car.model || '',
                type: car.type || '',
                fuel: car.fuel || '',
                seats: car.seats || '',
                pricePerDay: car.pricePerDay || '',
                existingImages: car.images ? [...car.images] : [],
                newImages: [],
                transmission: car.transmission || '',
                mileage: car.mileage || '',
                color: car.color || '',
                registrationNo: car.registrationNo || '',
                isAvailable: car.isAvailable !== undefined ? car.isAvailable : true,
                gst: car.gst || '',
                logistic: car.logistic || ''
            });
        }
    }, [car]);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);

            try {
                await dispatch(fetchCarById(selectedCarId));
            } finally {
                setLoading(false);
            }
        };

        fetchCars();

    }, [dispatch, selectedCarId])



    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle boolean conversion for isAvailable
        if (name === 'isAvailable') {
            setFormData(prev => ({
                ...prev,
                [name]: value === 'true'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file?.size <= 10 * 1024 * 1024; // 10MB limit

            if (!isValidType) {
                alert(`${file?.name} is not a valid image file`);
                return false;
            }
            if (!isValidSize) {
                alert(`${file?.name} is too large. Maximum size is 10MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                newImages: [...prev.newImages, ...validFiles]
            }));
        }

        e.target.value = '';
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index)
        }));
    };

    const removeNewImage = (index) => {
        setFormData(prev => ({
            ...prev,
            newImages: prev.newImages.filter((_, i) => i !== index)
        }));
    };

    const createSafeObjectURL = (file) => {
        try {
            if (file instanceof File || file instanceof Blob) {
                return URL.createObjectURL(file);
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error creating object URL:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.model || !formData.type || !formData.fuel || !formData.transmission ||
            !formData.seats || !formData.pricePerDay || !formData.registrationNo) {
            alert('Please fill in all required fields');
            return;
        }

        const submitData = new FormData();

        submitData.append('model', formData.model);
        submitData.append('type', formData.type);
        submitData.append('fuel', formData.fuel);
        submitData.append('transmission', formData.transmission);
        submitData.append('seats', parseInt(formData.seats));
        submitData.append('pricePerDay', parseInt(formData.pricePerDay));
        submitData.append('registrationNo', formData.registrationNo);
        submitData.append('mileage', formData.mileage);
        submitData.append('color', formData.color);
        submitData.append('isAvailable', formData.isAvailable);
        
        // Add GST fields - convert to numbers if they have values
        if (formData.gst) {
            submitData.append('gst', parseFloat(formData.gst));
        }
        if (formData.logistic) {
            submitData.append('logistic', parseFloat(formData.logistic));
        }

        // Add existing images (URLs) - send as JSON string or individual entries
        if (formData.existingImages.length > 0) {
            formData.existingImages.forEach((imageUrl) => {
                submitData.append('images', imageUrl);
            });
        }

        if (formData.newImages.length > 0) {
            formData.newImages.forEach((file) => {
                submitData.append('images', file);
            });
        }
        setLoading(true)

        try {
            const res = await updateCarById(selectedCarId, submitData);

            console.log(res)
            toast.success("Car Updated Successfully")
            dispatch(fetchAllCars({ page: currentPage, limit: itemsPerPage, search: search }))
            resetForm()
        } catch (error) {
            console.log('Update error:', error)
            toast.error("Failed to update car")
        } finally {
            setLoading(false)
            setIsEditModalOpen(false);
        }
    };


    const resetForm = () => {
        setFormData({
            model: '',
            type: '',
            fuel: '',
            seats: '',
            pricePerDay: '',
            existingImages: [],
            newImages: [],
            transmission: '',
            mileage: '',
            color: '',
            registrationNo: '',
            isAvailable: true,
            gst: '',
            logistic: ''
        });
    };

    const totalImages = formData.existingImages.length + formData.newImages.length;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Edit Car</h2>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model *
                            </label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., Toyota Camry"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Car Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fuel Type *
                            </label>
                            <select
                                name="fuel"
                                value={formData.fuel}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="PETROL">PETROL</option>
                                <option value="DIESEL">DIESEL</option>
                                <option value="ELECTRIC">ELECTRIC</option>
                                <option value="HYBRID">HYBRID</option>
                                <option value="CNG">CNG</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transmission *
                            </label>
                            <select
                                name="transmission"
                                value={formData.transmission}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="MANUAL">Manual</option>
                                <option value="AUTOMATIC">Automatic</option>
                                <option value="SEMI_AUTOMATIC">Semi Automatic</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seats *
                            </label>
                            <input
                                type="number"
                                name="seats"
                                value={formData.seats}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., 5"
                                min="1"
                                max="50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Per Hour *
                            </label>
                            <input
                                type="number"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., 2500"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GST (%)
                            </label>
                            <input
                                type="number"
                                name="gst"
                                value={formData.gst}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., 18"
                                min="0"
                                max="100"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logistic
                            </label>
                            <input
                                type="number"
                                name="logistic"
                                value={formData.logistic}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., 5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mileage
                            </label>
                            <input
                                type="text"
                                name="mileage"
                                value={formData.mileage}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., 15 km/l"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color
                            </label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., White"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Registration Number *
                            </label>
                            <input
                                type="text"
                                name="registrationNo"
                                value={formData.registrationNo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., MH-01-AB-1234"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Availability Status *
                            </label>
                            <select
                                name="isAvailable"
                                value={formData.isAvailable.toString()}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Car Images
                            </label>
                            <label className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm cursor-pointer">
                                <Plus className="w-4 h-4" />
                                Add Images
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Display existing and new images */}
                        {totalImages > 0 && (
                            <div className="space-y-3 mb-4">
                                <p className="text-sm text-gray-600">
                                    Images ({totalImages}) - {formData.existingImages.length} existing, {formData.newImages.length} new
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {/* Existing Images */}
                                    {formData.existingImages.map((imageUrl, index) => (
                                        <div key={`existing-${index}`} className="relative group">
                                            <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                                                <div className="mb-2 relative">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Existing ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(index)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-600 truncate">
                                                        Existing Image {index + 1}
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        Already uploaded
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* New Images */}
                                    {formData.newImages.map((file, index) => {
                                        const imageUrl = createSafeObjectURL(file);
                                        return (
                                            <div key={`new-${index}`} className="relative group">
                                                <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                                                    <div className="mb-2 relative">
                                                        {imageUrl && (
                                                            <img
                                                                src={imageUrl}
                                                                alt={`New ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded"
                                                                onLoad={() => {
                                                                    URL.revokeObjectURL(imageUrl);
                                                                }}
                                                            />
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(index)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-600 truncate" title={file?.name}>
                                                            {file?.name || 'Unknown file'}
                                                        </p>
                                                        <p className="text-xs text-blue-600">
                                                            New upload - {file?.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* File upload area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                            <label className="cursor-pointer">
                                <div className="space-y-2">
                                    <div className="text-gray-400">
                                        <Plus className="w-8 h-8 mx-auto" />
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        PNG, JPG, JPEG up to 10MB each
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setIsEditModalOpen(false);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors ${loading
                                ? 'bg-orange-300 cursor-not-allowed text-white'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                'Update Car'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCarModal