import React, {Component} from 'react';
import {
  StyleSheet,
  Button,
  Image,
  View,
  Alert,
  Linking,
  Platform,
  // ScrollView,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  // finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SvgXml} from 'react-native-svg';

// import {VERSION} from '../AppData.json';
import Logo from '../res/ico/caprica-icon-blue.svg';
import ButtonIntro from '../shared/ButtonIntro';
// import IntroHeader from '../shared/IntroHeader';
import {getAppVersion} from '../src/utils';
import {colors, globalStyles} from '../src/styles';
import {newSubscribe, restoreSubscribe} from '../src/subscribe';
import {ScrollView} from 'react-native-gesture-handler';

// Version
const VERSION = getAppVersion();
// Subscriptions
const IAP_SKUS = Platform.select({
  ios: ['com.bulrosa.caprica.monthly', 'com.bulrosa.caprica.yearly'],
  // android: [ 'com.example.coins100' ]
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class SubscribeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'One month free. Cancel anytime',
      processing: false,
      btnText: 'Try It Free',
      btnTextColor: 'white',
      btnColor: colors.green,
      // Transaction
      // receipt: null,
      priceMonthly: 0,
      priceYearly: 0,
    };
    this.navigation = props.navigation;
  }

  // ------- CHANGE ----------–---

  changeTitle = (val) => {
    this.setState({title: val});
  };
  changeBtnText = (val) => {
    this.setState({btnText: val});
  };
  changeBtnTextColor = (color) => {
    this.setState({btnTextColor: color});
  };
  changeBtnColor = (color) => {
    this.setState({btnColor: color});
  };

  toggleProcessing = (val) => {
    this.setState({processing: val});
    if (val === true) {
      this.changeBtnColor('#119A4F');
      // Disable Swipe for goBack
      this.navigation.setOptions({
        gestureEnabled: false,
        swipeEnabled: false,
      });
    } else {
      this.changeBtnColor(colors.green);
      // Disable Swipe for goBack
      this.navigation.setOptions({
        gestureEnabled: true,
        swipeEnabled: true,
      });
    }
  };
  goNext = (): void => {
    // Alert.alert('Receipt', this.state.receipt);
    Alert.alert('Success', 'May Caprica be with you!');
  };

  setOffersPrice = (offers) => {
    offers.map((sub) => {
      if (sub.subscriptionPeriodUnitIOS === 'MONTH') {
        this.setState({priceMonthly: sub.localizedPrice});
      } else if (sub.subscriptionPeriodUnitIOS === 'YEAR') {
        this.setState({priceYearly: sub.localizedPrice});
      }
    });
  };

  // ------- HANDLER ----------–---

  handleSubscribe = async (period) => {
    const {processing} = this.state;
    // Disable button if pressed
    if (processing === false) {
      // Active Process
      this.toggleProcessing(true);
      // Subscribe
      const subStatus = await newSubscribe({
        period: period,
      });
      if (subStatus) {
        // Stop Process
        this.toggleProcessing(false);
        // Go to timeline
        this.navigation.navigate('Timeline');
      } else {
        // Active Process
        this.toggleProcessing(false);
      }
    } else {
      console.log('CAUTION > process active > button press ignored!');
    }
  };

  handleRestore = async () => {
    const {processing} = this.state;
    // Disable button if pressed
    if (processing === true) {
      console.log('CAUTION > process active > button press ignored!');
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

  // ------- LIFE -----------------

  async componentDidMount() {
    // Update from params
    const {title, btnText} = this.props.route.params;
    title && this.changeTitle(title);
    btnText && this.changeBtnText(btnText);

    // Connect to iTunes for Subscribe
    console.log('SubscribeScreen > connecting to iTunes...');
    try {
      const connect = await RNIap.initConnection();
      console.log('SubscribeScreen > connection > ', connect);
      var subscriptions = await RNIap.getSubscriptions(IAP_SKUS);
      console.log('SubscribeScreen > items available > ', subscriptions);
    } catch (err) {
      console.log(`ERROR > sub connect > ${JSON.stringify(err)}`);
      console.warn(err.code, err.message);
    }

    // Set offer prices
    this.setOffersPrice(subscriptions);

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            // Required finish transaction
            const ackResult = await RNIap.finishTransaction(purchase);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }

          // this.setState({receipt}, () => this.goNext());
          // Active Process
          this.toggleProcessing(false);
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('ERROR > purchaseErrorListener', JSON.stringify(error));
        // Alert.alert('purchase error', JSON.stringify(error));
        // Active Process
        this.toggleProcessing(false);
      },
    );
  }

  componentWillUnmount() {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
      // Active Process
      this.toggleProcessing(false);
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
      // Active Process
      this.toggleProcessing(false);
    }
    RNIap.endConnection();
  }

  render() {
    const {
      title,
      processing,
      btnText,
      btnColor,
      btnTextColor,
      priceMonthly,
      priceYearly,
    } = this.state;
    console.log('screen > ' + this.props.route.name);

    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={{backgroundColor: 'white', flex: 1}}>
        <View style={[styles.container]}>
          <SafeAreaView />
          <StatusBar barStyle="dark-content" />
          {/* <Image style={styles.image} source={{uri: 'avocado.jpg'}} /> */}
          <Image
            style={styles.image}
            source={require('../res/img/avocado.jpg')}
          />
          {/* <IntroHeader
          onPressRight={() => this.handleRestore()}
          title="Restore"
          color={colors.green}
          goBack={() => this.navigation.goBack()}
        /> */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.goBack}
              hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
              onPress={() => this.navigation.goBack()}>
              <Ionicons name={'ios-arrow-back'} size={26} color={'#17D96F'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.restore]}
              onPress={() => this.handleRestore()}>
              <Text style={styles.restoreText}>Restore</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerCenter}>
            <Text style={styles.title}>Caprica</Text>
            <View style={{marginTop: 5, marginBottom: 9}}>
              <Text
                style={
                  styles.text
                }>{`Remember every moment\nGet access to all features and more!`}</Text>
            </View>
            <Text style={styles.textWelcome}>{title}</Text>
            <Offer
              title="Yearly"
              period="YEAR"
              price={priceYearly}
              selected={true}
              showSave={true}
              onPress={() => this.handleSubscribe('yearly')}
            />
            <Offer
              title="Monthly"
              period="MONTH"
              price={priceMonthly}
              selected={false}
              showSave={false}
              onPress={() => this.handleSubscribe('monthly')}
            />

            <View style={styles.bottom}>
              <ButtonIntro
                title={btnText}
                color={btnColor}
                textColor={btnTextColor}
                showActivity={processing}
                onPress={() => this.handleSubscribe('monthly')}
              />

              <Text style={[styles.textBottom]}>
                You'll be charged {priceYearly} to your iTunes account at
                confirmation of purchase. Subscription automatically renews
                unless canceled 24 hours before the end of the current period.
                You can manage and cancel subscriptions in your account settings
                on the App Store
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

