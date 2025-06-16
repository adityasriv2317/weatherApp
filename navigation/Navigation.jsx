import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';
import Home from 'screens/Home';

const Stack = createNativeStackNavigator();

export default function NavigationModule() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
