import Navbar from "@/components/Navbar";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import StudentComplaints from "@/components/StudentComplaints";
import AdminComplaints from "@/components/AdminComplaints";

const Complaints = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="h-28" />
            <div className="container mx-auto p-6 space-y-8 pt-4 max-w-7xl">
                <h1 className="text-3xl font-bold text-foreground">Complaints & Grievances</h1>
                {user?.role === 'admin' ? <AdminComplaints /> : <StudentComplaints />}
            </div>
        </div>
    );
};

export default Complaints;
