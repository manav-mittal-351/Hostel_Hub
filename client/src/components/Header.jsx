import { Bell, Search, LogOut, Menu, X, Check, Info, AlertTriangle, BedDouble, User as UserIcon, ArrowRight, Sparkles, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useNotifications } from "@/context/NotificationContext";
import { NotificationCenter } from "./NotificationCenter";
import SmartAssistant from "./SmartAssistant";

const Header = ({ onMenuClick }) => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");
    const [searchResults, setSearchResults] = useState({ students: [], rooms: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 1) {
                setIsSearching(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const endpoint = `/api/search?query=${searchQuery}&category=${searchCategory}`;
                    const { data } = await axios.get(endpoint, config);
                    setSearchResults(data);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults({ students: [], rooms: [] });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, searchCategory, user?.token]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="h-20 border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6 flex-1">
                <Button variant="ghost" size="icon" className="lg:hidden rounded-lg hover:bg-secondary/50" onClick={onMenuClick}>
                    <Menu className="h-5 w-5 text-muted-foreground" />
                </Button>
                
                {/* Global Search Hub - ONLY for Admins & Wardens */}
                {(user?.role === 'admin' || user?.role === 'warden') && (
                    <div className="relative max-w-xl w-full hidden md:block group" ref={searchRef}>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                            {isSearching ? (
                                <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                                <Search className="h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-all duration-300" />
                            )}
                        </div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            placeholder="Find students or rooms..." 
                            className="w-full bg-secondary/15 backdrop-blur-sm border border-border/20 hover:bg-white hover:border-primary/20 focus:bg-white focus:border-primary/40 rounded-2xl py-3.5 pl-16 pr-6 text-[14px] font-medium transition-all outline-none placeholder:text-muted-foreground/40 shadow-sm"
                        />
                        
                        {/* Smart Search Results Dropdown */}
                        {showResults && (searchQuery.length > 0 || isSearching) && (
                            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white/95 backdrop-blur-2xl border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                                <div className="max-h-[500px] overflow-y-auto">
                                    {/* Quick Navigation Intents */}
                                    {(searchQuery.toLowerCase().includes('room') || 
                                      searchQuery.toLowerCase().includes('student') || 
                                      searchQuery.toLowerCase().includes('help') || 
                                      searchQuery.toLowerCase().includes('pay')) && (
                                        <div className="p-4 bg-primary/5 border-b border-border/50">
                                            <div className="flex items-center gap-3 text-primary">
                                                <div className="bg-primary text-white p-2 rounded-xl">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[12px] font-black uppercase tracking-widest leading-none mb-1">Quick Link</p>
                                                    <button 
                                                        onClick={() => {
                                                            const q = searchQuery.toLowerCase();
                                                            if (q.includes('room')) navigate('/room-allotment');
                                                            else if (q.includes('student')) navigate('/students');
                                                            else if (q.includes('help')) navigate('/complaints');
                                                            else if (q.includes('pay')) navigate('/payments');
                                                            setShowResults(false);
                                                            setSearchQuery("");
                                                        }}
                                                        className="text-[14px] font-bold text-foreground hover:underline transition-all"
                                                    >
                                                        Go to {searchQuery.toLowerCase().includes('room') ? 'Rooms' : 
                                                               searchQuery.toLowerCase().includes('student') ? 'Students' : 
                                                               searchQuery.toLowerCase().includes('help') ? 'Support' : 'Payments'} →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isSearching ? (
                                        <div className="p-12 text-center">
                                            <div className="h-10 w-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-[0.3em]">Searching...</p>
                                        </div>
                                    ) : (searchResults.students?.length > 0 || searchResults.rooms?.length > 0) ? (
                                        <div className="divide-y divide-border/50">
                                            {/* Students Section */}
                                            {searchResults.students.length > 0 && (
                                                <div className="p-3">
                                                    <div className="px-5 py-3 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.25em]">Students</div>
                                                    <div className="space-y-1">
                                                        {searchResults.students.map(student => (
                                                            <div 
                                                                key={student._id} 
                                                                onClick={() => {
                                                                    navigate(`/students?id=${student.studentId}`);
                                                                    setShowResults(false);
                                                                    setSearchQuery("");
                                                                }}
                                                                className="flex items-center gap-4 p-4 hover:bg-secondary/40 rounded-2xl cursor-pointer transition-all group/item"
                                                            >
                                                                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-sm">
                                                                    <UserIcon className="h-5 w-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <p className="text-[14px] font-bold text-foreground truncate">{student.name}</p>
                                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                                            student.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'
                                                                        }`}>
                                                                            {student.role || 'Student'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">{student.studentId} • Room {student.roomNumber || 'N/A'}</p>
                                                                </div>
                                                                <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Rooms Section */}
                                            {searchResults.rooms.length > 0 && (
                                                <div className="p-3">
                                                    <div className="px-5 py-3 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.25em]">Rooms</div>
                                                    <div className="space-y-1">
                                                        {searchResults.rooms.map(room => (
                                                            <div 
                                                                key={room._id} 
                                                                onClick={() => {
                                                                    navigate(`/room-allotment?room=${room.roomNumber}`);
                                                                    setShowResults(false);
                                                                    setSearchQuery("");
                                                                }}
                                                                className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl cursor-pointer transition-all group/item"
                                                            >
                                                                <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all shadow-sm">
                                                                    <BedDouble className="h-5 w-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <p className="text-[14px] font-bold text-foreground truncate">Room #{room.roomNumber}</p>
                                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                                            room.status === 'maintenance' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                                                        }`}>
                                                                            {room.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">{room.type} • {room.block} Block • {room.occupants?.length}/{room.capacity} Full</p>
                                                                </div>
                                                                <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover/item:text-emerald-600 group-hover/item:translate-x-1 transition-all" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : searchQuery.length > 1 ? (
                                        <div className="p-16 text-center space-y-4">
                                            <div className="h-16 w-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto grayscale opacity-40">
                                                <Search className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div>
3                                                <p className="text-[15px] font-bold text-foreground">No matches for "{searchQuery}"</p>
                                                <p className="text-[12px] text-muted-foreground font-medium">Try searching for generic terms like 'rooms' or 'students'.</p>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Smart Hostel Assistant - ONLY for Students */}
                {user?.role === 'student' && <SmartAssistant />}

                {/* Branding and Greeting Module - ONLY for Students */}
                {user?.role === 'student' && (
                    <div className="hidden xl:flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-500 min-w-max">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner group transition-all duration-500 hover:rotate-12 hover:scale-110">
                                <Sparkles className="h-5 w-5 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 leading-none mb-1">Student</p>
                                <h2 className="text-[15px] font-bold text-foreground tracking-tight">
                                    {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                                </h2>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-border/40 mx-2" />

                        <div className="flex items-center gap-3 px-4 py-2 bg-secondary/15 backdrop-blur-md rounded-2xl border border-border/10 shadow-sm hover:border-primary/20 transition-all cursor-default group">
                            <CalendarDays className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                            <span className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <NotificationCenter />
                
                <div className="h-6 w-px bg-border mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[13px] font-bold text-foreground leading-none mb-1">{user?.name?.split(' ')[0]}</p>
                        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{user?.role}</p>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all rounded-xl h-10 w-10 border border-transparent hover:border-red-100"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
