import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './store';
import { fonts } from './theme';

type Kind = 'success' | 'error' | 'info';
type ShowFn = (message: string, kind?: Kind) => void;

const ToastContext = createContext<ShowFn>(() => {});
export const useToast = () => useContext(ToastContext);

const ICONS: Record<Kind, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(-160)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; kind: Kind } | null>(null);

  const show = useCallback<ShowFn>(
    (message, kind = 'info') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, kind });
      Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
      timer.current = setTimeout(() => {
        Animated.timing(y, { toValue: -160, duration: 220, useNativeDriver: true }).start(() =>
          setToast(null),
        );
      }, 2200);
    },
    [y],
  );

  const accent =
    toast?.kind === 'error' ? colors.danger : toast?.kind === 'success' ? colors.success : colors.primary;

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.box,
            { top: insets.top + 8, backgroundColor: colors.text, transform: [{ translateY: y }] },
          ]}
        >
          <Ionicons name={ICONS[toast.kind]} size={22} color={accent} />
          <Text style={[styles.text, { color: colors.bg }]}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  text: { flex: 1, fontSize: 14, fontFamily: fonts.medium },
});
