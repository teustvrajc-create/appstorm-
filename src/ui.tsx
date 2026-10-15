import React, { ComponentProps, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useApp, useTheme } from './store';
import * as haptics from './haptics';
import { useT } from './i18n';
import { Colors, fonts as F } from './theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/* ---------- Стили (зависят от светлой/тёмной темы) ---------- */

function makeStyles(c: Colors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    scrollContent: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 10, paddingBottom: 24 },
    tabContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

    backButton: { width: 44, height: 44, justifyContent: 'center', marginBottom: 24 },

    title: { color: c.text, fontSize: 27, lineHeight: 34, fontFamily: F.bold },
    subtitle: { color: c.hint, fontSize: 16, marginTop: 4, fontFamily: F.regular },
    centerTitle: { color: c.text, fontSize: 27, textAlign: 'center', marginTop: 40, fontFamily: F.bold },
    centerSubtitle: { color: c.hint, fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 20, lineHeight: 21, fontFamily: F.regular },

    inputContainer: {
      height: 62,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.field,
      borderRadius: 18,
      paddingHorizontal: 18,
      marginTop: 20,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputError: { borderColor: c.danger },
    input: { flex: 1, height: '100%', color: c.text, fontSize: 17, marginLeft: 14, fontFamily: F.medium },
    errorText: { color: c.danger, fontSize: 13, marginTop: 6, marginLeft: 4, fontFamily: F.medium },
    successText: { color: c.success, fontSize: 14, marginTop: 12, textAlign: 'center', fontFamily: F.medium },

    button: { backgroundColor: c.primary, borderRadius: 18, height: 56, marginTop: 24, justifyContent: 'center', alignItems: 'center' },
    buttonDisabled: { backgroundColor: c.disabled },
    buttonText: { color: '#FFFFFF', fontSize: 17, fontFamily: F.semi },
    outlineButton: { borderRadius: 18, height: 56, marginTop: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: c.primary },
    outlineText: { color: c.primary, fontSize: 17, fontFamily: F.semi },

    linkRight: { alignItems: 'flex-end', marginTop: 14 },
    linkText: { color: c.primary, fontSize: 15, fontFamily: F.semi },
    grayCenter: { color: c.hint, fontSize: 15, textAlign: 'center', marginTop: 28, fontFamily: F.regular },
    purpleCenter: { color: c.primary, fontSize: 15, textAlign: 'center', marginTop: 8, fontFamily: F.semi },
    bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },

    codeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    codeBox: { width: 62, height: 62, borderRadius: 14, backgroundColor: c.field, textAlign: 'center', fontSize: 28, color: c.text, fontFamily: F.bold, borderWidth: 1, borderColor: 'transparent' },

    agreeRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 22 },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: c.hint, marginRight: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
    checkboxOn: { backgroundColor: c.primary, borderColor: c.primary },
    agreeText: { flex: 1, fontSize: 13, color: c.text, lineHeight: 18, fontFamily: F.regular },

    select: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.field, borderRadius: 14, paddingHorizontal: 16, marginTop: 30 },
    selectText: { fontSize: 16, color: c.text, fontFamily: F.medium },
    selectPlaceholder: { fontSize: 16, color: c.hint, fontFamily: F.regular },
    dropdown: { backgroundColor: c.field, borderRadius: 14, marginTop: 8, overflow: 'hidden' },
    option: { paddingVertical: 14, paddingHorizontal: 16 },
    optionText: { fontSize: 16, color: c.text, fontFamily: F.regular },
    bottomArea: { flex: 1, justifyContent: 'flex-end' },

    /* вкладки */
    tabTitle: { color: c.text, fontSize: 26, fontFamily: F.bold },
    tabSubtitle: { color: c.hint, fontSize: 15, marginTop: 2, marginBottom: 14, fontFamily: F.regular },
    chipsRow: { paddingVertical: 4, gap: 8 },
    chip: { paddingHorizontal: 16, height: 38, borderRadius: 19, backgroundColor: c.field, justifyContent: 'center' },
    chipOn: { backgroundColor: c.primary },
    chipText: { color: c.text, fontSize: 14, fontFamily: F.medium },
    chipTextOn: { color: '#FFFFFF' },

    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.card, borderRadius: 18, padding: 12, marginTop: 12, borderWidth: 1, borderColor: c.border },
    cardIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    cardEmoji: { fontSize: 30 },
    cardBody: { flex: 1 },
    cardName: { color: c.text, fontSize: 16, fontFamily: F.bold },
    cardMeta: { color: c.hint, fontSize: 13, marginTop: 3, fontFamily: F.medium },
    cardAddr: { color: c.hint, fontSize: 12, marginTop: 3, fontFamily: F.regular },

    emptyBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
    emptyEmoji: { fontSize: 48 },
    emptyTitle: { color: c.text, fontSize: 18, marginTop: 12, fontFamily: F.bold },
    emptyText: { color: c.hint, fontSize: 14, marginTop: 6, textAlign: 'center', fontFamily: F.regular },

    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.field, borderRadius: 16, height: 52, paddingHorizontal: 16, marginTop: 4 },
    searchInput: { flex: 1, marginLeft: 10, color: c.text, fontSize: 16, fontFamily: F.medium },

    /* профиль и настройки */
    avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 10 },
    avatarText: { color: '#FFFFFF', fontSize: 38, fontFamily: F.bold },
    profileName: { color: c.text, fontSize: 22, textAlign: 'center', marginTop: 14, fontFamily: F.bold },
    profileMeta: { color: c.hint, fontSize: 15, textAlign: 'center', marginTop: 4, fontFamily: F.regular },
    group: { backgroundColor: c.field, borderRadius: 18, marginTop: 24, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowText: { color: c.text, fontSize: 16, fontFamily: F.medium },
    rowValue: { color: c.hint, fontSize: 15, fontFamily: F.regular },
    sectionTitle: { color: c.text, fontSize: 18, marginTop: 28, fontFamily: F.bold },
    segmented: { flexDirection: 'row', backgroundColor: c.field, borderRadius: 14, padding: 4, marginTop: 12 },
    segItem: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    segItemOn: { backgroundColor: c.primary },
    segText: { color: c.text, fontSize: 14, fontFamily: F.medium },
    segTextOn: { color: '#FFFFFF' },

    /* детали заведения */
    detailHero: { height: 180, borderRadius: 24, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' },
    detailEmoji: { fontSize: 84 },
    detailName: { color: c.text, fontSize: 26, marginTop: 20, fontFamily: F.bold },
    detailMeta: { color: c.hint, fontSize: 15, marginTop: 4, fontFamily: F.medium },
    detailDesc: { color: c.text, fontSize: 15, lineHeight: 22, marginTop: 16, fontFamily: F.regular },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 },
    infoText: { flex: 1, color: c.text, fontSize: 15, fontFamily: F.medium },
    langSwitch: { flexDirection: 'row', backgroundColor: c.field, borderRadius: 12, padding: 3, alignSelf: 'flex-end' },
    langItem: { paddingHorizontal: 12, height: 30, borderRadius: 9, justifyContent: 'center' },
    langItemOn: { backgroundColor: c.primary },
    langText: { color: c.text, fontSize: 13, fontFamily: F.semi },
    langTextOn: { color: '#FFFFFF' },
    cameraBadge: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: c.card, borderWidth: 2, borderColor: c.bg, alignItems: 'center', justifyContent: 'center' },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  });
}

