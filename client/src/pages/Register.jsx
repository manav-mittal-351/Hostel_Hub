import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const res = await register(name, email, password, role);
        if (res.success) {
            navigate("/dashboard");
        } else {
            setError(res.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
            <Navbar />
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 z-0">
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary/30 rounded-full blur-[100px]" />
            </div>

            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="text-center mb-10">
                        <Link to="/" className="flex items-center gap-3 justify-center mb-8 group">
                            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 rotate-[-5deg] group-hover:rotate-0 transition-all duration-300">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-foreground tracking-tighter">
                                Hostel<span className="text-primary italic">HUB</span>
                            </span>
                        </Link>
                        <h1 className="text-4xl font-bold text-foreground tracking-tighter mb-3">Initialize Identity</h1>
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest opacity-60">Create your secure resident profile.</p>
                    </div>

                    <Card className="premium-card p-10 border-border/60 shadow-2xl shadow-primary/5 bg-white rounded-[2.5rem]">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold p-4 rounded-xl mb-8 text-center animate-in shake duration-300 uppercase tracking-wider">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="name" className="ml-1">Full Legal Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Johnathan Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-12 px-5 bg-secondary/10 border-border/40 focus:bg-white rounded-xl font-medium"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="ml-1">Institutional Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="h-12 px-5 bg-secondary/10 border-border/40 focus:bg-white rounded-xl font-medium"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="password" className="ml-1">Access Key</Label>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="h-12 px-5 pr-12 bg-secondary/10 border-border/40 focus:bg-white rounded-xl font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="role" className="ml-1">Account Role</Label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full h-12 px-4 bg-secondary/10 border border-border/40 focus:bg-white rounded-xl font-medium outline-none transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%220%200%2010%206%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
                                >
                                    <option value="student">Student Account</option>
                                    <option value="warden">Hostel Warden</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full h-14 bg-primary text-white hover:bg-primary/90 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/10 mt-6 active:scale-95 transition-all" disabled={loading}>
                                {loading ? "Recording Data..." : "Generate Identity"}
                            </Button>
                        </form>
                    </Card>

                    <p className="text-center mt-10 text-[13px] text-muted-foreground font-medium">
                        Already have an identity? <Link to="/login" className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-4">Sign In</Link>
                    </p>
                </div>
            </div>
            
            {/* Footer-like text */}
            <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none opacity-30 px-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">HostelHub Security Registry System — Integrity Validated</p>
            </div>
        </div>
    );
};

export default Register;
