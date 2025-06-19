import { StatusBar } from 'expo-status-bar';
import { Image, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetLocation() {
  return (
    <View className="relative flex-1">
      <StatusBar style="light" />
      <Image
        className="absolute h-full w-full"
        blurRadius={50}
        source={require('../assets/images/bga.png')}
      />

      <SafeAreaView>
        <View>
          <Text>HII</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
