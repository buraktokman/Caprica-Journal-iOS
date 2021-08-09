import React, {Fragment, useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  LightenDarkenColor,
  textColor,
  timeAgo,
  timeDifference,
} from '../src/utils';
import {colors} from '../src/styles';

export default function EntryTimeline(props) {
  const {
    category,
    entry,
    index,
    previousTime,
    showTimeline,
    showBottomTime,
    showTimeAgo,
    showMenuArrow,
    onPress,
  } = props;

  const [timelineHeight, setTimelineHeight] = useState(30);

  const entryTime = `${
    (entry.date.getHours() < 10 ? '0' : '') + entry.date.getHours()
  }:${(entry.date.getMinutes() < 10 ? '0' : '') + entry.date.getMinutes()}`;

  const bottomTimeFormat = timeDifference(entry.date, previousTime);
  const ago = timeAgo(entry.date);

  const measureView = (event) => {
    setTimelineHeight(event.nativeEvent.layout.height * 0.5);
  };

  useEffect(() => {});

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.entryRow}
      onPress={() => onPress()}>
      <View style={styles.columnLeft}>
        <View style={{}}>
          <LinearGradient
            colors={[
              LightenDarkenColor(category.color, 5),
              category.color,
              LightenDarkenColor(category.color, -10),
            ]}
            style={[styles.entryBadge]}>
            <Text
              style={[styles.entryTime, {color: textColor(category.color)}]}>
              {entryTime}
            </Text>
          </LinearGradient>
          <View
            style={{
              position: 'absolute',
              left: 7,
              top: 1,
            }}>
            <Text style={styles.iconBadge}>{category.icon}</Text>
          </View>
        </View>
        {showTimeline && (
          <View style={[styles.timeLine, {height: timelineHeight}]} />
        )}
      </View>
      <View style={styles.columnRight} onLayout={(event) => measureView(event)}>
        <View style={styles.entryTop}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.entryTitleText, {color: category.color}]}>
              {category.name}
            </Text>
          </View>
        </View>
        <View style={styles.entryContent}>
          <Text style={styles.entryContentText}>{entry.content}</Text>
        </View>
        <View style={{paddingTop: 25}}>
          {showBottomTime && (
            <LinearGradient
              colors={[category.color, LightenDarkenColor(category.color, -5)]}
              style={[styles.entryBottomTime]}>
              <Text style={{color: textColor(category.color)}}>
                {bottomTimeFormat}
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ago: {
    color: '#657786',
    fontSize: 15,
  },
  agoDot: {
    color: '#657786',
    fontSize: 10,
    paddingHorizontal: 3,
    lineHeight: 16,
  },
  menuArrow: {
    color: '#657786',
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryTitleText: {
    fontSize: 15.5,
    fontWeight: '500',
  },
  entryRow: {
    paddingLeft: 15,
    marginBottom: 6,
    flexDirection: 'row',
  },
  entryBadge: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginTop: 7,
    paddingBottom: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  entryTime: {
    fontSize: 15,
  },
  iconBadge: {
    fontSize: 34,
  },
  timeBadge: {
    fontSize: 15,
    color: '#4B4208',
  },
  entryCategory: {},
  entryContent: {
    marginTop: 1,
  },
  entryContentText: {
    color: colors.black,
    fontSize: 15,
    letterSpacing: -0.26,
  },
  entryBottomTime: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 9,
    paddingRight: 7,
    paddingLeft: 8,
  },
  columnRight: {
    width: '84%',
    borderBottomColor: '#CCD5DD',
    borderBottomWidth: 0.5,
    marginTop: 7,
    marginLeft: 9,
  },
  columnLeft: {},
  timeLine: {
    alignSelf: 'center',
    marginTop: 62,
    height: 30,
    borderLeftColor: '#2F3336',
    borderLeftWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },
});
