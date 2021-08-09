import React, {Fragment, Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {LightenDarkenColor} from '../src/utils';

export default function LinearGradientView({color, children, style, onPress}) {
  const colors = [color, color, color, LightenDarkenColor(color, -8)];
  return <LinearGradient colors={color}>{children}</LinearGradient>;
}

const styles = StyleSheet.create({
  container: {},
});
