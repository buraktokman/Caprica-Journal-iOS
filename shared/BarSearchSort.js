import React, {Component} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {globalStyles, colors} from '../src/styles';

export default class BarSearchSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: 'Search',
    };
  }

  handlerSearch = (val) => {
    this.setState({searchText: val});
  };

  // ------- LIFE -----------------

  componentDidMount() {
    const {placeholder} = this.props;
    placeholder && this.handlerSearch(placeholder);
  }

  render() {
    const {searchText} = this.state;
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.searchInput}>
          <Ionicons
            name={'ios-search'}
            size={18}
            color="#667887"
            style={{marginTop: 2}}
          />
          <TextInput
            // autoCapitalize={'none'}
            style={styles.textInput}
            placeholder={searchText}
            placeholderTextColor="#657786"
            onChangeText={this.props.handlerSearch}
            // autoCorrect={false}
            clearButtonMode="always"
          />
        </View>
        {this.props.showSort && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.sortButton}
            onPress={this.props.handlerSort}>
            <Text style={styles.textSortButton}>Sort</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    // marginHorizontal: 21,
    // marginLeft: 24,
    // marginRight: 21,
    // marginTop: 23.5,
  },
  textInput: {
    flex: 1,
    color: colors.black,
    fontSize: 15.5,
    marginLeft: 8,
  },
  searchInput: {
    // justifyContent: 'center',
    paddingLeft: 18,
    alignItems: 'center',
    backgroundColor: '#E6EBEF',
    width: 275,
    height: 32,
    borderRadius: 15,
    flexDirection: 'row',
  },
  sortButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green,
    width: 53,
    height: 32,
    borderRadius: 17,
    marginLeft: 12,
  },
  textSortButton: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
