import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import RootLayout from "./pages/RootLayout";
import Signin from "./pages/auth/Signin";
import useAuth from "./store/AuthStore";
import OAuthSuccess from "./pages/auth/OAuthSuccess";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import Problemset from "./pages/problem/Problemset";
import ProblemInfo from "./pages/problem/ProblemInfo";

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
          <Route path="/oauth/success" element={<OAuthSuccess />} />
          <Route path="/problemset" element={<Problemset />} />
          <Route path="/problemset/info" element={<ProblemInfo />} />

          {/* Protected Routes: Only accessible when logged in */}
          <Route element={<UserLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard">
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
