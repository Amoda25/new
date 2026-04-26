import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RoleRoute from "./roleRoutes";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import TechnicianLayout from "../layouts/TechnicianLayout";
import TicketForm from "../components/tickets/TicketForm";
// Home page
import HomePage from "../pages/public/HomePage";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OAuthSuccess from "../pages/auth/OAuthSuccess";

// Error pages
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";

// User pages
import UserDashboard from "../pages/user/UserDashboard";
import ResourceCataloguePage from "../pages/user/ResourceCataloguePage";
import ResourceDetailsPage from "../pages/user/ResourceDetailsPage";
import MyBookingsPage from "../pages/user/MyBookingsPage";
import MyTicketsPage from "../pages/user/MyTicketsPage";
import TicketDetailsPage from "../pages/user/TicketDetailsPage";
import ProfilePage from "../pages/user/ProfilePage";



// Technician pages
import TechnicianDashboard from "../pages/technician/TechnicianDashboard";
import AssignedTicketsPage from "../pages/technician/AssignedTicketsPage";
import CreateTicketPage from "../pages/technician/CreateTicketPage";
import TechnicianTicketDetailsPage from "../pages/technician/TechnicianTicketDetailsPage";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageResourcesPage from "../pages/admin/ManageResourcesPage";
import BookingApprovalsPage from "../pages/admin/BookingApprovalsPage";
import AdminTicketsPage from "../pages/admin/AdminTicketsPage";
import AdminTicketDetailsPage from "../pages/admin/AdminTicketDetailsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* User */}
      <Route
        path="/user"
        element={
          <RoleRoute allowedRoles={["USER"]}>
            <UserLayout />
          </RoleRoute>
        }
      >
        <Route path="home" element={<UserDashboard />} />
        <Route path="resources" element={<ResourceCataloguePage />} />
        <Route path="resources/:id" element={<ResourceDetailsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="tickets" element={<MyTicketsPage />} />
        <Route path="tickets/create" element={<TicketForm />} />
        <Route path="tickets/:id" element={<TicketDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>



      {/* Technician */}
      <Route
        path="/technician"
        element={
          <RoleRoute allowedRoles={["TECHNICIAN"]}>
            <TechnicianLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<TechnicianDashboard />} />
        <Route path="tickets" element={<AssignedTicketsPage />} />
        <Route path="tickets/create" element={<CreateTicketPage />} />
        <Route path="tickets/:id" element={<TechnicianTicketDetailsPage />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="resources" element={<ManageResourcesPage />} />
        <Route path="bookings" element={<BookingApprovalsPage />} />
        <Route path="tickets" element={<AdminTicketsPage />} />
        <Route path="tickets/:id" element={<AdminTicketDetailsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}