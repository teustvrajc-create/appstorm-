import React, { useState } from 'react';
import { Text } from 'react-native';
import { BackButton, Field, PrimaryButton, Screen, useStyles } from '../ui';
import { useT } from '../i18n';
import { useApp } from '../store';
import * as haptics from '../haptics';
import { formatPhoneInput, isPhoneComplete } from '../utils';

type Props = {
  onBack: () => void;
  onContinue: (phone: string) => void;
};

export default function ForgetPassword({ onBack, onContinue }: Props) {
  const styles = useStyles();
  const t = useT();
  const { hasAccount } = useApp();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!isPhoneComplete(phone) || !hasAccount(phone)) {
      haptics.error();
      return setError(
        !isPhoneComplete(phone) ? t('Введите номер полностью') : t('Аккаунт с таким номером не найден'),
      );
    }
    setError('');
    onContinue(phone);
  };

  return (
    <Screen>
      <BackButton onPress={onBack} />

      <Text style={styles.centerTitle}>{t('Восстановление пароля')}</Text>
      <Text style={styles.centerSubtitle}>
        {t('Введите свой номер телефона, чтобы восстановить пароль')}
      </Text>

      <Field
        icon="call"
        placeholder="+7 (700) 555 77 55"
        keyboardType="phone-pad"
        value={phone}
        error={error}
        onChangeText={(t) => setPhone(formatPhoneInput(t, phone))}
      />

      <PrimaryButton title={t('Продолжить')} onPress={submit} disabled={!phone} />
    </Screen>
  );
}
