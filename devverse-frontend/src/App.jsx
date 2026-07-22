import { useEffect } from "react";
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
import Layout from "./pages/admin/Layout";
import DashboardAdmin from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import UserProfile from "./pages/admin/UserProfile";
import Problems from "./pages/admin/Problems";
import Companies from "./pages/admin/Companies";
import DailyChallengesAdmin from "./pages/admin/DailyChallenges";
import Tags from "./pages/admin/Tags";

function UserLayout() {
  const isLoggedIn = useAuth((state) => state.authStatus);

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
}

function App() {
  const authStatus = useAuth((state) => state.authStatus);
  const verifyAuth = useAuth((state) => state.verifyAuth);

  useEffect(() => {
    if (authStatus) {
      verifyAuth();
    }
  }, []);

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
          <Route path="/problem/:identifier" element={<ProblemInfo />} />

          {/* Admin Routes: Only accessible by ADMIN users */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserProfile />} />
            <Route path="problems" element={<Problems />} />
            <Route path="tags" element={<Tags />} />
            <Route path="companies" element={<Companies />} />
            <Route path="daily-challenges" element={<DailyChallengesAdmin />} />
          </Route>

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
