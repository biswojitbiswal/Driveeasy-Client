// authUtils.js
import Cookies from 'js-cookie';
import { setAuth } from '../features/auth/authSlice';
import { refreshTokenLogin } from '../services/apiService';

export const initializeAuthFromCookies = async(dispatch) => {
  const token = Cookies.get('accessToken');
  const refToken = Cookies.get('refreshToken');
  const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  if (token && user) {
    dispatch(setAuth({
      user,
      token,
      reefreshToken: refToken,
      isAuthenticated: true
    }));
  } else if(refToken){
    
    try {
      const res = await refreshTokenLogin();

      Cookies.remove('refreshToken');

      Cookies.set('accessToken', res?.data?.accessToken, { expires: 1 });
      Cookies.set('refreshToken', res?.data?.refreshToken, { expires: 7 });
      Cookies.set('user', JSON.stringify(res?.data?.user), { expires: 1 })

      dispatch(setAuth({
        user: res?.data?.user,
        token: res?.data?.accessToken,
        refreshToken: res?.data?.refreshToken,
        isAuthenticated: true
      }));
    } catch (error) {
      console.log("Error Refresh Token: ", error)
    }
  }
};
