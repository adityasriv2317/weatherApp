import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import Home from 'screens/Home';
import SetLocation from 'screens/SetLocation';
import { getData, removeData } from 'utils/storage';

const Stack = createNativeStackNavigator();

export default function NavigationModule() {
  const [defaultCity, setDefaultCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData('defaultCity').then((city) => {
      setDefaultCity(city);
      setLoading(false);
    });
  }, []);

  removeData('defaultCity'); // Remove this line if you want to keep the default city in storage

  // if (loading) return null; // or a splash/loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={defaultCity ? 'Home' : 'SetLocation'}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SetLocation" component={SetLocation} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
