import { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Registry Active", message: "Your institutional account is fully synchronized and active.", type: "success", time: "Just now", read: false },
        { id: 2, title: "System Tip", message: "You can manage your residency and payments from the sidebar.", type: "info", time: "2m ago", read: false },
    ]);

    const addNotification = (notif) => {
        const newNotif = {
            id: Date.now(),
            time: 'Just now',
            read: false,
            type: 'info',
            ...notif
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            addNotification, 
            markAsRead, 
            markAllAsRead, 
            clearAll,
            unreadCount 
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
