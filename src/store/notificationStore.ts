// store/notificationStore.ts
import { create } from 'zustand';
import { getNotifications } from '../actions/admin/getNotifications';

interface NotificationState {
  isSidebarOpen: boolean;
  notificationCount: number;
  notifications: string[];
}

interface NotificationActions {
  toggleSidebar: () => void;
  setNotificationCount: (count: number) => void;
  addNotification: (message: string) => void;
  loadNotifications: () => Promise<void>; // Ahora es async
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set) => ({
  isSidebarOpen: false,
  notificationCount: 0,
  notifications: [],

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setNotificationCount: (count: number) => {
    set({ notificationCount: count });
    localStorage.setItem('notificationCount', count.toString());
  },

  addNotification: (message: string) => {
    set((state) => {
      const newNotifications = [message, ...state.notifications]; // Nueva notificación al inicio
      localStorage.setItem('notifications', JSON.stringify(newNotifications));
      return { 
        notifications: newNotifications,
        notificationCount: state.notificationCount + 1,
      };
    });
  },

  loadNotifications: async () => {
    try {
      // Cargar desde localStorage
      const savedNotifications = localStorage.getItem('notifications');

      // Cargar desde la base de datos (Server Action)
      const dbNotifications = await getNotifications();
      const dbMessages = dbNotifications.map((n) => n.message);

      // Combinar notificaciones (localStorage + DB)
      const allNotifications = [
        ...(savedNotifications ? JSON.parse(savedNotifications) : []),
        ...dbMessages,
      ];

      // Eliminar duplicados (opcional)
      const uniqueNotifications = Array.from(new Set(allNotifications));

      set({
        notificationCount: uniqueNotifications.length,
        notifications: uniqueNotifications,
      });

      // Guardar en localStorage
      localStorage.setItem('notifications', JSON.stringify(uniqueNotifications));
      localStorage.setItem('notificationCount', uniqueNotifications.length.toString());
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    }
  },
}));