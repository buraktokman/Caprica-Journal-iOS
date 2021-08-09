import React, {Component} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class BarSearchCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: 'Search Category ',
    };
  }

  handlerSearch = (val) => {
    this.setState({searchText: val});
  };

  // ------- LIFE -----------------

  componentDidMount() {}

  render() {
    const {searchText} = this.state;
    return (
      <View style={styles.container}>
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
            clearButtonMode="always"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: 'lightgreen',
    flexDirection: 'row',
    // marginLeft: 24,
    // marginRight: 21,
    marginTop: 11,
  },
  textInput: {
    // color: ,
    flex:1,
    fontSize: 15.5,
    marginLeft: 8,
  },
  searchInput: {
    // justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 18,
    backgroundColor: '#E6EBEF',
    width: 270,
    height: 32,
    borderRadius: 15,
    // marginRight: 12,
    flexDirection: 'row',
  },
  searchIcon: {},
  searchText: {},
  searchTextBlack: {},
});
