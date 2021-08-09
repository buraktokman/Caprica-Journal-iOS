import {StyleSheet} from 'react-native';

export const colors = {
  black: '#14171A',
  lightblue: '#41C0FF',
  blue: '#1DA1F2',
  darkBlue: '#1573AD',
  green: '#17BF63',
  red: '#FC3D39',
  white: '#FEFEFE',
};

export const globalStyles = StyleSheet.create({
  // Text
  semiBold: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: '600',
  },
  screenTitle: {
    color: colors.black,
  },
  // Component
  entryModal: {
    flex: 1,
    margin: 0,
    width: '100%',
    height: '100%',
  },
});
