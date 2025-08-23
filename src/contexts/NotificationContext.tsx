import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { updatesService, Update } from "../services/updateServices";

// Updated Notification interface to match what you're actually using
export interface Notification {
  id: string;
  type: "Program Update" | "Student Achievement" | "Milestone Reached";
  description: string;
  createdAt: Timestamp;
  // Additional properties for frontend use
  read?: boolean;
  date?: string;
  message?: string;
  updateData?: Update;
  studentData?: any;
  isRecent?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
}

type NotificationAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "ADD_NOTIFICATION"; payload: Notification };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: true,
};

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_NOTIFICATIONS":
      const unreadCount = action.payload.filter((n) => !n.read).length;
      return {
        ...state,
        notifications: action.payload,
        unreadCount,
        loading: false,
      };

    case "MARK_AS_READ":
      const updatedNotifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      };

    case "MARK_ALL_AS_READ":
      const allReadNotifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.read
          ? state.unreadCount
          : state.unreadCount + 1,
      };

    default:
      return state;
  }
};

const NotificationContext = createContext<{
  state: NotificationState;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
} | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load updates from Firebase and convert them to notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const updates = await updatesService.getUpdates();

        // Convert Updates to Notifications with additional properties
        const notifications: Notification[] = updates.map((update) => ({
          id: update.id || "",
          type: update.type,
          description: update.description,
          createdAt: update.createdAt,
          // Additional properties for frontend
          read: false, // Default to unread
          date: update.createdAt.toDate().toISOString(),
          message: update.description,
          updateData: update,
          isRecent: isWithin24Hours(update.createdAt.toDate()),
        }));

        dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
      } catch (error) {
        console.error("Error loading notifications:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadNotifications();

    // Set up real-time listener for updates
    const unsubscribe = updatesService.subscribeToUpdates((updates) => {
      const notifications: Notification[] = updates.map((update) => ({
        id: update.id || "",
        type: update.type,
        description: update.description,
        createdAt: update.createdAt,
        read: false,
        date: update.createdAt.toDate().toISOString(),
        message: update.description,
        updateData: update,
        isRecent: isWithin24Hours(update.createdAt.toDate()),
      }));

      dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
    });

    return () => unsubscribe();
  }, []);

  const isWithin24Hours = (date: Date): boolean => {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24;
  };

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_AS_READ", payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  };

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(), // Simple ID generation
      read: false,
      date: new Date().toISOString(),
      message: notification.description,
      isRecent: true,
    };
    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
  };

  return (
    <NotificationContext.Provider
      value={{ state, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
