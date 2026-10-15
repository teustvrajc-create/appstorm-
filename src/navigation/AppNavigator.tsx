import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Login from '../components/Login';
import Register from '../components/Register';
import ForgetPassword from '../components/ForgetPassword';
import VerifyCode from '../components/VerifyCode';
import ResetPassword from '../components/ResetPassword';
import SelectCity from '../components/SelectCity';
import Home from '../components/Home';
import Search from '../components/Search';
import Favorites from '../components/Favorites';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import Details from '../components/Details';
import { useApp, useTheme } from '../store';
import { fonts } from '../theme';
import { useT } from '../i18n';

/* ================= Авторизация ================= */

type AuthParams = {
  Login: undefined;
  Register: undefined;
  Forget: undefined;
  Verify: { phone: string };
  Reset: { phone: string };
  City: { name: string; phone: string; password: string };
};

const Auth = createNativeStackNavigator<AuthParams>();

export function AuthNavigator() {
  const { register, resetPassword } = useApp();

  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="Login">
        {({ navigation }) => (
          <Login
            onForgot={() => navigation.navigate('Forget')}
            onRegister={() => navigation.navigate('Register')}
          />
        )}
      </Auth.Screen>

      <Auth.Screen name="Register">
        {({ navigation }) => (
          <Register
            onBack={() => navigation.goBack()}
            onLogin={() => navigation.navigate('Login')}
            onRegister={(data) => navigation.navigate('City', data)}
          />
        )}
      </Auth.Screen>

      <Auth.Screen name="Forget">
        {({ navigation }) => (
          <ForgetPassword
            onBack={() => navigation.goBack()}
            onContinue={(phone) => navigation.navigate('Verify', { phone })}
          />
        )}
      </Auth.Screen>

      <Auth.Screen name="Verify">
        {({ navigation, route }) => (
          <VerifyCode
            phone={route.params.phone}
            onBack={() => navigation.goBack()}
            onContinue={() => navigation.navigate('Reset', { phone: route.params.phone })}
          />
        )}
      </Auth.Screen>

      <Auth.Screen name="Reset">
        {({ navigation, route }) => (
          <ResetPassword
            onBack={() => navigation.goBack()}
            onContinue={(password) => {
              resetPassword(route.params.phone, password);
              navigation.popToTop(); // назад на Login
            }}
          />
        )}
      </Auth.Screen>

      <Auth.Screen name="City">
        {({ navigation, route }) => (
          <SelectCity
            onBack={() => navigation.goBack()}
            // register() сохраняет аккаунт → user появляется → открывается главная
            onContinue={(city) => register({ ...route.params, city })}
          />
        )}
      </Auth.Screen>
    </Auth.Navigator>
  );
}

/* ================= Основное приложение ================= */

type MainParams = {
  Tabs: undefined;
  Details: { id: string };
  Settings: undefined;
  ChangeCity: undefined;
};

type MainNav = NativeStackNavigationProp<MainParams>;

const Main = createNativeStackNavigator<MainParams>();
const Tab = createBottomTabNavigator();

function HomeTab() {
  const nav = useNavigation<MainNav>();
  return <Home onOpenPlace={(id) => nav.navigate('Details', { id })} />;
}
function SearchTab() {
  const nav = useNavigation<MainNav>();
  return <Search onOpenPlace={(id) => nav.navigate('Details', { id })} />;
}
function FavoritesTab() {
  const nav = useNavigation<MainNav>();
  return <Favorites onOpenPlace={(id) => nav.navigate('Details', { id })} />;
}
function ProfileTab() {
  const nav = useNavigation<MainNav>();
  return <Profile onOpenSettings={() => nav.navigate('Settings')} />;
}

const TAB_ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Главная: ['home', 'home-outline'],
  Поиск: ['search', 'search-outline'],
  Избранное: ['heart', 'heart-outline'],
  Профиль: ['person', 'person-outline'],
};

function Tabs() {
  const { colors } = useTheme();
  const t = useT();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: t(route.name),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.hint,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Главная" component={HomeTab} />
      <Tab.Screen name="Поиск" component={SearchTab} />
      <Tab.Screen name="Избранное" component={FavoritesTab} />
      <Tab.Screen name="Профиль" component={ProfileTab} />
    </Tab.Navigator>
  );
}

export function MainNavigator() {
  const { user, changeCity } = useApp();
  return (
    <Main.Navigator screenOptions={{ headerShown: false }}>
      <Main.Screen name="Tabs" component={Tabs} />

      <Main.Screen name="Details">
        {({ navigation, route }) => (
          <Details id={route.params.id} onBack={() => navigation.goBack()} />
        )}
      </Main.Screen>

      <Main.Screen name="Settings">
        {({ navigation }) => (
          <Settings
            onBack={() => navigation.goBack()}
            onChangeCity={() => navigation.navigate('ChangeCity')}
          />
        )}
      </Main.Screen>

      <Main.Screen name="ChangeCity">
        {({ navigation }) => (
          <SelectCity
            initialCity={user?.city}
            buttonTitle="Сохранить"
            onBack={() => navigation.goBack()}
            onContinue={(city) => {
              changeCity(city);
              navigation.goBack();
            }}
          />
        )}
      </Main.Screen>
    </Main.Navigator>
  );
}
