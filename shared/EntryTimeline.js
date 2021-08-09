import React, {Fragment, PureComponent, Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {observer, inject} from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {SvgXml} from 'react-native-svg';
import Logo from '../res/ico/caprica-icon-white.svg';
import {colors} from '../src/styles';

import {
  LightenDarkenColor,
  textColor,
  timeAgo,
  timeDifference,
} from '../src/utils';

@inject('store')
@observer
class EntryTimeline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {timelineHeight: 30};
  }

  measureView = (event) => {
    // console.log('event properties: ', event);
    // console.log('width: ', event.nativeEvent.layout.width);
    // console.log('height: ', event.nativeEvent.layout.height);
    this.setState({
      timelineHeight: parseFloat(event.nativeEvent.layout.height * 0.5),
    });
  };

  render() {
    const {
      category,
      entry,
      onPress,
      previousTime,
      showTimeline,
      showBottomTime,
      showTimeAgo,
      showMenuArrow,
    } = this.props;
    const {timelineHeight} = this.state;

    const entryTime = `${
      (entry.date.getHours() < 10 ? '0' : '') + entry.date.getHours()
    }:${(entry.date.getMinutes() < 10 ? '0' : '') + entry.date.getMinutes()}`;
    // const entryDate = moment(entry.date).format('dddd, MMM D, YYYY');

    const bottomTimeFormat = timeDifference(entry.date, previousTime);
    const ago = timeAgo(entry.date);

    const gradientColors = [
      LightenDarkenColor(category.color, 5),
      category.color,
      // category.color,
      // category.color,
      LightenDarkenColor(category.color, -5),
    ];

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.entryRow}
        onPress={() => onPress()}>
        <View style={styles.columnLeft}>
          <View style={{}}>
            <LinearGradient
              colors={gradientColors}
              // start={{x: 0, y: 0}}
              // end={{x: 1, y: 1}}
              style={[styles.entryBadge]}>
              {category.id !== 'Caprica' && (
                <Text
                  style={[
                    styles.entryTime,
                    {color: textColor(category.color)},
                  ]}>
                  {entryTime}
                </Text>
              )}
            </LinearGradient>
            {category.id === 'Caprica' ? (
              <View style={styles.containerCaprica}>
                <SvgXml width="36" height="36" xml={Logo} />
              </View>
            ) : (
              <View style={styles.containerIcon}>
                <Text style={styles.iconBadge}>{category.icon}</Text>
              </View>
            )}
          </View>
          {showTimeline && (
            <View style={[styles.timeLine, {height: timelineHeight}]} />
          )}
        </View>
        <View
          style={styles.columnRight}
          onLayout={(event) => this.measureView(event)}>
          <View style={styles.entryTop}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.entryTitleText,
                  {color: LightenDarkenColor(category.color, -8)},
                ]}>
                {category.name}
              </Text>
              {showTimeAgo && category.id !== 'Caprica' && (
                <Fragment>
                  <Text style={styles.agoDot}>•</Text>
                  <Text style={styles.ago}>{ago}</Text>
                </Fragment>
              )}
            </View>
            {showMenuArrow && (
              <View style={{marginRight: 16.96}}>
                <Ionicons name={'ios-arrow-down'} size={16} color="#AAB8C2" />
              </View>
            )}
          </View>
          <View style={styles.entryContent}>
            <Text style={styles.entryContentText}>{entry.content}</Text>
          </View>
          <View style={{paddingTop: 25}}>
            {showBottomTime && category.id !== 'Caprica' && (
              <LinearGradient
                colors={[
                  LightenDarkenColor(category.color, 5),
                  category.color,
                  category.color,
                  category.color,
                  LightenDarkenColor(category.color, -5),
                ]}
                style={[styles.entryBottomTime]}>
                <Text
                  style={[
                    styles.entryBottomTimeText,
                    {color: textColor(category.color)},
                  ]}>
                  {bottomTimeFormat}
                </Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default EntryTimeline;

const styles = StyleSheet.create({
  containerIcon: {
    position: 'absolute',
    left: 7,
    top: 1,
  },
  containerCaprica: {
    position: 'absolute',
    left: 8,
    top: 14,
  },
  ago: {
    color: '#657786',
    fontSize: 15,
    fontWeight: '400',
  },
  agoDot: {
    color: '#657786',
    fontSize: 10,
    paddingHorizontal: 3,
    lineHeight: 16,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryTitleText: {
    fontSize: 15.5,
    fontWeight: '500',
    letterSpacing: -0.36,
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
    letterSpacing: -0.26,
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
    marginRight: 16.52,
  },
  entryBottomTime: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 9,
    paddingRight: 7,
    paddingLeft: 8,
  },
  entryBottomTimeText: {
    fontWeight: '400',
    fontSize: 13.5,
    letterSpacing: -0.26,
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
