import React, { useState } from 'react';
import { Camera, Mail, Lock, User, Phone, MapPin, Edit3, Edit2, Settings, Edit2Icon, Edit } from 'lucide-react';
import ChangePassword from '../components/ChangePass';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../services/apiService'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuth } from '../features/auth/authSlice';
import Cookies from 'js-cookie';


export default function Profile() {
  const { user } = useSelector(state => state.auth)
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [show, setShow] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    profileImg: user.profileImg
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(profileData[field] || '');
  };

  const handleSavedAddresses = () => {
    navigate("/profile/addresses")
  };

  const handleSave = async (e, fieldName = editingField, value = editValue) => {
    e?.preventDefault?.();
    try {
      if (!fieldName) {
        console.warn('No field to update');
        return;
      }

      const formData = new FormData();

      // Debug log
      console.log("Saving field:", fieldName, "with value:", value, "type:", typeof value);

      if (fieldName === 'profileImg' && value instanceof File) {
        formData.append('profileImg', value);
      } else if (typeof value === 'string') {
        formData.append(fieldName, value.trim());
      } else {
        throw new Error(`Invalid value for ${fieldName}. Got: ${value}`);
      }

      for (const [key, val] of formData.entries()) {
        console.log(key, val);
      }

      const res = await updateUser(formData);
      console.log(res);

      dispatch(setAuth({
        user: res?.data
      }));

      Cookies.set('user', JSON.stringify(res?.data), { expires: 1 });

      toast.success("Profile Updated Successfully");

      setProfileData(prev => ({
        ...prev,
        [fieldName]: fieldName === 'profileImg'
          ? URL.createObjectURL(value)
          : value,
      }));

      setEditingField(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };




  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-orange-100 text-orange-600 p-6 rounded-t-lg flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Customer Settings</h1>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-b-lg shadow-sm">
          {/* Profile Picture Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-6">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="profilePicInput"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditValue(file); // optional if you use local state elsewhere
                      setEditingField('profileImg'); // optional

                      handleSave('profileImg', file); // ✅ send directly
                      e.target.value = '';
                    }
                  }}
                />
                <div className="w-28 h-28 bg-gray-200 border-4 border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                  {(!profileData.profileImg && !user.profileImg) ? (
                    <User className="w-10 h-10 text-gray-400" />
                  ) : (
                    <img
                      src={profileData.profileImg || user.profileImg}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <button
                  onClick={() => document.getElementById('profilePicInput').click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Picture</h2>
                <p className="text-gray-600 mb-2">Update your profile picture</p>
                <p className="text-sm text-gray-500">
                  Click the camera icon to upload a new profile picture
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Recommended size: 200×200 pixels, max 5MB
                </p>
              </div>
            </div>
          </div>



          {/* Personal Information Section */}
          <div className="p-6 space-y-6">
            {/* First Name */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 w-full">
                <User className="w-5 h-5 text-gray-400" />
                <div className='w-full'>
                  <div className='flex justify-between w-full'>
                    <div>
                      <h3 className="font-medium text-gray-800">First Name</h3>
                      <p className='text-gray-500 text-sm'>Update your First Name</p>
                    </div>
                    {editingField === 'firstName' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleSave(e)}
                          className="text-white bg-green-500 px-3 h-8 rounded hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-white bg-gray-400 px-3 h-8 rounded hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit('firstName')}
                        className="text-orange-500 border border-orange-200 p-2 rounded-md hover:bg-orange-100 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                  {editingField === 'firstName' ? (
                    <input
                      type="text"
                      className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-md text-gray-700"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.firstName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Last Name */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 w-full">
                <User className="w-5 h-5 text-gray-400" />
                <div className="w-full">
                  <div className="flex justify-between w-full">
                    <div>
                      <h3 className="font-medium text-gray-800">Last Name</h3>
                      <p className="text-gray-500 text-sm">Update your Last Name</p>
                    </div>
                    {editingField === 'lastName' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleSave(e)}
                          className="text-white bg-green-500 px-3 h-8 rounded hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-white bg-gray-400 px-3 h-8 rounded hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit('lastName')}
                        className="text-orange-500 border border-orange-200 p-2 rounded-md hover:bg-orange-100 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                  {editingField === 'lastName' ? (
                    <input
                      type="text"
                      className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-md text-gray-700"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.lastName}</p>
                  )}
                </div>
              </div>
            </div>


            {/* Email Address */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 w-full">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="w-full">
                  <div className="flex justify-between w-full">
                    <div>
                      <h3 className="font-medium text-gray-800">Email Address</h3>
                      <p className="text-gray-500 text-sm">Update your account email address</p>
                    </div>
                    {editingField === 'email' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleSave(e)}
                          className="text-white bg-green-500 px-3 h-8 rounded hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-white bg-gray-400 px-3 h-8 rounded hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit('email')}
                        className="text-orange-500 border border-orange-200 p-2 rounded-md hover:bg-orange-100 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                  {editingField === 'email' ? (
                    <input
                      type="email"
                      className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-md text-gray-700"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800 mt-1">{profileData.email}</p>
                  )}
                </div>
              </div>
            </div>


            {/* Phone Number */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 w-full">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="w-full">
                  <div className="flex justify-between w-full">
                    <div>
                      <h3 className="font-medium text-gray-800">Phone Number</h3>
                      <p className="text-gray-500 text-sm">Update your phone number</p>
                    </div>
                    {editingField === 'phone' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleSave(e)}
                          className="text-white bg-green-500 px-3 h-8 rounded hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-white bg-gray-400 px-3 h-8 rounded hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit('phone')}
                        className="text-orange-500 border border-orange-200 p-2 rounded-md hover:bg-orange-100 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                  {editingField === 'phone' ? (
                    <input
                      type="text"
                      className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-md text-gray-700"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800 mt-1">{profileData.phone}</p>
                  )}
                </div>
              </div>
            </div>


            {/* Password */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-800">Password</h3>
                  <p className="text-gray-600 text-sm">Change your account password</p>
                </div>
              </div>
              <button
                onClick={() => setShow(true)}
                className="text-orange-500 border border-orange-200 p-2 rounded-md hover:bg-orange-100 px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>

            {/* Saved Addresses */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-800">Saved Addresses</h3>
                  <p className="text-gray-600 text-sm">Manage your saved pickup and drop-off locations</p>
                </div>
              </div>
              <button
                onClick={handleSavedAddresses}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <MapPin className="w-4 h-4" />
                View Addresses
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Need help? Contact our customer support team</p>
        </div>
      </div>
      {
        show && <ChangePassword show={show} setShow={setShow} />
      }
    </div>
  );
}