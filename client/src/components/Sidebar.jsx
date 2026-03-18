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

    const wardenLinks = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Warden Overview" },
        { path: "/room-allotment", icon: BedDouble, label: "Room Status" },
        { path: "/gate-pass", icon: FileText, label: "Gate Passes" },
        { path: "/complaints", icon: AlertCircle, label: "Student Complaints" },
        { path: "/profile", icon: UserIcon, label: "Profile" },
    ];

    const adminLinks = [
        { path: "/dashboard", icon: LayoutDashboard, label: "System Admin" },
        { path: "/room-allotment", icon: BedDouble, label: "Inventory" },
        { path: "/payments", icon: CreditCard, label: "Financials" },
        { path: "/gate-pass", icon: FileText, label: "Access Control" },
        { path: "/non-disciplinary", icon: ShieldAlert, label: "Records" },
        { path: "/complaints", icon: AlertCircle, label: "Petitions" },
        { path: "/profile", icon: UserIcon, label: "Config" },
    ];

    let links = studentLinks;
    if (user?.role === 'admin') links = adminLinks;
    if (user?.role === 'warden') links = wardenLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-border z-40 hidden lg:flex flex-col">
            <div className="px-7 py-8">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:bg-primary/90 transition-all duration-300 rotate-[-4deg] group-hover:rotate-0">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-black text-foreground tracking-tighter uppercase italic">
                        Hostel<span className="text-primary not-italic">Hub</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <div className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] px-4 mb-4 mt-2">
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
                            <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
                            <span className="font-semibold tracking-tight">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <Link to="/profile" className="premium-card p-3 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex items-center gap-3 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shadow-lg transition-transform group-hover:scale-105 ${user?.role === 'admin' ? 'bg-primary shadow-primary/20' : user?.role === 'warden' ? 'bg-amber-600 shadow-amber-600/20' : 'bg-primary shadow-primary/20'}`}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="text-[14px] font-bold text-foreground truncate leading-none mb-1 group-hover:text-primary transition-colors">{user?.name}</p>
                        <p className={`text-[10px] truncate uppercase font-bold tracking-widest ${user?.role === 'warden' ? 'text-amber-600/80' : 'text-muted-foreground/60'}`}>{user?.role} Account</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
