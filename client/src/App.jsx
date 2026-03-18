import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import PrivateRoute from "@/components/PrivateRoute";
import RoomAllotment from "@/pages/RoomAllotment";
import Payments from "@/pages/Payments";
import Complaints from "@/pages/Complaints";
import Profile from "@/pages/Profile";
import GatePass from "@/pages/GatePass";
import NonDisciplinaryActions from "@/pages/NonDisciplinaryActions";
import LandingPage from "@/pages/LandingPage";

import { Toaster } from "@/components/ui/sonner";

import { NotificationProvider } from "@/context/NotificationContext";

function App() {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <NotificationProvider>
            <Routes>
                <Route path="/" element={
                    !user ? (
                        <LandingPage />
                    ) : (
                        <Navigate to="/dashboard" replace />
                    )
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/room-allotment" element={<RoomAllotment />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/complaints" element={<Complaints />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/gate-pass" element={<GatePass />} />
                    <Route path="/non-disciplinary" element={<NonDisciplinaryActions />} />
                </Route>
            </Routes>
            <Toaster />
        </NotificationProvider>
    );
}

export default App;
