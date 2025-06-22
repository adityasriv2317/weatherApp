import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import Home from 'screens/Home';
import SetLocation from 'screens/SetLocation';
import { getData, removeData } from 'utils/storage';

const Stack = createNativeStackNavigator();

export default function NavigationModule() {
  const [defaultPage, setDefaultPage] = useState(null);

  const fetchInitialWeather = async () => {
    try {
      const city = await getData('defaultCity');
      if (city) {
        setDefaultPage('Home');
      } else {
        setDefaultPage('SetLocation');
      }
    } catch (error) {
      console.error('Error fetching initial weather:', error);
      setDefaultPage('SetLocation');
    }
  };

  useEffect(() => {
    fetchInitialWeather();
  }, []);

  if (defaultPage === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={defaultPage} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SetLocation" component={SetLocation} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
