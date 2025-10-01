import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function ECGBackground() {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(0);
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, [translateX]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.ecgLine,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.ecgPattern} />
      </Animated.View>
      <Animated.View
        style={[
          styles.ecgLine,
          {
            transform: [{ translateX: Animated.add(translateX, screenWidth) }],
          },
        ]}
      >
        <View style={styles.ecgPattern} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    overflow: 'hidden',
  },
  ecgLine: {
    position: 'absolute',
    top: '50%',
    width: screenWidth * 2,
    height: 2,
    backgroundColor: '#00FF00',
  },
  ecgPattern: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00FF00',
  },
});