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
        { path: "/non-disciplinary", icon: ShieldAlert, label: "Dues & Actions" },
        { path: "/complaints", icon: AlertCircle, label: "Complaints" },
        { path: "/profile", icon: UserIcon, label: "Profile" },
    ];

    const adminLinks = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
        { path: "/room-allotment", icon: BedDouble, label: "Manage Rooms" },
        { path: "/payments", icon: CreditCard, label: "Fee Records" },
        { path: "/gate-pass", icon: FileText, label: "Gate Authorization" },
        { path: "/non-disciplinary", icon: ShieldAlert, label: "Financial Dues" },
        { path: "/complaints", icon: AlertCircle, label: "Complaints" },
        { path: "/profile", icon: UserIcon, label: "Account" },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-border z-40 hidden lg:flex flex-col">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Hostel<span className="text-primary">Hub</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2 mt-4">
                    Main Menu
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
                            <Icon className="h-5 w-5" />
                            <span>{link.label}</span>
                            {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="apple-card p-4 bg-muted/50 border-none flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate uppercase">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
