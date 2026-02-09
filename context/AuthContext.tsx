
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Event, ParticipationRequest, PixKeyType, RequestStatus } from '../types';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PIX_KEY } from '../constants';

// --- Helper Functions ---
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const setToStorage = <T,>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key “${key}”:`, error);
  }
};

interface BannedData {
  emails: string[];
  phones: string[];
  cpfs: string[];
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  users: User[];
  events: Event[];
  requests: ParticipationRequest[];
  bannedData: BannedData;
  isMaintenanceMode: boolean;
  toggleMaintenanceMode: () => void;
  login: (email: string, pass: string) => Promise<User>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<User>;
  logout: () => void;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<User>;
  addUserPix: (userId: string, pixKeyType: PixKeyType, pixKey: string, cpf: string) => Promise<User>;
  addOrUpdateEvent: (event: Omit<Event, 'id' | 'createdAt'> & { id?: string }) => void;
  deleteEvent: (eventId: string) => void;
  createRequest: (userId: string, eventId: string) => Promise<void>;
  notifyUser: (userId: string, requestId: string, message: string, nextStatus?: RequestStatus) => void;
  confirmUserSendback: (requestId: string) => void;
  confirmAdminReceipt: (requestId: string) => void;
  clearUserNotification: (userId: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização de Estados do Storage
  const [users, setUsers] = useState<User[]>(() => {
    const stored = getFromStorage<User[]>('users', []);
    const adminExists = stored.some(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin_root',
        name: 'Administrador Master',
        email: ADMIN_EMAIL,
        phone: '99999999999',
        passwordHash: ADMIN_PASSWORD,
        pixKey: ADMIN_PIX_KEY,
        pixKeyType: PixKeyType.EMAIL,
        cpf: '000.000.000-00'
      };
      return [adminUser, ...stored];
    }
    return stored;
  });

  const [events, setEvents] = useState<Event[]>(() => getFromStorage<Event[]>('events', []));
  const [requests, setRequests] = useState<ParticipationRequest[]>(() => getFromStorage('requests', []));
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => getFromStorage('currentUserId', null));
  const [bannedData, setBannedData] = useState<BannedData>(() => getFromStorage('bannedData', { emails: [], phones: [], cpfs: [] }));
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => getFromStorage('isMaintenanceMode', false));

  // Sincronização em tempo real entre Abas (Vital para teste Admin/User simultâneo)
  useEffect(() => {
    const syncWithStorage = (e: StorageEvent) => {
      if (!e.newValue) return;
      const data = JSON.parse(e.newValue);
      switch (e.key) {
        case 'events': setEvents(data); break;
        case 'requests': setRequests(data); break;
        case 'isMaintenanceMode': setIsMaintenanceMode(data); break;
        case 'users': setUsers(data); break;
        case 'currentUserId': setCurrentUserId(data); break;
      }
    };
    window.addEventListener('storage', syncWithStorage);
    return () => window.removeEventListener('storage', syncWithStorage);
  }, []);

  // Persistência Centralizada (Garante que localStorage esteja SEMPRE atualizado)
  useEffect(() => setToStorage('users', users), [users]);
  useEffect(() => setToStorage('events', events), [events]);
  useEffect(() => setToStorage('requests', requests), [requests]);
  useEffect(() => setToStorage('currentUserId', currentUserId), [currentUserId]);
  useEffect(() => setToStorage('bannedData', bannedData), [bannedData]);
  useEffect(() => setToStorage('isMaintenanceMode', isMaintenanceMode), [isMaintenanceMode]);

  const currentUser = useMemo(() => users.find(u => u.id === currentUserId) || null, [users, currentUserId]);
  const isAuthenticated = !!currentUser;
  const isAdmin = useMemo(() => currentUser?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(), [currentUser]);

  const login = async (email: string, pass: string): Promise<User> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === pass);
    if (user) {
      if (user.isBanned) throw new Error('Sua conta está suspensa.');
      setCurrentUserId(user.id);
      return user;
    }
    throw new Error('E-mail ou senha incorretos.');
  };

  const register = async (name: string, email: string, phone: string, pass: string): Promise<User> => {
    const lowerEmail = email.toLowerCase();
    if (bannedData.emails.includes(lowerEmail)) throw new Error('E-mail bloqueado no sistema.');
    if (users.some(u => u.email.toLowerCase() === lowerEmail)) throw new Error('E-mail já cadastrado.');
    
    const newUser: User = { id: `user_${Date.now()}`, name, email: lowerEmail, phone, passwordHash: pass };
    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return newUser;
  };
  
  const logout = useCallback(() => setCurrentUserId(null), []);

  const toggleMaintenanceMode = useCallback(() => setIsMaintenanceMode(prev => !prev), []);

  const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    return users.find(u => u.id === userId)!;
  };

  const addUserPix = async (userId: string, pixKeyType: PixKeyType, pixKey: string, cpf: string) => {
    return updateUserProfile(userId, { pixKeyType, pixKey, cpf });
  };
  
  const addOrUpdateEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt'> & { id?: string }) => {
    setEvents(prev => {
      if (eventData.id) {
        return prev.map(e => e.id === eventData.id ? { ...e, ...eventData } as Event : e);
      }
      const newEvent: Event = {
        title: eventData.title,
        description: eventData.description,
        imageUrl: eventData.imageUrl,
        value: eventData.value,
        id: `ev_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return [newEvent, ...prev];
    });
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  const createRequest = async (userId: string, eventId: string) => {
     const user = users.find(u => u.id === userId);
     const event = events.find(e => e.id === eventId);
     if (!user?.pixKey) throw new Error("Configure seu PIX primeiro.");
     if (!event) throw new Error("Evento não encontrado.");

     const newRequest: ParticipationRequest = {
         id: `req_${Date.now()}`,
         userId,
         eventId,
         userName: user.name,
         userPhone: user.phone,
         userPixKey: user.pixKey,
         userCpf: user.cpf || '',
         eventTitle: event.title,
         eventValue: event.value,
         status: 'pending',
         createdAt: new Date().toISOString()
     };
     setRequests(prev => [newRequest, ...prev]);
  };
  
  const notifyUser = useCallback((userId: string, requestId: string, message: string, nextStatus?: RequestStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, notification: message } : u));
    if (nextStatus) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: nextStatus } : r));
    }
  }, []);

  const confirmUserSendback = useCallback((requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'paid' } : r));
  }, []);

  const confirmAdminReceipt = useCallback((requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'completed' } : r));
  }, []);
  
  const clearUserNotification = useCallback((userId: string) => {
     setUsers(prev => prev.map(u => u.id === userId ? { ...u, notification: undefined } : u));
  }, []);

  const banUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: true } : u));
    setBannedData(prev => ({ ...prev, emails: [...prev.emails, user.email.toLowerCase()] }));
  }, [users]);

  const unbanUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: false } : u));
    setBannedData(prev => ({ ...prev, emails: prev.emails.filter(e => e !== user.email.toLowerCase()) }));
  }, [users]);

  return (
    <AuthContext.Provider value={{
      currentUser, isAuthenticated, isAdmin, users, events, requests, bannedData, isMaintenanceMode,
      toggleMaintenanceMode, login, register, logout, updateUserProfile, addUserPix, addOrUpdateEvent,
      deleteEvent, createRequest, notifyUser, confirmUserSendback, confirmAdminReceipt, clearUserNotification, banUser, unbanUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
