import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import RootLayout from "./pages/RootLayout";
import Signin from "./pages/Signin";
import useAuth from "./config/Store";
import OAuthSuccess from "./pages/OAuthSuccess";

function UserLayout() {
  const isLoggedIn = useAuth((state) => state.authStatus);

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth/success" element={<OAuthSuccess />} />

          {/* Protected Routes: Only accessible when logged in */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard">
              <Route
                index
                element={
                  <div className="p-8 mt-20 text-center text-white">
                    Dashboard Home
                  </div>
                }
              />
              <Route
                path="profile"
                element={
                  <div className="p-8 mt-20 text-center text-white">
                    Profile Page
                  </div>
                }
              />
              <Route
                path="settings"
                element={
                  <div className="p-8 mt-20 text-center text-white">
                    Settings Page
                  </div>
                }
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
