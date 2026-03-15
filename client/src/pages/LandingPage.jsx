import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BedDouble, CreditCard, MessageSquare, ShieldCheck, ArrowRight, CheckCircle2, Building, Users, Clock } from "lucide-react";

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: BedDouble,
            title: "Smart Room Selection",
            description: "Explore available residences and reserve your preferred room with a single click. Real-time availability tracking.",
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            icon: CreditCard,
            title: "Digital Payments",
            description: "Securely settle your hostel dues, track transaction history, and retrieve digital receipts instantly.",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: MessageSquare,
            title: "Support Console",
            description: "Submit maintenance requests or report issues directly to the administration. Real-time status monitoring.",
            color: "bg-amber-50 text-amber-600"
        },
        {
            icon: ShieldCheck,
            title: "Gatepass Authority",
            description: "Digital authorization for outings and leaves. Secure QR-based authentication for campus exit and entry.",
            color: "bg-primary/10 text-primary"
        }
    ];

    const stats = [
        { label: "Active Residents", value: "2,500+", icon: Users },
        { label: "Residential Units", value: "1,200+", icon: Building },
        { label: "Support Resolution", value: "99.9%", icon: CheckCircle2 },
        { label: "Sync Latency", value: "< 200ms", icon: Clock }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
            <Navbar />
            
            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/30 rounded-full blur-[100px]" />
                    </div>

                    <div className="container max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                                Modern Residency Management
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[0.95]">
                                Elevated <br />
                                <span className="text-primary italic">Campus Living.</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                                A premium, high-performance ecosystem for modern student housing. Book units, settle dues, and manage permissions with absolute precision.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button 
                                    onClick={() => navigate('/register')}
                                    className="h-14 px-10 bg-primary text-white hover:bg-primary/90 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/10 flex items-center gap-3 transition-all active:scale-95"
                                >
                                    Initialize Identity
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => navigate('/login')}
                                    className="h-14 px-10 bg-white text-foreground border-border rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-secondary/30 transition-all active:scale-95"
                                >
                                    Sign In
                                </Button>
                            </div>

                            <div className="flex items-center gap-6 pt-8 border-t border-border/50">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-secondary/50 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                        +2k
                                    </div>
                                </div>
                                <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">
                                    Trusted by <span className="text-foreground">2,500+</span> residents
                                </p>
                            </div>
                        </div>
                        
                        <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white p-3 rotate-1">
                                <div className="aspect-[4/5] bg-secondary/10 rounded-[2rem] overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                                    <img 
                                        src="/hostel_hero_image.png" 
                                        alt="Modern Hostel" 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl space-y-2">
                                        <Badge className="bg-primary text-white border-none text-[9px] uppercase font-bold tracking-widest px-2 py-0.5">Premium Standard</Badge>
                                        <h3 className="text-xl font-bold text-foreground tracking-tight">Executive Wing — Sector A</h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[12px] text-muted-foreground font-medium">98% Allotted • Registry Active</p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary" />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-[-5%] right-[-5%] w-32 h-32 bg-primary/10 rounded-3xl border border-primary/20 -rotate-12 blur-sm -z-10 animate-pulse" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-secondary/5 border-y border-border/50 relative overflow-hidden">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="max-w-3xl mb-16 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground">
                                Precision Engineered <br />
                                <span className="text-muted-foreground">For Institutional Excellence.</span>
                            </h2>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Our platform consolidates every aspect of the residential lifecycle into a single, intuitive interface. From unit allocation to financial settlements.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="p-8 bg-white border border-border/60 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-3 tracking-tight">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24">
                    <div className="container max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="space-y-4 group">
                                <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center text-primary border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-4xl font-bold tracking-tighter text-foreground">{stat.value}</p>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 container max-w-7xl mx-auto px-6">
                    <div className="relative bg-primary rounded-[3rem] p-12 lg:p-24 overflow-hidden text-center space-y-8 shadow-2xl shadow-primary/20">
                        {/* Decorative background logo */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                            <Users className="w-[800px] h-[800px] -rotate-12" />
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white relative z-10 leading-tight">
                            Ready to Transform Your <br /> Hostel Experience?
                        </h2>
                        <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
                            Join thousands of residents using HostelHub to navigate their campus life with absolute ease. Initialize your account today.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-4">
                            <Button 
                                onClick={() => navigate('/register')}
                                className="h-14 px-12 bg-white text-primary hover:bg-secondary transition-all rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-black/5 active:scale-95"
                            >
                                Get Started
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="h-14 px-12 bg-transparent border-white/20 text-white hover:bg-white/10 transition-all rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95"
                            >
                                Account Access
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-border mt-12">
                <div className="container max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/10">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tighter">
                            Hostel<span className="text-primary italic">HUB</span>
                        </span>
                    </div>
                    
                    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">
                        © 2026 HostelHub Institutional Services — Protocol v2.4.1
                    </p>
                    
                    <div className="flex items-center gap-8">
                        {["Privacy", "Protocols", "Support"].map(item => (
                            <a key={item} href="#" className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
