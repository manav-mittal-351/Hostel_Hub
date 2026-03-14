import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const res = await login(email, password);
        if (res.success) {
            navigate("/dashboard");
        } else {
            setError(res.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFD] flex flex-col relative overflow-hidden">
            <Navbar />
            
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-primary/10 mb-6">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black text-[#1D1D1F] tracking-tight mb-3">Sign In</h1>
                        <p className="text-[#86868B] font-medium">Continue to your HostelHub account</p>
                    </div>

                    <div className="apple-card bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-none">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold p-4 rounded-xl mb-6 text-center">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[#F5F5F7] border-none rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-[#F5F5F7] border-none rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 text-sm font-bold bg-[#1D1D1F] hover:bg-black text-white transition-all shadow-xl shadow-black/10 rounded-xl mt-4" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </div>

                    <p className="text-center mt-8 text-sm text-[#86868B] font-medium">
                        Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold">Create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
