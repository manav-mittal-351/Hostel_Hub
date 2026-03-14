import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    return <StudentDashboard />;
};

export default Dashboard;
