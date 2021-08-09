import React, {Component} from 'react';
import {
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  View,
} from 'react-native';

export default class SubscribeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.navigation = props.navigation;
  }

  // ------ LIFE -----------------------

  // Load
  componentDidMount() {
    console.log('SubscribeScreen > did mount');
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <Text>SubscribeScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
