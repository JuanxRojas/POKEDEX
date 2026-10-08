import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';
import { colors } from '../theme';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.white,
    text: colors.dark,
    border: colors.border,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
