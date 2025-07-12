import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Cookies from 'js-cookie';
import { signout } from '../services/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
        const res = await signout();

        toast.success('Sign out successfully');
        
        dispatch(logout());
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');

        navigate('/signin');
        } catch (error) {
            console.error('Logout error:', error);
        }
        
    }
    
    return (
        <>
            <button onClick={handleLogout} className="text-gray-600 font-medium hover:text-orange-700 font-medium">Sign Out</button>
        </>
    )
}

export default Logout
