/*
https://momentjs.com/
*/
import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import moment from 'moment';

import {timeAgo, formatDate, time_diff_hours} from '../src/utils';

export default function EntryDate({date, showTimeAgo, style}) {
  // Today
  // Yesterday
  const timeDiff = time_diff_hours(new Date(), date);
  const dayLong = moment(date).format('dddd');
  const dayShort = moment(date).format('ddd');
  const day =
    formatDate(new Date()) === formatDate(date)
      ? `Today • ${dayShort}`
      : timeDiff <= 48
      ? `Yesterday • ${dayShort}`
      : dayLong;
  const dateTemp = moment(date).format('MMMM D, YYYY'); // 'MMMM Do YYYY, h:mm:ss a'

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.day}>{day}</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.date}>{dateTemp}</Text>
        {showTimeAgo && (
          <Fragment>
            <Text style={styles.textAgoDot}>•</Text>
            <Text style={styles.textAgo}>{timeAgo(date)}</Text>
          </Fragment>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 2,
    marginLeft: 15, // 21,
    backgroundColor: 'white',
  },
  day: {
    fontSize: 15.5,
    color: '#222426',
    fontWeight: '600',
    letterSpacing: -0.26,
  },
  date: {
    fontSize: 15.5,
    color: '#6E767D',
    // fontWeight: '',
    letterSpacing: -0.36,
  },
  textAgo: {
    color: '#657786',
    fontSize: 15,
    fontWeight: '400',
  },
  textAgoDot: {
    color: '#657786',
    fontSize: 10,
    paddingHorizontal: 3,
    lineHeight: 16,
  },
});
