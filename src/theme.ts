export const light = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1B1923',
  hint: '#AAA9B2',
  field: '#F8F8FA',
  border: '#ECEBF0',
  primary: '#A811DA',
  primarySoft: '#F6E6FB',
  disabled: '#D9A3EC',
  danger: '#E5484D',
  success: '#2E9E5B',
};

export type Colors = { [K in keyof typeof light]: string };

export const dark: Colors = {
  bg: '#121016',
  card: '#1A1721',
  text: '#F4F3F7',
  hint: '#8D8B96',
  field: '#1F1C26',
  border: '#2A2633',
  primary: '#B72BE6',
  primarySoft: '#2B1535',
  disabled: '#5B2A6E',
  danger: '#FF6369',
  success: '#4CC38A',
};

export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semi: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
};
