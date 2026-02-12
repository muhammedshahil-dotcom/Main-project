import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import UserList from "../pages/UserList";
import AddMovie from "../pages/AddMovie";
import EditMovie from "../pages/EditMovie";
import MovieDetails from "../pages/MovieDetails";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Success from "../pages/Success";
import PaymentSuccess from "../pages/PaymentSuccess";
import NotFound from "../pages/NotFound";
import ManageMovies from "../pages/Admin/ManageMovies";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageReviews from "../pages/Admin/ManageReviews";
import MyBookings from "../pages/MyBookings";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/success" element={<Success />} />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute role="admin">
              <ManageMovies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-movie"
          element={
            <ProtectedRoute role="admin">
              <AddMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-movie/:id"
          element={
            <ProtectedRoute role="admin">
              <EditMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute role="admin">
              <ManageReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
