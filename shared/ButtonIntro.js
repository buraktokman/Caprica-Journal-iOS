import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import {observer, inject} from 'mobx-react';

import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';

@inject('store')
@observer
class ButtonIntro extends Component {
  render() {
    const {title, color, textColor, style, onPress, showActivity} = this.props;
    const vibration = this.props.store.settings.vibration;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          vibration && haptic('impactLight');
          onPress();
        }}
        style={[style, styles.button, {backgroundColor: color}]}>
        {showActivity ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={[styles.textButton, textColor && {color: textColor}]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

export default ButtonIntro;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: colors.blue,
    width: 281,
    height: 49,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // Shadow
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  textButton: {
    // letterSpacing: -0.85,
    fontSize: 16.5,
    fontWeight: '600',
    color: '#FEFFFE',
  },
});
