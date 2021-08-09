import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {observer, inject} from 'mobx-react';

import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';

@inject('store')
@observer
class ButtonNewCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const vibration = this.props.store.settings.vibration;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.toggleModal();
          vibration && haptic('impactLight');
        }}>
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
    );
  }
}
export default ButtonNewCategory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    zIndex: 1,
    position: 'absolute',
    bottom: 13,
    right: 11,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
  text: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#FEFFFE',
    fontSize: 23.5,
    lineHeight: 25.5,
    // width: 50,
    marginLeft: 1.0,
  },
});
