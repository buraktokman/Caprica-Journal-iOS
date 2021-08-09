import React, {PureComponent, Component} from 'react';
import {StyleSheet, FlatList, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {observer, inject} from 'mobx-react';

import {trimString} from '../src/utils';
import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';

@inject('store')
@observer
class NewEntryQuickText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // selected: this.props.selected,
    };
  }

  // ------ HANDLE ------

  handlerTextSelect = (entry, categories) => {
    // Vibrate
    const vibration = this.props.store.settings.vibration;
    vibration && haptic('impactLight');

    // Find entry's category
    let category = categories.filter((item) => {
      return item.name.toLowerCase().includes(entry.category.toLowerCase());
    });
    this.props.handlerContent(entry.content);
    this.props.handlerCategory(category[0]);
  };
  // ------ FLATLIST -------

  renderHeader = () => <Text style={styles.quickText}>QUICK TEXT</Text>;

  renderItem = ({item, index}) => {
    const {categories} = this.props;

    if (item.category !== 'Caprica') {
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.handlerTextSelect(item, categories)}>
          <Text style={styles.rowText}>{trimString(item.content, 50)}</Text>
        </TouchableOpacity>
      );
    }
  };

  // ------ LIFE -------

  componentDidMount() {}

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.select !== nextProps.select) {
  //     return true;
  //   }
  //   return false
  // }

  render() {
    const {entries, categories} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          keyExtractor={(item) => item.name}
          data={entries}
          ListHeaderComponent={this.renderHeader}
          renderItem={({item, index}) => this.renderItem({item, index})}
        />
      </View>
    );
  }
}

export default NewEntryQuickText;

const styles = StyleSheet.create({
  container: {
    width: 340,
    marginLeft: 16.5,
  },
  flatList: {
    // marginTop: 17,
  },
  quickText: {
    marginVertical: 17.5,
    fontSize: 13.5,
    color: '#657786',
  },
  row: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCD5DD',
    height: 32,
    marginBottom: 9,
    paddingBottom: 12.56,
    justifyContent: 'center',
    // alignItems: 'center'
  },
  rowText: {
    color: colors.black,
    letterSpacing: -0.26,
    fontSize: 13.5,
  },
});
