import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {colors} from '../src/styles';

export default function IntroHeader({goBack, onPressRight, color, title}) {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView />
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
          onPress={() => goBack()}>
          {/* <Text style={[styles.editButton, {color: color}]}>Back</Text> */}
          <Ionicons name={'ios-arrow-back'} size={24} color={color} />
        </TouchableOpacity>
        {onPressRight && (
          <TouchableOpacity onPress={() => onPressRight()}>
            <Text style={[styles.editButton, {color: color}]}>{title}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'pink',
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 16,
    marginRight: 17,
  },
  goBackButton: {},
  editButton: {
    color: colors.blue,
    fontSize: 17,
  },
  header: {
    flex: 1,
    // backgroundColor: '#F8F7F8',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
