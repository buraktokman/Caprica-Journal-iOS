import 'react-native-gesture-handler';
import React, {Fragment, Component} from 'react';
import {
  StyleSheet,
  View,
  YellowBox,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// import {AppLoading} from 'expo';
import * as Font from 'expo-font';
import {Provider} from 'mobx-react';

import Navigator from '../shared/Navigator';
import {getPurchases, getValidItems} from '../src/subscribe';
import StateStore from '../src/store';

const store = (window.store = new StateStore());

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      startScreen: false,
    };
  }

  // ------ HANDLE ------

  setLoading = (val) => {
    this.setState({loading: val});
  };

  setStartScreen = (val) => {
    this.setState({startScreen: val});
  };

  // ------ LIFE ------

  async componentDidMount() {
    console.log(`APP > loading application...`);
    // Wait font load
    await Font.loadAsync({
      Neon: require('../assets/fonts/neon.ttf'),
    });

    // INIT STATES
    await store.loadStates();

    // Check User Subscription
    const subStatus = await store.checkSubscriptionStatus();
    const startScreen = subStatus ? 'Timeline' : 'Intro';
    // const startScreen = 'Timeline';
    await this.setStartScreen(startScreen);

    // Sort categories by count
    // store.sortCategoriesByCount();
    // Hide ActivityIndicator
    this.setLoading(false);
    // Hide SplashScreen
    SplashScreen.hide();
  }

  render() {
    console.log('APP.js > initiated');
    const {loading, startScreen} = this.state;

    // store.wipeStorage()

    if (!loading) {
      console.log('APP > font load completed');
      return (
        <Provider store={store}>
          <Navigator startScreen={startScreen} />
        </Provider>
      );
    } else {
      console.log('APP > waiting font load');
      return (
        <Fragment>
          <View style={styles.app}>
            <StatusBar hidden />
            <ActivityIndicator />
          </View>
        </Fragment>
      );
    }
  }
}

// Hide Warnings
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Switch',
]);

const styles = StyleSheet.create({
  app: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
