import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { X } from "lucide-react";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white z-[60] transform lg:hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="absolute top-4 right-4 group">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
                <Sidebar />
            </div>

            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
