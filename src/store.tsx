import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, light } from './theme';

export type Account = {
  name: string;
  phone: string;
  password: string;
  city: string;
  avatar?: string; // data:image/jpeg;base64,...
};
export type User = Omit<Account, 'password'>;
export type Language = 'ru' | 'kk';
export type ThemeMode = 'system' | 'light' | 'dark';

type Persisted = {
  accounts: Account[];
  currentPhone: string | null;
  favorites: string[];
  themeMode: ThemeMode;
  notifications: boolean;
  onboarded: boolean;
  language: Language;
};

const KEY = 'lesson01:state';
const initial: Persisted = {
  accounts: [],
  currentPhone: null,
  favorites: [],
  themeMode: 'system',
  notifications: true,
  onboarded: false,
  language: 'ru',
};

type Ctx = {
  ready: boolean;
  user: User | null;
  favorites: string[];
  themeMode: ThemeMode;
  notifications: boolean;
  onboarded: boolean;
  language: Language;
  hasAccount: (phone: string) => boolean;
  register: (a: Account) => void;
  login: (phone: string, password: string) => Promise<string | null>;
  logout: () => void;
  changeCity: (city: string) => void;
  changePassword: (oldP: string, newP: string) => string | null;
  resetPassword: (phone: string, newP: string) => void;
  toggleFavorite: (id: string) => void;
  setThemeMode: (m: ThemeMode) => void;
  setNotifications: (v: boolean) => void;
  setAvatar: (uri: string) => void;
  updateName: (name: string) => void;
  setLanguage: (l: Language) => void;
  finishOnboarding: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [ready, setReady] = useState(false);

  // загрузка сохранённых данных
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setState({ ...initial, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // сохранение при каждом изменении
  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const account = state.accounts.find((a) => a.phone === state.currentPhone);
  const user: User | null = account
    ? { name: account.name, phone: account.phone, city: account.city, avatar: account.avatar }
    : null;

  const update = (fn: (s: Persisted) => Persisted) => setState(fn);

  const value: Ctx = {
    ready,
    user,
    favorites: state.favorites,
    themeMode: state.themeMode,
    notifications: state.notifications,
    onboarded: state.onboarded,
    language: state.language,

    hasAccount: (phone) => state.accounts.some((a) => a.phone === phone),

    register: (a) =>
      update((s) => ({
        ...s,
        accounts: [...s.accounts.filter((x) => x.phone !== a.phone), a],
        currentPhone: a.phone,
      })),

    login: async (phone, password) => {
      await new Promise((r) => setTimeout(r, 700));
      const acc = state.accounts.find((a) => a.phone === phone);
      if (!acc) return 'Аккаунт с таким номером не найден';
      if (acc.password !== password) return 'Неверный пароль';
      update((s) => ({ ...s, currentPhone: phone }));
      return null;
    },

    logout: () => update((s) => ({ ...s, currentPhone: null })),

    changeCity: (city) =>
      update((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.phone === s.currentPhone ? { ...a, city } : a,
        ),
      })),

    changePassword: (oldP, newP) => {
      if (!account || account.password !== oldP) return 'Текущий пароль неверный';
      update((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.phone === account.phone ? { ...a, password: newP } : a,
        ),
      }));
      return null;
    },

    resetPassword: (phone, newP) =>
      update((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.phone === phone ? { ...a, password: newP } : a,
        ),
      })),

    toggleFavorite: (id) =>
      update((s) => ({
        ...s,
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((f) => f !== id)
          : [...s.favorites, id],
      })),

    setThemeMode: (themeMode) => update((s) => ({ ...s, themeMode })),
    setNotifications: (notifications) => update((s) => ({ ...s, notifications })),

    setAvatar: (avatar) =>
      update((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.phone === s.currentPhone ? { ...a, avatar } : a,
        ),
      })),

    updateName: (name) =>
      update((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.phone === s.currentPhone ? { ...a, name } : a,
        ),
      })),

    setLanguage: (language) => update((s) => ({ ...s, language })),
    finishOnboarding: () => update((s) => ({ ...s, onboarded: true })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function useTheme() {
  const scheme = useColorScheme();
  const { themeMode } = useApp();
  const isDark = themeMode === 'system' ? scheme === 'dark' : themeMode === 'dark';
  return { colors: isDark ? dark : light, isDark };
}
