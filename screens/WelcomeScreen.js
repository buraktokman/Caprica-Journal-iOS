import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Button,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import Logo from '../res/ico/caprica-icon-blue.svg';
import ButtonIntro from '../shared/ButtonIntro';
import {colors} from '../src/styles';

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigation = props.navigation;
  }

  // ------- HANDLER ----------–---

  handlerContinueButton = () => {
    this.navigation.navigate('Intro_1', {
      title: 'See your life in a timeline',
      description: '• things you do daily …',
      color: colors.blue,
      buttonText: 'Continue',
    });
  };

  // ------- LIFE -----------------

  componentDidMount() {}

  render() {
    return (
      <View style={[styles.container, styles.modal]}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <SafeAreaView />
        <View style={styles.containerIcon}>
          <SvgXml width="72" height="71" xml={Logo} />
        </View>
        <View style={styles.containerCenter}>
          <Text style={styles.textWelcome}>Welcome</Text>
          <View style={{marginTop: 14}}>
            <Text style={{textAlign: 'center'}}>
              <Text style={styles.title}>Caprica </Text>
              <Text style={styles.text}>
                is a life companion to keep track of your moments
              </Text>
            </Text>
          </View>
          <View style={styles.bottom}>
            <ButtonIntro
              title="Let's Start"
              color={colors.blue}
              onPress={() => this.handlerContinueButton()}
            />
          </View>
        </View>

        <SafeAreaView />
      </View>
    );
  }
}

const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom: 20,
  },
  containerCenter: {
    // backgroundColor: 'pink',
    // flex: 1,
    // width: '50%',
    height: HEIGHT - 337,
    position: 'absolute',
    // top: 332,
    bottom: 0,
    paddingHorizontal: 47,
    paddingTop: 17,
    paddingBottom: 7,
  },
  containerIcon: {
    marginTop: 164,
  },
  title: {
    fontSize: 26,
    letterSpacing: -0.85,
    fontFamily: 'Neon',
    fontWeight: '700',
    color: colors.blue,
    //  letterSpacing: -0.65,
  },
  text: {
    letterSpacing: -0.26,
    fontSize: 19,
    fontWeight: '500',
    color: '#838A8E',
  },
  textWelcome: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '600',
    color: '#222426',
  },
});
