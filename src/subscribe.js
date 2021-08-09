/*
In App Purchases
*/
// import React from 'react';
import {Alert, Platform, NativeModules, NativeEventEmitter} from 'react-native';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
// import AsyncStorage from '@react-native-community/async-storage';
import * as RNIap from 'react-native-iap';
import {SHARED_SECRET} from '../AppData.json';

import StateStore from '../src/store';
const store = (window.store = new StateStore());

// const { RNIapIos } = NativeModules;
// const IAPEmitter = new NativeEventEmitter(RNIapIos);

// Subscriptions
const IAP_SKUS = Platform.select({
  ios: ['com.bulrosa.caprica.monthly', 'com.bulrosa.caprica.yearly'],
  // android: [ 'com.example.coins100' ]
});

export async function newSubscribe({period}) {
  console.log('subscribe > new subscribing... > ' + period);

  //
  //  INCOMPLETE
  //
  // Monthly or Annual
  var date = new Date();
  var productId;
  if (period === 'monthly') {
    productId = IAP_SKUS[0];
    // 30 Days from now
    // date.setDate(date.getDate() + 30);
    date.setMonth(date.getMonth() + 1);
  } else if (period === 'yearly') {
    productId = IAP_SKUS[1];
    // 365 Days from now
    date.setMonth(date.getMonth() + 12);
  }

  console.log('subscribe > new > connecting...');
  const resultConnect = await RNIap.initConnection();
  // const subscriptions = await RNIap.getSubscriptions(IAP_SKUS);
  // console.log('subscribe > new > available > ', subscriptions);

  // Subscribe
  try {
    var purchase = await RNIap.requestSubscription(productId);
    console.log('subscribe > result > ', JSON.stringify(purchase));
  } catch (err) {
    var purchase = false;
    // console.log(`ERROR > cannot subscribe > ${JSON.stringify(err)}`);
    console.log(`ERROR > cannot subscribe > ${err.code} ${err.message}`);
    console.warn(err.code, err.message);
  }

  // Process if Sub OK
  const receipt = purchase.transactionReceipt;
  // extracting receipt from provided `purchase` object
  if (receipt) {
    try {
      // iOS only finalisation method
      if (Platform.OS === 'ios') {
        RNIap.finishTransactionIOS(purchase.transactionId);
      }
      // Required finish transaction
      await RNIap.finishTransaction(purchase);
      // Further processing with component function
      await RNIap.processNewPurchase(purchase);
    } catch (ackErr) {
      // console.log('ackErr', ackErr);
    }
    // Purchase Result
    const result = {
      ...store.subscription,
      isTrialPeriod: true,
      productId: productId,
      period: period.toUpperCase(),
      dateBegin: new Date(), // new Date(2020, 1, 1),
      dateExpiry: date, // new Date(2018, 1, 1),
      ...purchase,
    };
    // Update State
    store.handlerSubscription(result);
    // Save to disk
    store._saveSubscription();
    // Return true
    console.log('subscribe > new > success!');
    return true;
  } else {
    return false;
  }
}

export async function activateTrial() {
  console.log('subscribe > activating Trial...');

  // Purchase
  const result = {
    // productId: IAP_SKUS[0],
    period: 'MONTH',
    dateBegin: new Date(), // new Date(2020, 1, 1),
    // dateExpiry: date, // new Date(2018, 1, 1),
    isTrialPeriod: true,
  };
  if (result) {
    // Update State
    store.handlerSubscription(result);
    // Save to disk
    store._saveSubscription();
    // Return true
    console.log('subscribe > free trial > success!');
    return true;
  } else {
    console.log('ERROR > subscribe > free trial > cannot activate!');
    return false;
  }
}

export async function restoreSubscribe() {
  console.log('subscribe > restoring...');
  // Check if Sub. Valid
  const r = await isSubscriptionActive();
  console.log(`subscribe > restore > is sub active? > ${r}`);
  // Purchase
  const result = {
    ...store.subscription,
    isSubscriptionActive: r,
    isTrialPeriod: true,
  };
  // Update State
  store.handlerSubscription(result);
  // Save to disk
  store._saveSubscription();
  // Return true
  console.log('subscribe > restore completed');
  return r;
}

export const getValidItems = async () => {
  console.log('subscribe > fetching purchase available items');
  try {
    console.log('subscribe > connecting to iTunes...');
    const result = await RNIap.initConnection();

    // const products = await RNIap.getProducts(IAP_SKUS);
    // console.log('subscribe > getProducts > ', products);

    const subscriptions = await RNIap.getSubscriptions(IAP_SKUS);
    // console.log('subscribe > getSubscriptions > ', subscriptions);

    return subscriptions;
    // this.setState({products});
  } catch (err) {
    console.warn(err); // standardized err.code and err.message available
  }
};

export const getPurchases = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    const newState = {premium: false, ads: true};
    let restoredTitles = [];

    purchases.forEach((purchase) => {
      switch (purchase.productId) {
        case 'com.example.premium':
          newState.premium = true;
          restoredTitles.push('Premium Version');
          break;

        case 'com.example.no_ads':
          newState.ads = false;
          restoredTitles.push('No Ads');
          break;

        case 'com.example.coins100':
        // await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
        // CoinStore.addCoins(100);
      }
    });

    Alert.alert(
      'Restore Successful',
      'You successfully restored the following purchases: ' +
        restoredTitles.join(', '),
    );
  } catch (err) {
    console.warn(err); // standardized err.code and err.message available
    Alert.alert(err.message);
  }
};

export async function isSubscriptionActive() {
  // https://github.com/dooboolab/react-native-iap/issues/275
  // Connect to iTunes
  console.log('subscribe > isSubscriptionActive > connecting to iTunes...');
  const result = await RNIap.initConnection();

  // Fetch Purchases Online
  const availablePurchases = await RNIap.getAvailablePurchases();
  const sortedAvailablePurchases = availablePurchases.sort(
    (a, b) => b.transactionDate - a.transactionDate,
  );
  const latestAvailableReceipt = sortedAvailablePurchases[0].transactionReceipt;

  const isTestEnvironment = __DEV__;
  const decodedReceipt = await RNIap.validateReceiptIos(
    {
      'receipt-data': latestAvailableReceipt,
      password: SHARED_SECRET,
    },
    isTestEnvironment,
  );
  const {latest_receipt_info: latestReceiptInfo} = decodedReceipt;
  const isSubValid = !!latestReceiptInfo.find((receipt) => {
    const expirationInMilliseconds = Number(receipt.expires_date_ms);
    const nowInMilliseconds = Date.now();
    return expirationInMilliseconds > nowInMilliseconds;
  });
  return isSubValid;
}
