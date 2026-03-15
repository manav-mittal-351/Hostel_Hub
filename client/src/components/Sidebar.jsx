import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, 
    BedDouble, 
    CreditCard, 
    AlertCircle, 
    FileText, 
    User as UserIcon,
    ShieldAlert,
    Users,
    ChevronRight
} from "lucide-react";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const studentLinks = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/room-allotment", icon: BedDouble, label: "My Room" },
        { path: "/payments", icon: CreditCard, label: "Payments" },
        { path: "/gate-pass", icon: FileText, label: "Gate Pass" },
        { path: "/non-disciplinary", icon: ShieldAlert, label: "Student Records" },
        { path: "/complaints", icon: AlertCircle, label: "Complaints" },
        { path: "/profile", icon: UserIcon, label: "Profile" },
    ];

    const adminLinks = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
        { path: "/room-allotment", icon: BedDouble, label: "Manage Rooms" },
        { path: "/payments", icon: CreditCard, label: "Fee Records" },
        { path: "/gate-pass", icon: FileText, label: "Gate Authorization" },
        { path: "/non-disciplinary", icon: ShieldAlert, label: "Student Records" },
        { path: "/complaints", icon: AlertCircle, label: "Complaints" },
        { path: "/profile", icon: UserIcon, label: "Account" },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-border z-40 hidden lg:flex flex-col">
            <div className="px-7 py-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:bg-primary/90 transition-all duration-300">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-foreground tracking-tight">
                        HostelHub
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3 mt-4">
                    Product
                </div>
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`sidebar-link ${
                                isActive 
                                ? "sidebar-link-active" 
                                : "sidebar-link-inactive"
                            }`}
                        >
                            <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="premium-card p-3 border-none bg-secondary/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[13px] font-semibold text-foreground truncate">{user?.name}</p>
                        <p className="text-[10px] text-muted-foreground/80 truncate uppercase font-medium">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
