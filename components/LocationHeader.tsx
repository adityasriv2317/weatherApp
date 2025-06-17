import { Text, View, Animated, Easing } from 'react-native';
import { useEffect, useRef, useState } from 'react';

type Props = {
  city: string;
  country: string;
  updated: boolean;
};

const LocationHeader = ({ city, country, updated }: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [containerMeasured, setContainerMeasured] = useState(false);
  const [textMeasured, setTextMeasured] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Reset measurement when city/country/updated changes
  useEffect(() => {
    setContainerMeasured(false);
    setTextMeasured(false);
    animatedValue.stopAnimation();
    animatedValue.setValue(0);
    if (animationRef.current) {
      animationRef.current.stop();
    }
  }, [city, country, updated]);

  useEffect(() => {
    if (containerMeasured && textMeasured && containerWidth && textWidth) {
      if (textWidth > containerWidth) {
        animationRef.current = Animated.loop(
          Animated.timing(animatedValue, {
            toValue: -(textWidth - containerWidth),
            duration: (textWidth + containerWidth) * 5,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
        animationRef.current.start();
      } else {
        animatedValue.stopAnimation();
        animatedValue.setValue(0);
        if (animationRef.current) {
          animationRef.current.stop();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerMeasured, textMeasured, containerWidth, textWidth]);

  // Hidden row for accurate text width measurement
  if (!containerMeasured || !textMeasured) {
    return (
      <View
        className="w-full overflow-hidden"
        onLayout={(e) => {
          setContainerWidth(e.nativeEvent.layout.width);
          setContainerMeasured(true);
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            opacity: 0,
          }}
          onLayout={(e) => {
            setTextWidth(e.nativeEvent.layout.width);
            setTextMeasured(true);
          }}>
          <Text
            className="text-left text-5xl text-white"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {city},
          </Text>
          <Text className="text-3xl text-white/90" style={{ marginLeft: 4 }}>
            {' ' + country}
          </Text>
        </View>
      </View>
    );
  }

  // Animated row if overflowing, static otherwise
  return (
    <View
      className="w-full overflow-hidden"
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
        setContainerMeasured(true);
      }}>
      {textWidth > containerWidth ? (
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            transform: [{ translateX: animatedValue }],
            width: textWidth,
          }}>
          <Text
            className="text-left text-5xl text-white"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {city},
          </Text>
          <Text className="text-3xl text-white/90" style={{ marginLeft: 4 }}>
            {' ' + country}
          </Text>
        </Animated.View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text
            className="text-left text-5xl text-white"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {city},
          </Text>
          <Text className="text-3xl text-white/90" style={{ marginLeft: 4 }}>
            {' ' + country}
          </Text>
        </View>
      )}
    </View>
  );
};

export default LocationHeader;
