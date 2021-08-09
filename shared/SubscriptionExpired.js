import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {observer, inject} from 'mobx-react';

// import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {SvgXml} from 'react-native-svg';

import Card from '../res/svg/creditcard.svg';
import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';

@inject('store')
@observer
class SubscriptionExpired extends Component {
  // constructor(props) {
  //   super(props);
  // }
  onPress = () => {
    // Vibrate
    const vibration = this.props.store.settings.vibration;
    vibration && haptic('impactLight');
    // Navigate
    // this.props.onPress();

    this.props.navigation.navigate('Intro', {
      screen: 'Subscribe',
      // params: {title: 'Renew'},
    });
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.onPress()}
        activeOpacity={0.8}>
        <View style={styles.leftColumn}>
          <SvgXml width="57" height="43" xml={Card} />
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.titleText}>Subscription Expired</Text>
          <Text style={styles.contentText}>
            Caprica membership required for new entries. Tap here to renew.
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SubscriptionExpired;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEEBEF',
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: '',
    // flex: 1,
    width: '100%',
    height: 74,
    borderColor: '#FFD7D7',
    borderBottomWidth: 0.5,
  },
  titleText: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#222426',
  },
  contentText: {
    fontSize: 13,
    color: '#5B5B5B',
    // paddingRight: 16,
  },
  leftColumn: {
    // justifyContent: 'center',
    alignItems: 'center',
    width: 95,
  },
  rightColumn: {
    width: 280,
  },
});
