import React, { useState } from 'react';
import { Camera, Upload, User, Phone, Award, FileText, ChevronRight } from 'lucide-react';
import { updateUser } from '../../services/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


const AgentProfileForm = () => {
    const [formData, setFormData] = useState({
        phone: '',
        licenseNo: '',
        experience: '',
        identityProof: null,
        profileImg: null
    });
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const [profilePreview, setProfilePreview] = useState(null);

    const dispatch = useDispatch()
    const navigate = useNavigate()


// TODO: fix the ui that after agent profile completion the agent will redirect to the agent page
    const user = useSelector(state => state.auth.user);
    console.log(user)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: file
            }));

            // Create preview for profile image
            if (fieldName === 'profileImg') {
                const reader = new FileReader();
                reader.onload = (e) => setProfilePreview(e.target.result);
                reader.readAsDataURL(file);
            }

            // Clear error
            if (errors[fieldName]) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.licenseNo.trim()) {
            newErrors.licenseNo = 'License number is required';
        }

        if (!formData.experience.trim()) {
            newErrors.experience = 'Experience is required';
        }

        if (!formData.identityProof) {
            newErrors.identityProof = 'Identity proof document is required';
        }

        if (!formData.profileImg) {
            newErrors.profileImg = 'Profile image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data = new FormData();

        data.append('phone', formData.phone);
        data.append('licenseNo', formData.licenseNo);
        data.append('experience', formData.experience);

        if (formData.profileImg) {
            data.append('profileImg', formData.profileImg);
        }

        if (formData.identityProof) {
            data.append('identityProof', formData.identityProof);
        }

        setLoading(true)
        try {
            const res = await updateUser(data);

            navigate("/agent")
            toast.success("Profile Completed, Now You Can Access Your Dashboard");
        } catch (error) {
            console.log("Profile Complete Error: ", error);
            throw error;
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600">Please provide the following information to complete your agent registration</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="space-y-6">

                        {/* Profile Image Upload */}
                        <div className="text-center">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-orange-200 overflow-hidden">
                                    {profilePreview ? (
                                        <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Camera className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
                                    <Upload className="w-5 h-5 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'profileImg')}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Upload your profile photo</p>
                            {errors.profileImg && <p className="text-red-500 text-sm mt-1">{errors.profileImg}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="inline w-4 h-4 mr-2" />
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">+91</span>
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* License Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Award className="inline w-4 h-4 mr-2" />
                                License Number
                            </label>
                            <input
                                type="text"
                                name="licenseNo"
                                value={formData.licenseNo}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${errors.licenseNo ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your license number"
                            />
                            {errors.licenseNo && <p className="text-red-500 text-sm mt-1">{errors.licenseNo}</p>}
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience (Years)
                            </label>
                            <select
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${errors.experience ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select your experience</option>
                                <option value="0-1">0-1 years</option>
                                <option value="1-3">1-3 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5-10">5-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                        </div>

                        {/* Identity Proof */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="inline w-4 h-4 mr-2" />
                                Identity Proof Document
                            </label>
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${errors.identityProof ? 'border-red-500' : 'border-gray-300 hover:border-orange-400'
                                }`}>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, 'identityProof')}
                                    className="hidden"
                                    id="identityProof"
                                />
                                <label htmlFor="identityProof" className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        {formData.identityProof ? formData.identityProof.name : 'Click to upload identity proof'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                </label>
                            </div>
                            {errors.identityProof && <p className="text-red-500 text-sm mt-1">{errors.identityProof}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Complete Profile</span>
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-600">
                    <p>By completing your profile, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
};

export default AgentProfileForm;