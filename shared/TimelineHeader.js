import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, StatusBar} from 'react-native';
// import {BlurView} from 'expo-blur';

import {colors} from '../src/styles';

export default function TimelineHeader({title, style}) {
  return (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      {/* <SafeAreaView /> */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 1, // 8,
    // paddingLeft: 22,
    paddingRight: 13.5,
    backgroundColor: 'white',
    // opacity: 0.7,
    // backgroundColor: 'rgba(52, 52, 52, 0.8)',
    // backgroundColor: 'transparent',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Neon',
    fontWeight: '700',
    color: colors.blue,
    //  letterSpacing: -0.65,
  },
});
