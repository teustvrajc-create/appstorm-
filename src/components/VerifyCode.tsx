import React, { useRef, useState } from 'react';
import { useT } from '../i18n';
import { Pressable, Text, TextInput, View } from 'react-native';
import { BackButton, PrimaryButton, Screen, useStyles } from '../ui';
import { useTheme } from '../store';
import * as haptics from '../haptics';

const DEMO_CODE = '7854'; // в реальном приложении код приходит по SMS

type Props = {
  phone: string;
  onBack: () => void;
  onContinue: () => void;
};

export default function VerifyCode({ phone, onBack, onContinue }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const refs = useRef<(TextInput | null)[]>([]);

  const changeDigit = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setError('');
    if (digit && index < 3) refs.current[index + 1]?.focus();
    if (!digit && index > 0) refs.current[index - 1]?.focus();
  };

  const submit = () => {
    if (code.join('') === DEMO_CODE) {
      haptics.success();
      onContinue();
    } else {
      haptics.error();
      setError(t('Неверный код'));
    }
  };

  const resend = () => {
    setCode(['', '', '', '']);
    setError('');
    refs.current[0]?.focus();
  };

  return (
    <Screen>
      <BackButton onPress={onBack} />

      <Text style={styles.centerTitle}>{t('Подтвердить номер')}</Text>
      <Text style={styles.centerSubtitle}>
        {t('Мы только что отправили код на')} {'\n'}
        <Text style={{ color: colors.text }}>{phone}</Text>
      </Text>

      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              refs.current[i] = r;
            }}
            style={[styles.codeBox, !!error && { borderColor: colors.danger }]}
            value={digit}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(t) => changeDigit(t, i)}
          />
        ))}
      </View>
      {!!error && <Text style={[styles.errorText, { textAlign: 'center' }]}>{error}</Text>}

      <PrimaryButton title={t('Продолжить')} onPress={submit} disabled={code.some((d) => !d)} />

      <Pressable onPress={resend}>
        <Text style={styles.grayCenter}>{t('Отправить код еще раз')}</Text>
      </Pressable>
      <Text style={[styles.grayCenter, { marginTop: 16, fontSize: 13 }]}>
        {t('Демо: введите код')} {DEMO_CODE}
      </Text>
    </Screen>
  );
}
