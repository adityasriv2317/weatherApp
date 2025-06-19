import React, { useState, useRef, useEffect, useCallback } from 'react';

import { Image, View, Text } from 'react-native';
import { Animated } from 'react-native';
import { TouchableOpacity, TextInput, Keyboard } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPinIcon, XMarkIcon } from 'react-native-heroicons/solid';
import LottieView from 'lottie-react-native';
import debounce from 'lodash.debounce';
import { storeData } from 'utils/storage';

import { getLocation } from 'api/handler';

export function SetLocation({ navigation }) {
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchText, setText] = useState('');

  const [locations, setLoactions] = useState([]);

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

  const handleLocationPress = (location) => () => {
    setLoading(true);
    const city = location.name;
    storeData('defaultCity', city);
    setLoading(false);
    setIsSearching(false);
    console.log(navigation.navigate('Home'));
    Keyboard.dismiss();
    // navigation.navigate('Home');
    console.log('Selected location:', location);
    navigation.navigate('Home');
    setLoactions([]);
  };

  return (
    <View className="relative flex-1">
      <StatusBar style="light" />
      <Image
        className="absolute h-full w-full opacity-50"
        blurRadius={50}
        source={require('../assets/images/bga.png')}
      />

      <SafeAreaView className="flex-1 items-center">
        <View className="fixed z-50 mt-32 items-center justify-center">
          <LottieView
            autoPlay
            source={require('../assets/animations/cloudAnim.json')}
            style={{ width: 250, height: 250 }}
            loop
          />
          <Text className="text-lg text-white">Select your city to continue</Text>
        </View>
        <View className="z-10 flex h-full w-full items-start bg-white pt-6">
          <View className="z-100 min-h-[7%] w-full px-6">
            <View
              className={`flex flex-row items-center justify-center rounded-full bg-black/50 py-2`}>
              <TextInput
                onChangeText={(text) => {
                  setText(text);
                  setIsSearching(true);
                  textDebounce(text);
                }}
                value={searchText}
                onFocus={() => setIsSearching(true)}
                placeholder="Search City"
                className="w-full text-center text-white"
                placeholderTextColor="rgba(255, 255, 255, 0.8)"
              />

              <TouchableOpacity
                onPress={() => {
                  if (isSearching) {
                    setIsSearching(false);
                    setLoactions([]);
                    textDebounce.cancel();
                    Keyboard.dismiss();
                    setText('');
                  } else {
                  }
                }}
                className="absolute right-1.5 rounded-full bg-white/20 p-3.5">
                {isSearching ? (
                  <XMarkIcon size={20} color={'white'} />
                ) : (
                  <MapPinIcon size={20} color={'white'} className="ml-2" />
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
      </SafeAreaView>
    </View>
  );
}

export default SetLocation;

// export function withFadeIn(WrappedComponent) {
//   return function FadeInWrapper(props) {
//     const fadeAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//       fadeAnim.setValue(0);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 700,
//         useNativeDriver: true,
//       }).start();
//     }, [fadeAnim]);

//     return (
//       <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: 'black' }}>
//         <WrappedComponent {...props} />
//       </Animated.View>
//     );
//   };
// }

// export default withFadeIn(SetLocation);
