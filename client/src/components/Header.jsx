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
        <header className="h-16 border-b border-border bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="lg:hidden rounded-lg" onClick={onMenuClick}>
                    <Menu className="h-5 w-5 text-muted-foreground" />
                </Button>
                
                <div className="relative max-w-sm w-full hidden md:block group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                        <Search className="h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search records..." 
                        className="w-full bg-secondary/15 border border-border/40 hover:border-border/60 focus:bg-white focus:border-primary/30 rounded-xl py-2.5 pl-14 pr-4 text-[13px] transition-all outline-none placeholder:text-muted-foreground/40 shadow-none border-dashed hover:border-solid hover:bg-secondary/10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-secondary/50 transition-colors">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
                </Button>
                
                <div className="h-4 w-px bg-border mx-2" />

                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl px-3 gap-2 text-[13px] font-medium"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    );
};

export default Header;
