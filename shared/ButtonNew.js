import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {observer, inject} from 'mobx-react';

// import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {SvgXml} from 'react-native-svg';

import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';

@inject('store')
@observer
class ButtonNew extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const vibration = this.props.store.settings.vibration;
    const type = this.props.type;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.toggleModal();
          vibration && haptic('impactLight');
        }}>
        {type === 'entry' && (
          <Text style={styles.textEntry}>
            {/* <Ionicons name={'md-checkmark'} size={24} /> */}
            <Entypo name={'check'} size={24} />
            {/* <Text style={styles.textEntry}>{`${'\u2714'}`}✔</Text> */}
          </Text>
        )}
        {type === 'category' && <Text style={styles.textCategory}>+</Text>}
      </TouchableOpacity>
    );
  }
}

export default ButtonNew;

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
    shadowColor: 'black', // colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.26,
    shadowRadius: 1.02,

    elevation: 3,
  },
  textEntry: {
    marginTop: 4,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#FFF',
    fontSize: 23.5,
    fontFamily: 'Neon',
    // lineHeight: 25.5,
    // width: 50,
    marginLeft: 1.0,
    // Shadow
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.12,
    // shadowRadius: 2.22,

    // elevation: 1,
  },
  textCategory: {
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
