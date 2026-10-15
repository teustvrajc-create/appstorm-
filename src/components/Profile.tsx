import React from 'react';
import { useT } from '../i18n';
import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, TabScreen, useStyles } from '../ui';
import { useApp, useTheme } from '../store';
import { useToast } from '../toast';
import * as haptics from '../haptics';

type Props = { onOpenSettings: () => void };

export default function Profile({ onOpenSettings }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const { user, favorites, logout, setAvatar } = useApp();
  const toast = useToast();

  const pickPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3, // маленький размер, чтобы хранить в AsyncStorage
        base64: true,
      });
      if (!res.canceled && res.assets[0]?.base64) {
        setAvatar(`data:image/jpeg;base64,${res.assets[0].base64}`);
        haptics.success();
        toast(t('Фото обновлено'), 'success');
      }
    } catch {
      toast(t('Не удалось выбрать фото'), 'error');
    }
  };

  const confirmLogout = () =>
    Alert.alert(t('Выйти из аккаунта?'), undefined, [
      { text: t('Отмена'), style: 'cancel' },
      { text: t('Выйти'), style: 'destructive', onPress: logout },
    ]);

  return (
    <TabScreen>
      <Pressable style={{ alignSelf: 'center', marginTop: 10 }} onPress={pickPhoto}>
        <Avatar uri={user?.avatar} name={user?.name} />
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={16} color={colors.primary} />
        </View>
      </Pressable>
      <Text style={styles.profileName}>{user?.name}</Text>
      <Text style={styles.profileMeta}>{user?.phone}</Text>

      <View style={styles.group}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="location" size={22} color={colors.primary} />
            <Text style={styles.rowText}>{t('Город')}</Text>
          </View>
          <Text style={styles.rowValue}>{user?.city}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="heart" size={22} color={colors.primary} />
            <Text style={styles.rowText}>{t('Избранное')}</Text>
          </View>
          <Text style={styles.rowValue}>{favorites.length}</Text>
        </View>
      </View>

      <View style={styles.group}>
        <Pressable style={styles.row} onPress={onOpenSettings}>
          <View style={styles.rowLeft}>
            <Ionicons name="settings" size={22} color={colors.primary} />
            <Text style={styles.rowText}>{t('Настройки')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.hint} />
        </Pressable>
        <Pressable style={styles.row} onPress={confirmLogout}>
          <View style={styles.rowLeft}>
            <Ionicons name="log-out" size={22} color={colors.danger} />
            <Text style={[styles.rowText, { color: colors.danger }]}>{t('Выйти')}</Text>
          </View>
        </Pressable>
      </View>
    </TabScreen>
  );
}
