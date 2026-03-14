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
            scrolled ? "bg-white/80 backdrop-blur-xl border-[#D2D2D7]/50 py-3" : "bg-transparent border-transparent py-5"
        }`}>
            <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 rotate-[-5deg] group-hover:rotate-0 transition-all duration-300">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-black text-[#1D1D1F] tracking-tight">
                        HostelHUB
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-2">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="px-4 py-2 text-[13px] font-bold text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-4 w-px bg-[#D2D2D7] mx-2" />
                            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#F5F5F7] transition-all">
                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-[13px] font-bold text-[#1D1D1F]">{user.name.split(' ')[0]}</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-sm font-bold text-[#1D1D1F] hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register">
                                <Button className="bg-[#1D1D1F] hover:bg-black text-white h-10 px-6 rounded-full font-bold text-sm shadow-xl shadow-black/10">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={toggleMenu} className="hover:bg-[#F5F5F7]">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#D2D2D7] p-6 animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-4">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-lg font-bold text-[#1D1D1F]">
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="h-px bg-[#D2D2D7] my-2" />
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="text-lg font-bold text-[#1D1D1F]">
                                    My Profile
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="justify-start text-red-500 font-bold p-0 h-auto hover:bg-transparent"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-bold text-[#1D1D1F]">
                                    Sign In
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-[#1D1D1F] h-12 rounded-2xl font-bold">Get Started</Button>
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
