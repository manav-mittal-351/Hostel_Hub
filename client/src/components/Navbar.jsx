import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { LogOut, Menu, X, Users, LayoutDashboard, BedDouble, CreditCard, FileText, AlertCircle, User as UserIcon } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/room-allotment", icon: BedDouble, label: "Rooms" },
        { path: "/payments", icon: CreditCard, label: "Payments" },
        { path: "/gate-pass", icon: FileText, label: "Gatepass" },
        { path: "/complaints", icon: AlertCircle, label: "Support" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
            scrolled ? "bg-white/90 backdrop-blur-xl border-border/50 py-3 shadow-sm" : "bg-transparent border-transparent py-5"
        }`}>
            <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/20 rotate-[-8deg] group-hover:rotate-0 transition-all duration-500 scale-110 group-hover:scale-125">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-foreground tracking-[ -0.05em] uppercase leading-none">
                            Hostel<span className="text-primary italic">HUB</span>
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/50 tracking-[0.3em] uppercase mt-1">Management Portal</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-2">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-secondary/20"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-4 w-px bg-border mx-2" />
                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-secondary/30 transition-all border border-transparent hover:border-border/50">
                                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <UserIcon className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-[13px] font-bold text-foreground tracking-tight">{user.name.split(' ')[0]}</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register">
                                <Button className="bg-primary hover:bg-primary/90 text-white h-11 px-8 rounded-xl font-bold text-[12px] uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-95">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={toggleMenu} className="hover:bg-secondary/40 rounded-xl">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-4 right-4 bg-white border border-border mt-3 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top-4">
                    <div className="flex flex-col gap-4">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-md font-bold text-foreground flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/20">
                                        <link.icon className="h-5 w-5 text-primary" />
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="h-px bg-border my-2" />
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="text-md font-bold text-foreground flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/20">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                    My Profile
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="justify-start text-red-500 font-bold p-3 h-auto hover:bg-red-50 rounded-xl"
                                >
                                    <LogOut className="h-5 w-5 mr-3" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="p-3 text-center text-sm font-bold uppercase tracking-widest text-foreground hover:bg-secondary/20 rounded-xl">
                                    Sign In
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-primary h-14 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/10">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
