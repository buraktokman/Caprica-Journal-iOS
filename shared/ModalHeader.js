import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  // SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {observer, inject} from 'mobx-react';

import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';

@inject('store')
@observer
class ModalHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      // mode,
      children,
      onCancel,
      handlerAdd,
      handlerEdit,
      // color,
      style,
    } = this.props;
    const vibration = this.props.store.settings.vibration;

    return (
      <View style={[styles.container, style]}>
        {/* <SafeAreaView /> */}
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onCancel()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>

          {children && (
            <View
              style={{
                // position: 'absolute',
                // top: 44,
                alignSelf: 'center',
              }}>
              {children}
            </View>
          )}
         
          <TouchableOpacity
            onPress={() => {
              vibration && haptic('impactLight');
              handlerEdit ? handlerEdit() : handlerAdd();
            }}>
            <View style={[styles.addButton]}>
              <Text style={[styles.editButton]}>
                {handlerEdit ? 'Save' : 'Add'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ModalHeader;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 16,
    marginRight: 17,
  },
  goBackButton: {},
  addButton: {
    backgroundColor: colors.blue,
    borderRadius: 17,
    width: 67,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    color: '#FEFFFE',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 17,
    color: colors.blue,
    paddingTop: 6,
  },
  header: {
    flex: 1,
    // backgroundColor: '#F8F7F8',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
