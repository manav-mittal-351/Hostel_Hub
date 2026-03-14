import { Bell, Search, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="h-16 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                </Button>
                
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="w-full bg-muted/50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
                </Button>
                
                <div className="h-8 w-px bg-border mx-2" />

                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full px-4 gap-2 font-medium"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    );
};

export default Header;
