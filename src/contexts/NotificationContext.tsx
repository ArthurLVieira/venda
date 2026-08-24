import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    setNotifications((prev) => [...prev, { id, message, type }]);
    // Auto-remover após 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = { notifications, addNotification, removeNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationList notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Componente para renderizar as notificações no canto superior direito
const NotificationList: React.FC<{
  notifications: Notification[];
  onClose: (id: string) => void;
}> = ({ notifications, onClose }) => {
  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          style={{
            padding: '0.8rem 1.2rem',
            borderRadius: '4px',
            color: '#fff',
            backgroundColor:
              notif.type === 'success' ? '#43A047' :
              notif.type === 'error' ? '#E53935' :
              notif.type === 'warning' ? '#FF9800' : '#1E88E5',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: '200px',
          }}
        >
          <span>{notif.message}</span>
          <button
            onClick={() => onClose(notif.id)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem', marginLeft: '0.8rem' }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};