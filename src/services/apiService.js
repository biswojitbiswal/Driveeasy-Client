import api from "./api/api";
import API_END_POINTS from "./api/endpoint";

export const signup = async (userData) => {
  try {
    return await api.post(API_END_POINTS.AUTH.SIGNUP, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyCode = async (userInput) => {
  try {
    const url = API_END_POINTS.AUTH.VERIFY_CODE.replace(
      ":token",
      userInput.token
    );
    return await api.post(url, userInput, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resendCode = async (userInput) => {
  try {
    const url = API_END_POINTS.AUTH.RESEND_CODE.replace(":token", userInput);
    return await api.post(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signin = async (credentials) => {
  try {
    return await api.post(API_END_POINTS.AUTH.SIGNIN, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signout = async () => {
  try {
    return await api.post(API_END_POINTS.AUTH.SIGNOUT, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refreshTokenLogin = async () => {
  try {
    return await api.post(API_END_POINTS.AUTH.REFRESH_TOKEN, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    return await api.post(API_END_POINTS.AUTH.FORGOT_PASSWORD, { email });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async (token, body) => {
  try {
    const url = API_END_POINTS.AUTH.RESEND_CODE.replace(":token", token);
    return await api.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUser = async (body) => {
  try {
    return await api.patch(API_END_POINTS.AUTH.UPDATE_USER_ID, body);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addCar = async (carData) => {
  try {
    return await api.post(API_END_POINTS.CAR.ADD, carData);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCars = async (queryParams = {}) => {
  try {
    let url = API_END_POINTS.CAR.GET;
    const queryString = new URLSearchParams(queryParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await api.get(url);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCarStats = async () => {
  try {
    return await api.get(API_END_POINTS.CAR.STATS);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCarById = async (id) => {
  try {
    const url = API_END_POINTS.CAR.GET_BY_ID.replace(":id", id);
    return await api.get(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteCarById = async (id) => {
  try {
    const url = API_END_POINTS.CAR.DELETE_BY_ID.replace(":id", id);
    return await api.delete(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateCarById = async (id, body) => {
  try {
    const url = API_END_POINTS.CAR.UPDATE_BY_ID.replace(":id", id);
    return await api.patch(url, body);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
