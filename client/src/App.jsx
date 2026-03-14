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

import { Toaster } from "@/components/ui/sonner";

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

    const handleGetStarted = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            navigate("/register");
        }
    };

    const handleViewDemo = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <>
            <Routes>
                <Route path="/" element={
                    !user ? (
                        <div className="min-h-screen bg-background flex flex-col overflow-hidden">
                            <Navbar />
                            <main className="flex-1 relative flex items-center justify-center pt-24 px-4">
                                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
                                
                                <div className="container max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                                    <div className="space-y-8 text-left max-w-2xl">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-1000">
                                            Smart Hostel Management
                                        </div>
                                        
                                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-in fade-in slide-in-from-left-8 duration-1000">
                                            The Modern Way To <br />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent text-glow">
                                                Manage Hostels
                                            </span>
                                        </h1>
                                        
                                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                                            Please login or create an account to start managing your hostel stay. 
                                            Access rooms, payments, and support all in one place.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                                            <button 
                                                onClick={() => navigate('/register')}
                                                className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group"
                                            >
                                                Get Started
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => navigate('/login')}
                                                className="px-8 py-4 glass-panel text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                                            >
                                                Login Now
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
                                        <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl glass-panel p-2">
                                            <img 
                                                src="/hostel_hero_image.png" 
                                                alt="Modern Hostel" 
                                                className="rounded-[2rem] w-full h-auto object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
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
        </>
    )
}

export default App
