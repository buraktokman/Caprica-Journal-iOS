import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, StatusBar} from 'react-native';

export default function TitleScreen({title, style}) {
  return (
    <View style={[styles.container, style]}>
      <SafeAreaView />
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 8,
    marginLeft: 33,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 26,
    // fontFamily:,
    fontWeight: '600',
    color: 'black',
    //  letterSpacing: -0.65,
  },
});
