import React, { useState } from 'react';
import { X, Plus, Trash2, Car } from 'lucide-react';
import { addCar } from '../../services/apiService';
import { useDispatch } from 'react-redux';
import { fetchAllCars } from '../../features/car/carSlice';
import { toast } from 'react-toastify'

const AddCarModal = ({ currentPage, itemsPerPage, search, setIsModalOpen }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        model: '',
        type: '',
        fuel: '',
        seats: '',
        pricePerDay: '',
        images: [''],
        transmission: '',
        mileage: '',
        color: '',
        registrationNo: '',
        gst: '',
        logistic: ''
    });


    const dispatch = useDispatch()

    const carTypes = [
        { value: 'SEDAN', label: 'Sedan' },
        { value: 'SUV', label: 'SUV' },
        { value: 'HATCHBACK', label: 'Hatchback' },
        { value: 'COUPE', label: 'Coupe' },
        { value: 'CONVERTIBLE', label: 'Convertible' },
        { value: 'MPV', label: 'MPV' },
        { value: 'TRUCK', label: 'Truck' },
        { value: 'VAN', label: 'Van' }
    ];

    const fuelTypes = [
        { value: 'PETROL', label: 'Petrol' },
        { value: 'DIESEL', label: 'Diesel' },
        { value: 'ELECTRIC', label: 'Electric' },
        { value: 'HYBRID', label: 'Hybrid' },
        { value: 'CNG', label: 'CNG' }
    ];

    const transmissionTypes = [
        { value: 'MANUAL', label: 'Manual' },
        { value: 'AUTOMATIC', label: 'Automatic' },
        { value: 'SEMI_AUTOMATIC', label: 'Semi-Automatic' }
    ];


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for GST percentage validation
        if (name === 'gst') {
            const numValue = parseFloat(value);
            if (value === '' || (numValue >= 0 && numValue <= 100)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
            return;
        }
        
        // Special handling for logistic number validation
        if (name === 'logistic') {
            const numValue = parseFloat(value);
            if (value === '' || numValue >= 0) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

            if (!isValidType) {
                alert(`${file.name} is not a valid image file`);
                return false;
            }
            if (!isValidSize) {
                alert(`${file.name} is too large. Maximum size is 10MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...validFiles]
            }));
        }

        e.target.value = '';
    };

    const removeImageFile = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };


    const createSafeObjectURL = (file) => {
        try {
            if (file instanceof File || file instanceof Blob) {
                return URL.createObjectURL(file);
            } else {
                console.error('Invalid file object for createObjectURL:', file);
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
        
        // Add GST and logistic fields to FormData
        if (formData.gst !== '') {
            submitData.append('gst', parseFloat(formData.gst));
        }
        if (formData.logistic !== '') {
            submitData.append('logistic', parseFloat(formData.logistic));
        }

        formData.images.forEach((file, index) => {
            submitData.append('images', file);
        });

        setLoading(true)
        try {
            const res = await addCar(submitData);

            toast.success("New Car Added Successfully")
            dispatch(fetchAllCars({ page: currentPage, limit: itemsPerPage, search: search }))
            resetForm()
        } catch (error) {
            console.log(error)
        } finally {
            setIsModalOpen(false);
            setLoading(false)
        }
    };

    const resetForm = () => {
        setFormData({
            model: '',
            type: '',
            fuel: '',
            seats: '',
            pricePerDay: '',
            images: [''],
            transmission: '',
            mileage: '',
            color: '',
            registrationNo: '',
            gst: '',
            logistic: ''
        });
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Add New Car</h2>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
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
                                <option value="">Select Type</option>
                                {carTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
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
                                <option value="">Select Fuel Type</option>
                                {fuelTypes.map(fuel => (
                                    <option key={fuel.value} value={fuel.value}>
                                        {fuel.label}
                                    </option>
                                ))}
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
                                <option value="">Select Transmission</option>
                                {transmissionTypes.map(transmission => (
                                    <option key={transmission.value} value={transmission.value}>
                                        {transmission.label}
                                    </option>
                                ))}
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
                                Logistic Charge
                            </label>
                            <input
                                type="number"
                                name="logistic"
                                value={formData.logistic}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., 500"
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

                        {/* Display selected files with previews */}
                        {formData.images.length > 0 && (
                            <div className="space-y-3 mb-4">
                                <p className="text-sm text-gray-600">Selected Images ({formData.images.length}):</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {formData.images.map((file, index) => {
                                        const imageUrl = createSafeObjectURL(file);

                                        return (
                                            <div key={index} className="relative group">
                                                <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                                                    {/* Image Preview */}
                                                    <div className="mb-2 relative">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded"
                                                                onLoad={() => {
                                                                    URL.revokeObjectURL(imageUrl);
                                                                }}
                                                            />
                                                        ) : (<></>)}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImageFile(index)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* File Info */}
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-600 truncate" title={file.name || 'Unknown file'}>
                                                            {file.name || 'Unknown file'}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
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
                                setIsModalOpen(false);
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
                                    Adding...
                                </>
                            ) : (
                                'Add Car'
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCarModal