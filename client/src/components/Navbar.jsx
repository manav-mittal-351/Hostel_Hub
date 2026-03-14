import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { LayoutDashboard, LogOut, Menu, X, Users, BedDouble, CreditCard, AlertCircle, FileText, User as UserIcon } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/room-allotment", icon: BedDouble, label: "Rooms" },
        { path: "/payments", icon: CreditCard, label: "Payments" },
        { path: "/gate-pass", icon: FileText, label: "Gate Pass" },
        { path: "/non-disciplinary", icon: FileText, label: "Actions" },
        { path: "/complaints", icon: AlertCircle, label: "Complaints" },
        { path: "/profile", icon: UserIcon, label: "Profile" },
    ];

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl glass-panel px-6 py-3 transition-all duration-300">
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        HostelConnect
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <NavLink key={link.path} to={link.path} icon={link.icon}>
                                    {link.label}
                                </NavLink>
                            ))}
                            <div className="h-6 w-px bg-white/10 mx-2" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="ghost" className="hover:bg-white/5">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={toggleMenu} className="hover:bg-white/5">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden pt-4 pb-2 animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-2">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <NavLink key={link.path} to={link.path} icon={link.icon} onClick={toggleMenu}>
                                        {link.label}
                                    </NavLink>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { handleLogout(); toggleMenu(); }}
                                    className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 px-4"
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 p-2">
                                <Link to="/login" onClick={toggleMenu}>
                                    <Button variant="ghost" className="w-full justify-start">Login</Button>
                                </Link>
                                <Link to="/register" onClick={toggleMenu}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

const NavLink = ({ to, children, icon: Icon, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/5 transition-all duration-200"
    >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
    </Link>
)

export default Navbar;
