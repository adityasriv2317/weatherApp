import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { View, Text, Image, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { CalendarDaysIcon, MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import debounce from 'lodash.debounce';
import { getLocation, getWeather } from 'api/handler';

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [locations, setLoactions] = useState([]);

  const [weatherData, setWeatherData] = useState(null);

  const handleLocationPress = (location) => () => {
    const city = location.name;
    setLoactions([]);
    setLoading(true);
    setIsSearching(false);
    getWeather({ city, days: 7 })
      .then((data) => {
        console.log('Weather data for selected location:', data);
        setWeatherData(data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
    setLoading(false);
  };

  const handleCity = (text) => {
    console.log('Searching for city:', text);
    if (text.length > 2) {
      getLocation({ city: text })
        .then((data) => {
          // console.log('Location data:', data);
          setLoactions(data);
        })
        .catch((error) => {
          console.error('Error fetching location:', error);
        });
    }
  };

  const textDebounce = useCallback(debounce(handleCity, 1000), []);
  let { current, location } = weatherData || { current: {}, location: {} };
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
  });

  return (
    <View className="relative flex-1">
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/balls.png')}
        blurRadius={12}
        className="absolute h-full w-full"
      />

      {/* search button */}
      <SafeAreaView className="flex-1 pt-20">
        <View className="absolute top-0 z-50 my-[4.5rem] min-h-[7%] w-full px-6">
          <View
            className={`flex flex-row items-center justify-center ${isSearching ? 'rounded-full bg-black/50 py-2' : 'rounded-md py-8'}`}>
            {isSearching ? (
              <TextInput
                onChangeText={textDebounce}
                placeholder="Search City"
                className="w-full text-center text-white"
                placeholderTextColor="rgba(255, 255, 255, 0.8)"
              />
            ) : null}

            <TouchableOpacity
              onPress={() => setIsSearching(!isSearching)}
              className="absolute right-1.5 rounded-full bg-white/20 p-3.5">
              {!isSearching ? (
                <MagnifyingGlassIcon size={20} color="white" />
              ) : (
                <XMarkIcon size={20} color={'white'} />
              )}
            </TouchableOpacity>
          </View>

          {/* locations */}
          <View>
            {locations.length > 0 && isSearching ? (
              <View className="absolute top-1 w-full rounded-3xl bg-black/80 opacity-90 backdrop:blur-3xl">
                {locations.map((l, i) => {
                  const isLast = i === locations.length - 1;
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={handleLocationPress(l)}
                      className={`mb-1 flex flex-row items-center justify-center p-3 px-4 text-center ${!isLast ? ' border-b border-b-white/30' : ''}`}>
                      <MapPinIcon size={20} color="rgba(255,255,255,0.7)" />
                      <Text className="text-lg text-white">
                        {' '}
                        {l.name},{l.country == 'India' ? ` ${l.region}` : ` ${l.country}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>

        {/* forecast section */}
        <View className="w-full flex-1 items-center justify-start">
          {/* loaction and date */}
          <View className="my-16 w-full px-6">
            <Text
              className="w-full text-left text-5xl text-white"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
              {location?.name},
              <Text className="text-3xl text-white/90">{' ' + location?.country}</Text>
            </Text>
            <Text className="text-2xl text-white/70">{' ' + date}</Text>
          </View>

          {/* image and temperature */}
          <View className="mx-6 flex w-full flex-col items-center justify-center gap-2">
            {/* <Image source={require('../assets/images/partlycloudy.png')} className="h-40 w-40" /> */}
            <Image source={{ uri: 'https:' + current?.condition?.icon }} className="h-40 w-40" />
            <Text
              className="text-center text-6xl text-white"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
              {current?.temp_c}&#176;C
            </Text>
            <Text
              className="text-center text-2xl text-white"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
              {current?.condition?.text}
            </Text>
          </View>

          {/* weather details */}
          <View className="min-gap-4 mt-10 flex w-full flex-row items-center justify-around">
            <View className="flex flex-col items-center justify-center">
              <Image source={require('../assets/icons/drop.png')} className="h-8 w-8" />
              <Text className="text-white">Humidity</Text>
              <Text className="text-white/70">60%</Text>
            </View>

            <View className="flex flex-col items-center justify-center">
              <Image source={require('../assets/icons/wind.png')} className="h-8 w-8" />
              <Text className="text-white">Wind</Text>
              <Text className="text-white/70">15 km/h</Text>
            </View>

            <View className="flex flex-col items-center justify-center">
              <Image source={require('../assets/icons/sun.png')} className="h-8 w-8" />
              <Text className="text-white">Sunrise</Text>
              <Text className="text-white/70">06:12 AM</Text>
            </View>
          </View>

          {/* next 7 days */}
          <View className="mt-10 w-full">
            <View className="mx-6 flex w-full flex-row items-center justify-start gap-2">
              <CalendarDaysIcon size={25} color="white" />{' '}
              <Text className="text-xl text-white">This Week</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
              className="mt-4 flex flex-row gap-4 overflow-scroll">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <View
                  key={index}
                  className="mx-2 flex flex-col items-center rounded-3xl bg-white/15 px-6 py-4">
                  <Image source={require('../assets/images/sun.png')} className="h-14 w-14" />
                  <Text className="text-white">{day}</Text>
                  <Text className="text-white/70">30&#176;C</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
