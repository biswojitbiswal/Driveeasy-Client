const API_END_POINTS = {
    AUTH: {
        SIGNUP: '/auth/signup/',
        SIGNIN: '/auth/signin',
        SIGNOUT: '/auth/logout',
        VERIFY_CODE: '/auth/verify-code/:token',
        RESEND_CODE: '/auth/resend-code/:token',
        REFRESH_TOKEN: '/auth/refresh-token',
        CHANGE_PASSWORD: '/auth/change-password',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password/:token',
        UPDATE_USER_ID: '/auth'
    },

    CAR: {
        ADD: '/car',
        GET: '/car',
        STATS: '/car/stats',
        GET_BY_ID: '/car/:id',
        UPDATE_BY_ID: '/car/:id',
        DELETE_BY_ID: '/car/:id'
    },

    BOOKING: {
        CREATE: '/booking',
        GET: '/booking/:id',
        GET_ALL: '/booking',
        UPDATE_BY_ID: '/booking/:id',
        MY_BOOKINGS: '/booking/user/:userId',
        CANCEL_BOOKING: '/booking/cancel/:id'
    },

    PAYMENT: {
        CREATE: '/payment/create-order',
        VERIFY: '/payment/verify'
    },

    LIKE: {
        TOGGLE: '/like',
        REMOVE_LIKE: '/like/:carId'
    }
}

export default API_END_POINTS;