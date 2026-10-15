import React, { useState } from 'react';
import { Text } from 'react-native';
import { BackButton, Field, PrimaryButton, Screen, useStyles } from '../ui';
import { useT } from '../i18n';
import * as haptics from '../haptics';
import { passwordProblem } from '../utils';

type Props = {
  onBack: () => void;
  onContinue: (password: string) => void;
};

export default function ResetPassword({ onBack, onContinue }: Props) {
  const styles = useStyles();
  const t = useT();
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [errors, setErrors] = useState({ password: '', repeat: '' });

  const submit = () => {
    const e = {
      password: passwordProblem(password) ?? '',
      repeat: password === repeat ? '' : t('Пароли не совпадают'),
    };
    setErrors(e);
    if (e.password || e.repeat) return void haptics.error();
    onContinue(password);
  };

  return (
    <Screen>
      <BackButton onPress={onBack} />

      <Text style={styles.centerTitle}>{t('Сбросить пароль')}</Text>
      <Text style={styles.centerSubtitle}>
        {t('Не менее 8 символов, с прописными и строчными буквами')}
      </Text>

      <Field icon="lock-closed" password placeholder={t('Пароль')} value={password} error={errors.password} onChangeText={setPassword} />
      <Field icon="lock-closed" password placeholder={t('Повторить пароль')} value={repeat} error={errors.repeat} onChangeText={setRepeat} />

      <PrimaryButton title={t('Продолжить')} onPress={submit} disabled={!password || !repeat} />
    </Screen>
  );
}