export function useStyles() {
  const { colors } = useTheme();
  return useMemo(() => makeStyles(colors), [colors]);
}

/* ---------- Общие компоненты ---------- */

/** Экран-форма: SafeArea + прокрутка + клавиатура не перекрывает поля */
export function Screen({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Экран без прокрутки (для списков с FlatList) */
export function TabScreen({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  const { isDark } = useTheme();
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={padded ? styles.tabContainer : { flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <Pressable style={styles.backButton} onPress={onPress} hitSlop={10}>
      <Ionicons name="arrow-back" size={26} color={colors.text} />
    </Pressable>
  );
}

type FieldProps = TextInputProps & {
  icon: IconName;
  password?: boolean;
  error?: string;
};

export function Field({ icon, password, error, ...rest }: FieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const t = useT();
  const [hidden, setHidden] = useState(true);
  const filled = !!rest.value;
  return (
    <View>
      <View style={[styles.inputContainer, !!error && styles.inputError]}>
        <Ionicons name={icon} size={22} color={filled ? colors.primary : colors.hint} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.hint}
          secureTextEntry={password ? hidden : false}
          autoCapitalize="none"
          {...rest}
        />
        {password && (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Ionicons
              name={hidden ? 'eye-off' : 'eye'}
              size={22}
              color={hidden ? colors.hint : colors.primary}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{t(error)}</Text>}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const styles = useStyles();
  const off = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, off && styles.buttonDisabled]}
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      disabled={off}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export function EmptyState({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export function Avatar({ size = 96, uri, name }: { size?: number; uri?: string; name?: string }) {
  const { colors } = useTheme();
  const base = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  if (uri) return <Image source={{ uri }} style={base} />;
  return (
    <View style={base}>
      <Text style={{ color: '#FFFFFF', fontSize: size * 0.4, fontFamily: F.bold }}>
        {name?.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

/** Переключатель языка RU | ҚАЗ */
export function LanguageSwitch() {
  const styles = useStyles();
  const { language, setLanguage } = useApp();
  const items: { key: 'ru' | 'kk'; label: string }[] = [
    { key: 'ru', label: 'RU' },
    { key: 'kk', label: 'ҚАЗ' },
  ];
  return (
    <View style={styles.langSwitch}>
      {items.map((i) => (
        <Pressable
          key={i.key}
          style={[styles.langItem, language === i.key && styles.langItemOn]}
          onPress={() => {
            haptics.tap();
            setLanguage(i.key);
          }}
        >
          <Text style={[styles.langText, language === i.key && styles.langTextOn]}>{i.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
