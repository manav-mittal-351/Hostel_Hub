import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!user?._id || !user?.token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/notifications', config);
            setNotifications(data.map(n => ({
                ...n,
                time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
            })));
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [user?._id, user?.token]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (user?._id) {
            const socketUrl = window.location.protocol + "//" + window.location.hostname + ":5000";
            const newSocket = io(socketUrl);
            setSocket(newSocket);

            newSocket.on('connect', () => {
                newSocket.emit('join', user._id);
            });

            newSocket.on('new_notification', (notification) => {
                const formattedNotif = {
                    ...notification,
                    time: 'Just now'
                };
                setNotifications(prev => [formattedNotif, ...prev]);
                
                toast(notification.title, {
                    description: notification.message,
                    action: {
                        label: "View",
                        onClick: () => {
                            if (notification.link) window.location.href = notification.link;
                        }
                    }
                });
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user?._id]);

    const markAsRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/notifications/${id}/read`, {}, config);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put('/api/notifications/read-all', {}, config);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            toast.success("Registry cleared", { description: "All notifications marked as read." });
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const clearAll = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete('/api/notifications', config);
            setNotifications([]);
            toast.success("History empty");
        } catch (error) {
            console.error("Failed to clear notifications:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            loading,
            markAsRead, 
            markAllAsRead, 
            clearAll,
            unreadCount,
            refresh: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export default NotificationContext;