function Offer({title, period, price, selected, showSave, onPress}) {
  const colors = selected ? ['#43BCF7', '#1DA1F2'] : ['#FCFCFC', '#FCFCFC'];

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress()}>
      <LinearGradient
        colors={colors}
        style={[styles.offerContainer, {marginTop: 9}]}>
        <View>
          <Text style={[styles.titleYearly, !selected && {color: '#1DA1F2'}]}>
            {title}
          </Text>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text style={[styles.offerPrice, !selected && {color: '#222426'}]}>
              {price} {period === 'MONTH' ? '/ mo' : '/ yr'}
            </Text>
            <Text style={[styles.billed, !selected && {color: '#222426'}]}>
              billed {period === 'MONTH' ? 'monthly' : 'annually'}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {showSave && (
            <View style={styles.discountBox}>
              <Text>
                <Text style={styles.saveText}>SAVE 10</Text>
                {/* <Text style={{fontSize: 12, color: 'white'}}>%</Text> */}
              </Text>
              <Text style={styles.discountText}>$2.9 / mo</Text>
            </View>
          )}
          <Ionicons
            name={'ios-arrow-forward'}
            size={24}
            color={!selected ? '#1DA1F2' : 'white'}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

let dimensions = Dimensions.get('window');
const HEIGHT = dimensions.height; // Math.round((dimensions.width * 9) / 10);
const WIDTH = dimensions.width; // Math.round((dimensions.width * 9) / 10);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  billed: {
    fontSize: 13,
    color: 'white',
    fontWeight: '300',
    marginLeft: 18,
    letterSpacing: -0.36,
  },
  offerPrice: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  titleYearly: {
    fontSize: 15.5,
    color: 'white',
    fontWeight: '600',
    letterSpacing: -0.26,
  },
  saveText: {
    color: 'white',
    fontWeight: '500',
    letterSpacing: -0.36,
  },
  discountText: {
    color: '#FCFCFC',
    fontSize: 13,
    letterSpacing: -0.36,
    marginTop: 5,
  },
  discountBox: {
    backgroundColor: '#644D4D',
    borderRadius: 4,
    paddingVertical: 2.19,
    paddingHorizontal: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '100%',
    height: 71,
    marginHorizontal: 20,
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    borderColor: '#CCD5DD',
    borderWidth: 0.5,
    paddingLeft: 20,
    paddingRight: 13,
  },

  image: {
    // justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    // flex: 1,
    width: WIDTH,
    height: 235,
    resizeMode: 'contain',
  },
  bottom: {
    // backgroundColor: 'lightgreen',
    flex: 1,
    justifyContent: 'flex-end',
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
    // marginTop: 4,
  },
  restoreText: {
    fontSize: 17,
    color: '#17D96F',
  },
  containerCenter: {
    // backgroundColor: 'pink',
    alignSelf: 'center',
    position: 'absolute',
    // top: 377, // 437
    bottom: 0,
    // paddingHorizontal: 47,
    paddingTop: 9,
    paddingBottom: 7,
    // opacity: 0.976,te
    width: '100%',
    height: HEIGHT - 234,
    // flex: 1,
    zIndex: 2,
  },

  title: {
    alignSelf: 'center',
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
    fontSize: 15.5,
    fontWeight: '500',
    textAlign: 'center',
    color: '#6E767D',
  },
  textWelcome: {
    letterSpacing: -0.43,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#222426',
  },
  textBottom: {
    alignSelf: 'center',
    color: '#9A9BAA',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '300',
    // marginTop: 20,
    marginBottom: -55,
    paddingHorizontal: 45,
  },
});
