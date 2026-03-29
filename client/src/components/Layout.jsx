import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { X } from "lucide-react";
import ChatAssistant from "./ChatAssistant";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Drawer */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <div className={`fixed inset-y-0 left-0 bg-white z-[60] transform lg:hidden transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <div className="h-full relative overflow-y-auto">
                    <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="absolute top-6 right-4 p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Desktop Persistent Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-40">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen lg:pl-64 w-full min-w-0">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-[1600px] mx-auto overflow-x-hidden">
                    <div className="animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
            <ChatAssistant />
        </div>
    );
};

export default Layout;
