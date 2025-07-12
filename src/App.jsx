import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import OTPVerification from './pages/Verify-code'
import Signin from './pages/Signin'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import { useDispatch } from 'react-redux'
import { initializeAuthFromCookies } from './utils/authutils'
import { useEffect } from 'react'
import ResetPass from './pages/ResetPass'
import { useSelector } from 'react-redux'
import Admin from './pages/AdminDashboard/Admin'
import AdminAgent from './pages/AdminDashboard/AdminAgent'
import AdminUser from './pages/AdminDashboard/AdminUser'
import AdminVehicle from './pages/AdminDashboard/AdminVehicle'
import AdminSetting from './pages/AdminDashboard/AdminSetting'
import AdminOrder from './pages/AdminDashboard/AdminOrder'
import AdminDashboard from './pages/AdminDashboard/Admin'
import AgentDashboard from './pages/Agent/AgentDashboard'
import Agent from './pages/Agent/Agent'
import AgentOrder from './pages/Agent/AgentOrder'
import AgentSetting from './pages/Agent/AgentSetting'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import AgentProfileForm from './pages/Agent/AgentProfile'
import BookingSummary from './pages/BookingSummary'
import PaymentSuccess from './pages/PaymentSuccess'
import MyBookings from './pages/MyBookings'
import BookingDetailed from './pages/BookingDetailed'
import Profile from './pages/Profile'
import About from './pages/About'

const AdminProtectedRoute = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated || role !== 'ADMIN') {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

const AgentProtectedRoute = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated || role !== 'AGENT') {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

const UserProtectedRoute = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  if (!isAuthenticated || role !== 'USER') {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

const AuthOnlyRoute = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    if (role === 'AGENT') {
      if (!user?.agentProfileComplete) {
        return <Navigate to="/agent/profile" replace />;
      } else {
        return <Navigate to="/agent" replace />;
      }
    }
    if (role === 'USER') {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

const AgentProfileRoute = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);

  if (!isAuthenticated || role !== 'AGENT') {
    return <Navigate to="/signin" replace />;
  }

  if (user?.agentProfileComplete) {
    return <Navigate to="/agent" replace />;
  }

  return <AgentProfileForm />;
}

const AgentDashboardRoute = () => {
  const user = useSelector((state) => state.auth?.user);

  if (!user?.agentProfileComplete) {
    return <Navigate to="/agent/profile" replace />;
  }

  return <Outlet />;
}

const HomeRoute = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }

    if (role === 'AGENT') {
      return <Navigate to="/agent" replace />;
    }
  }

  return <Home />;
}

const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

const router = createBrowserRouter([
  {
    element: <LayoutWrapper />,
    children: [
      {
        element: <AuthOnlyRoute />,
        children: [
          {
            path: '/signup',
            element: <Signup />,
          },
          {
            path: '/signin',
            element: <Signin />,
          },
          {
            path: '/reset-password/:token',
            element: <ResetPass />,
          },
          {
            path: '/verification/:token',
            element: <OTPVerification />,
          },
        ],
      },

      {
        path: '/',
        element: <HomeRoute />,
      },
      {
        path: "/cars",
        element: <Cars />
      },
      {
        path: "/about",
        element: <About />
      },

      {
        element: <UserProtectedRoute />,
        children: [
          {
            path: '/profile',
            element: <Profile />
          },
          {
            path: '/car/:id',
            element: <CarDetails />
          },
          {
            path: '/booking/:id',
            element: <BookingSummary />
          },
          {
            path: '/payment-success',
            element: <PaymentSuccess />
          },
          {
            path: '/my-bookings',
            element: <MyBookings />
          },
          {
            path: '/my-bookings/:bookingId',
            element: <BookingDetailed />
          }
        ]
      },

      {
        path: '/agent',
        element: <AgentProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: <AgentProfileRoute />
          },
          {
            element: <AgentDashboardRoute />,
            children: [
              {
                index: true,
                element: <Agent />
              },
              {
                path: 'dashboard',
                element: <AgentDashboard />,
              },
              {
                path: 'orders',
                element: <AgentOrder />,
              },
              {
                path: 'settings',
                element: <AgentSetting />,
              },
            ]
          }
        ],
      },

      {
        path: "/admin",
        element: <AdminProtectedRoute />,
        children: [
          {
            index: true,
            element: <Admin />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <AdminUser />,
          },
          {
            path: "agents",
            element: <AdminAgent />,
          },
          {
            path: "orders",
            element: <AdminOrder />,
          },
          {
            path: "vehicles",
            element: <AdminVehicle />,
          },
          {
            path: "settings",
            element: <AdminSetting />,
          },
        ],
      },

      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ]
  }
]);

function App() {
  const dispatch = useDispatch();
  const isInitialized = useSelector(state => state.auth.isInitialized);

  useEffect(() => {
    const initAuth = async () => {
      await initializeAuthFromCookies(dispatch);
    };
    initAuth();
  }, [dispatch]);

  if (!isInitialized) return <div>Loading...</div>;

  return <RouterProvider router={router} />
}

export default App