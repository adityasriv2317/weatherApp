import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarDaysIcon, MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import debounce from 'lodash.debounce';

import { getLocation, getWeather } from 'api/handler';
import { weatherIcon } from 'constants';
import { storeData, getData } from 'utils/storage';
import { Indicator } from 'components/Loader';
import SlidingText from 'components/LocationHeader';
import LottieView from 'lottie-react-native';
import { lottieAnimation } from 'constants';

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  let updated = false;

  const [locations, setLoactions] = useState([]);

  const [weatherData, setWeatherData] = useState(null);

  const handleLocationPress = (location) => async () => {
    setLoading(true);
    const city = location.name;
    setLoactions([]);
    await getWeather({ city, days: 7 })
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
    // .finally(() => {
    storeData('city', city);
    setLoading(false);
    setIsSearching(false);
    // });
  };

  useEffect(() => {
    fetchInitialWeather();
  }, []);

  const fetchInitialWeather = async () => {
    setLoading(true);
    const city = await getData('defaultCity');
    await getWeather({ city, days: 7 })
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error('Error fetching initial weather data:', error);
      });
    setLoading(false);
  };

  const handleCity = (text) => {
    // console.log('Searching for city:', text);
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
  let { current, location, forecast } = weatherData || { current: {}, location: {} };
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
  });
  
  // console.log(location);

  return (
    <View className="relative flex-1">
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/bgb.jpg')}
        blurRadius={60}
        className="absolute h-full w-full"
      />

      {/* search button */}
      <SafeAreaView className="z-50 flex-1 pt-20">
        <View className="z-100 absolute top-0 my-[4.5rem] min-h-[7%] w-full px-6">
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
              onPress={() => {
                setIsSearching(!isSearching);
              }}
              className="absolute right-1.5 rounded-full bg-white/20 p-3.5">
              {!isSearching ? (
                <MagnifyingGlassIcon size={20} color="white" />
              ) : (
                <XMarkIcon size={20} color={'white'} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* forecast section */}
        <View className="w-full flex-1 items-center justify-start">
          {/* loaction and date */}
          <View className="my-14 w-full px-6">
            <SlidingText
              city={location?.name ?? ''}
              country={location?.country ?? ''}
              updated={(updated = !updated)}
            />
            <Text
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
              className="text-2xl text-white/90">
              {' ' + date}
            </Text>
          </View>

          {/* image and temperature */}
          <View className="mx-6 flex w-full -translate-y-8 flex-col items-center justify-center gap-2">
            <LottieView
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
              source={lottieAnimation[current?.condition?.text]}
            />
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
          <View className="min-gap-4 flex w-full flex-row items-center justify-around">
            <View className="flex flex-col items-center justify-center">
              <Image source={require('../assets/icons/drop.png')} className="h-8 w-8" />
              <Text className="text-white">Humidity</Text>
              <Text className="text-white/80">{current.humidity}%</Text>
            </View>

            <View className="flex flex-col items-center justify-center">
              <Image source={require('../assets/icons/wind.png')} className="h-8 w-8" />
              <Text className="text-white">Wind</Text>
              <Text className="text-white/80">{current.wind_kph} km/h</Text>
            </View>

            <View className="flex flex-col items-center justify-center">
              <Image source={require('../assets/icons/sun.png')} className="h-8 w-8" />
              <Text className="text-white">Sunrise</Text>
              <Text className="text-white/80">{forecast?.forecastday[0]?.astro?.sunrise}</Text>
            </View>
          </View>

          {/* next 7 days */}
          <View className="mt-10 w-full">
            <View className="mx-6 flex w-full flex-row items-center justify-start gap-2">
              <CalendarDaysIcon size={25} color="white" />
              <Text className="text-xl text-white"> This Week</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
              className="mt-4 flex flex-row gap-4 overflow-scroll">
              {forecast?.forecastday?.map((day, i) => {
                const dateObj = new Date(day.date).toLocaleDateString('en-US', {
                  // weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                });

                return (
                  <View
                    key={i}
                    className="mx-2 flex flex-col items-center rounded-3xl bg-white/15 px-6 py-4">
                    <Image
                      source={
                        weatherIcon[day?.day?.condition?.text]
                          ? weatherIcon[day?.day?.condition?.text]
                          : { uri: 'https:' + day?.day?.condition?.icon }
                      }
                      className="h-14 w-14"
                    />
                    <Text className="text-white">{dateObj}</Text>
                    <Text className="text-white/70">{day?.day?.avgtemp_c}&#176;C</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
      {/* loader */}
      {isSearching || weatherData === null ? (
        <View className="absolute z-50 h-full w-full flex-1 items-center justify-center bg-slate-800 opacity-90 backdrop:blur-3xl">
          {loading ? (
            <Indicator size={80} />
          ) : (
            <Text className="rounded-full bg-black/30 px-4 py-2 text-xl text-white">
              Search your city
            </Text>
          )}

          <View className="z-100 absolute top-0 my-[4.5rem] min-h-[7%] w-full px-6">
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
                onPress={() => {
                  setIsSearching(!isSearching);
                }}
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
        </View>
      ) : null}
    </View>
  );
}
