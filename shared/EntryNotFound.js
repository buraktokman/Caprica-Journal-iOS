import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default function EntryNotFound({title, style}) {
  const title2 = title
    ? title // "Sorry, I couldn't find any entry"
    : "You haven't entered anything.";
  return <Text style={styles.noEntry}>{title2}</Text>;
}

const styles = StyleSheet.create({
  noEntry: {
    fontSize: 15,
    fontWeight: '400',
    color: '#657786',
    marginHorizontal: 15,
    marginVertical: 13,
    letterSpacing: -0.26,
  },
});
