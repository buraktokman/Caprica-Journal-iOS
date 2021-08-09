import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Alert,
  Linking,
  Animated,
  ScrollView,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SvgXml} from 'react-native-svg';

import {VERSION} from '../AppData.json';
import Logo from '../res/ico/caprica-icon-blue.svg';
import ButtonIntro from '../shared/ButtonIntro';
import IntroHeader from '../shared/IntroHeader';
import {colors} from '../src/styles';
import {newSubscribe, restoreSubscribe} from '../src/subscribe';

export default class IntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      buttonText: 'black', // this.props.route.params.buttonText,
      btnTextColor: null, // '#BFD4BF',
      btnColor: 'pink', // this.props.route.params.color,
      title: 'title',
      description: 'desc',
      // screenHeight: Dimensions.get('window').height,
      scrollHeight: 0, // new Animated.Value(0),
    };
    this.navigation = props.navigation;
  }

  // ------- CHANGE ----------–---

  changeBtnText = (val) => {
    this.setState({buttonText: val});
  };
  changeBtnTextColor = (color) => {
    this.setState({btnTextColor: color});
  };
  changeBtnColor = (color) => {
    this.setState({btnColor: color});
  };
  changeTitle = (val) => {
    this.setState({title: val});
  };
  changeDescription = (val) => {
    this.setState({description: val});
  };

  toggleProcessing = (val) => {
    this.setState({processing: val});

    if (val === true) {
      this.changeBtnText('Loading...');
      this.changeBtnColor('#119A4F');
      // this.changeBtnTextColor('#BFD4BF');
    } else {
      this.changeBtnText('Try It Free');
      this.changeBtnColor(colors.green);
      // this.changeBtnTextColor('white');
    }
  };

  // ------- HANDLER ----------–---

  handlerContinueButton = async () => {
    const {name} = this.props.route;
    const {processing} = this.state;
    if (name === 'Intro_1') {
      this.navigation.navigate('Intro_2', {
        title: 'Log anything you want',
        description:
          '• unlimited categories\n• create your own\n• 300+ ready for you',
        color: colors.blue,
        buttonText: 'Continue',
      });
    } else if (name === 'Intro_2') {
      this.navigation.navigate('Intro_3', {
        title: "Remember everything you've done", // Always remember what you did
        description: '• today,\n• yesterday\n• and years back',
        color: colors.green,
        buttonText: 'Try It Free',
      });
    } else if (name === 'Intro_3') {
      // Disable button if pressed
      if (processing === false) {
        this.handleSubscribe();
      } else {
        console.log('CAUTION > button press ignored!');
      }
    }
    // Stop Scroll
    this.stopScroll();
  };

  handleSubscribe = async () => {
    // Active Process
    this.toggleProcessing(true);
    // Subscribe
    const subStatus = await newSubscribe('monthly');
    if (subStatus) {
      var count = 0;
      // REMOVE TIMER AFTER IPA IMPLANTED
      this.timer = setInterval(() => {
        if (count >= 0) {
          clearInterval(this.timer);
          // Stop Process
          this.toggleProcessing(false);
          // Go to timeline
          this.navigation.navigate('Timeline');
        } else {
          count++;
          console.log(count);
        }
      }, 1000);
    }
  };

  handleRestore = async () => {
    const {processing} = this.state;
    // Disable button if pressed
    if (processing === true) {
      console.log('CAUTION > button press ignored!');
      return false;
    }

    // Active Process
    this.toggleProcessing(true);
    // Subscribe
    const subStatus = await restoreSubscribe();
    // Stop Process
    this.toggleProcessing(false);
    if (subStatus) {
      // Go to timeline
      this.navigation.navigate('Timeline');
    } else {
      Alert.alert(
        'No purchase found',
        'Are you sure you have active subscription?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              console.log('intro > open send email');
              Linking.openURL(
                `mailto:hello@bulrosa.com?subject=Restore Subscription - Caprica for iOS v${VERSION}`,
              ).catch((err) =>
                console.error('ERROR > cannot open send email', err),
              );
            },
            // style: 'destructive',
          },
        ],
        // {cancelable: false},
      );
    }
  };

  startScroll = () => {
    // Define scrollMax
    const {name} = this.props.route;
    var scrollMax = name === 'Intro_1' ? 1276 : 1676;

    // console.log('animate > start scroll till ' + scrollMax);
    // Animated.timing(this.state.scrollHeight, {
    //   toValue: scrollMax, // Value will change to
    //   duration: 30000,
    //   useNativeDriver: true,
    // }).start(() => {
    //   console.log('animate > end scroll');
    //   this.setState({scrollHeight: 0});
    // });

    // Start Animation
    this.timer = setInterval(() => {
      const {scrollHeight} = this.state;
      // Update State
      this.setState({
        scrollHeight: scrollHeight + 0.5,
      });
      // Stop @ bottom
      if (scrollHeight >= scrollMax) {
        this.setState({
          scrollHeight: 0,
        });
        clearInterval(this.timer);
      }
    }, 10);
  };

  stopScroll = () => {
    clearInterval(this.timer);
  };

  // ------- LIFE -----------------

  componentDidMount() {
    // Update from params
    const {title, description, buttonText, color} = this.props.route.params;
    this.changeBtnText(buttonText);
    // this.changeBtnTextColor();
    this.changeBtnColor(color);
    this.changeTitle(title);
    this.changeDescription(description);

    // Start Scroll (only on intro 1 & 2)
    const {name} = this.props.route;
    if (name === 'Intro_1' || name === 'Intro_2') {
      // this.startScroll();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const screenName = this.props.route.name;
    const {
      title,
      description,
      processing,
      buttonText,
      btnColor,
      btnTextColor,
      scrollHeight,
    } = this.state;
    // console.log('screen > ' + screenName);

    return (
      <SafeAreaView style={[styles.container, styles.modal]}>
        <StatusBar barStyle="dark-content" />
        {/* <IntroHeader
          onPressRight={() => this.handleRestore()}
          title="Restore"
          color={colors.green}
          goBack={() => this.navigation.goBack()}
        /> */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.goBack}
            onPress={() => this.navigation.goBack()}>
            <Ionicons name={'ios-arrow-back'} size={26} color={btnColor} />
          </TouchableOpacity>
          {this.props.route.name === 'Intro_3' && (
            <TouchableOpacity
              style={styles.restore}
              onPress={() => this.handleRestore()}>
              <Text style={styles.restoreText}>Restore</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* <Text style={styles.title}>Caprica </Text> */}
        <MaskedView
          maskElement={
            <LinearGradient
              style={styles.mask}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 0.035}}
              colors={['transparent', 'white']}
            />
          }
          style={[styles.containerCenter]}>
          <View
            style={{
              backgroundColor: 'white',
              flex: 1,
              paddingHorizontal: 47,
              paddingVertical: 7,
            }}>
            <Text style={styles.textWelcome}>{title}</Text>
            <View style={{marginTop: 23}}>
              <Text style={styles.text}>{description}</Text>
            </View>
          </View>
        </MaskedView>

        {screenName === 'Intro_1' && <Intro_1 offset={scrollHeight} />}
        {screenName === 'Intro_2' && <Intro_2 offset={scrollHeight} />}
        {screenName === 'Intro_3' && <Intro_3 />}

        {/* <View style={styles.containerIcon}>
          <SvgXml width="36" height="36" xml={Logo} />
        </View> */}

        <View style={styles.bottom}>
          <ButtonIntro
            title={buttonText}
            color={btnColor}
            textColor={btnTextColor}
            showActivity={processing}
            onPress={() => this.handlerContinueButton()}
          />
          {this.props.route.name === 'Intro_3' && (
            <Text style={[styles.textBottom]}>
              {/* {`One week free, then $3,99/month.`} */}
              {`Offer available only for limited time!`}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const Intro_1 = ({offset}) => {
  return (
    <ScrollView
      style={styles.containerImg1}
      decelerationRate={0.6}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{marginTop: -offset, alignItems: 'flex-end'}}>
      <Image style={styles.image1} source={{uri: 'intro-timeline.png'}} />
    </ScrollView>
  );
};

const Intro_2 = ({offset}) => {
  return (
    <ScrollView
      directionalLockEnabled={false}
      // horizontal={true}
      style={styles.containerImg2}
      decelerationRate={0.6}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{marginTop: -offset, alignItems: 'flex-start'}}>
      <Image style={styles.image2} source={{uri: 'intro-category.png'}} />
    </ScrollView>
  );
};

const Intro_3 = () => {
  return (
    <ScrollView
      style={styles.containerImg3}
      decelerationRate={0.6}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{alignItems: 'flex-end'}}>
      <Image style={styles.image3} source={{uri: 'intro-calendar.png'}} />
    </ScrollView>
  );
};

// let dimensions = Dimensions.get('window');
// const imageHeight = Math.round((dimensions.width * 9) / 10);
// const imageWidth = dimensions.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  image1: {
    flex: 1,
    width: 338,
    height: 1376,
    resizeMode: 'stretch',
    marginBottom: 320,
  },
  containerImg1: {
    position: 'absolute',
    top: 44,
    right: 0,
    height: 625,
    zIndex: 1,
    width: '100%',
    alignSelf: 'center',
  },

  image2: {
    flex: 1,
    width: 436,
    height: 1775,
    resizeMode: 'cover',
    marginLeft: 32,
    marginBottom: 320,
  },
  containerImg2: {
    position: 'absolute',
    top: 44,
    right: 0,
    height: 625,
    zIndex: 1,
    width: '100%',
    alignSelf: 'center',
  },

  image3: {
    flex: 1,
    width: 375,
    height: 675,
    resizeMode: 'stretch',
    marginTop: 8,
    marginBottom: 320,
  },
  containerImg3: {
    position: 'absolute',
    top: 44,
    right: 0,
    height: 625,
    zIndex: 1,
    width: '100%',
    alignSelf: 'center',
  },

  bottom: {
    // backgroundColor: 'pink',
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom: 36,
  },
  headerContainer: {
    zIndex: 2,
    marginTop: 12,
    // backgroundColor:'pink',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  goBack: {
    marginLeft: 16,
    width: 9,
  },
  restore: {
    marginRight: 17,
    marginTop: 6,
  },
  restoreText: {
    fontSize: 17,
    color: colors.green,
  },

  mask: {
    flex: 1,
  },
  containerCenter: {
    backgroundColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    top: 367, // 377
    // paddingHorizontal: 47,
    // paddingVertical: 7,
    opacity: 0.95,
    width: '100%',
    height: 300,
    // flex: 1,
    zIndex: 2,
  },
  containerIcon: {
    // backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 164,
  },
  title: {
    alignSelf: 'center',
    position: 'absolute',
    top: 342, // 402
    textAlign: 'center',
    fontSize: 26,
    letterSpacing: -0.85,
    fontFamily: 'Neon',
    fontWeight: '700',
    color: colors.blue,
    //  letterSpacing: -0.65,
  },
  text: {
    letterSpacing: -0.36,
    fontSize: 19,
    fontWeight: '500',
    color: '#B4BCC0',
  },
  textWelcome: {
    letterSpacing: -0.26,
    textAlign: 'center',
    fontSize: 27,
    fontWeight: '600',
    color: '#222426',
  },
  textBottom: {
    alignSelf: 'center',
    color: '#9A9BAA',
    fontSize: 12.5,
    position: 'absolute',
    bottom: 0,
    // marginBottom: 20,
  },
});
