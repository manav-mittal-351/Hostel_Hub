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

    return (
        <>
            <Routes>
                <Route path="/" element={
                    !user ? (
                        <div className="min-h-screen bg-[#FBFBFD] flex flex-col overflow-hidden">
                            <Navbar />
                            <main className="flex-1 relative flex items-center justify-center pt-20 px-4">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] opacity-50" />
                                
                                <div className="container max-w-7xl mx-auto grid lg:grid-cols-5 gap-16 items-center relative z-10">
                                    <div className="lg:col-span-3 space-y-10 text-left">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[13px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-4 duration-1000">
                                            The future of housing
                                        </div>
                                        
                                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-[#1D1D1F] leading-[1.05] animate-in fade-in slide-in-from-left-8 duration-1000">
                                            Elevate Your <br />
                                            <span className="text-primary italic">Campus Life</span>
                                        </h1>
                                        
                                        <p className="text-xl md:text-2xl text-[#86868B] font-medium leading-relaxed max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                                            A seamless, high-performance platform for modern student housing. Book, pay, and stay with absolute ease.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-5 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                                            <button 
                                                onClick={() => navigate('/register')}
                                                className="px-10 py-5 bg-[#1D1D1F] text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center gap-3 "
                                            >
                                                Get Started
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => navigate('/login')}
                                                className="px-10 py-5 bg-white text-[#1D1D1F] border border-[#D2D2D7] rounded-2xl font-bold text-lg hover:bg-[#F5F5F7] transition-all"
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="lg:col-span-2 relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
                                        <div className="relative z-10 rounded-[3rem] overflow-hidden border border-[#D2D2D7] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] bg-white p-3">
                                            <div className="aspect-[4/5] bg-[#F5F5F7] rounded-[2.25rem] overflow-hidden">
                                                <img 
                                                    src="/hostel_hero_image.png" 
                                                    alt="Modern Hostel" 
                                                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                                />
                                            </div>
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
    );
}

export default App;
