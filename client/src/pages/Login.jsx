import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await login(email, password);
        if (res.success) {
            navigate("/dashboard");
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            <Navbar />
            
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse delay-1000" />

            <div className="flex-1 flex items-center justify-center p-4 pt-24 relative z-10">
                <Card className="w-full max-w-md glass-panel border-white/10 animate-in fade-in zoom-in duration-500 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-center text-white tracking-tight">Welcome Back</CardTitle>
                        <CardDescription className="text-center text-muted-foreground/80">
                            Enter your credentials to access your hostel account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/80 ml-1">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="student@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-xl h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white/80 ml-1">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-xl h-12 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 rounded-xl mt-4">
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8">
                        <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-white/10 flex-1" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">New Student?</span>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                            Don't have an account? <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">Create Account</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Login;
