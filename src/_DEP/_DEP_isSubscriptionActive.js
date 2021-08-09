import * as RNIap from 'react-native-iap';
import {ITUNES_CONNECT_SHARED_SECRET} from 'react-native-dotenv';

const SUBSCRIPTIONS = {
  // This is an example, we actually have this forked by iOS / Android environments
  ALL: ['monthlySubscriptionId', 'yearlySubscriptionId'],
};

async function isSubscriptionActive() {
  if (Platform.OS === 'ios') {
    const availablePurchases = await RNIap.getAvailablePurchases();
    const sortedAvailablePurchases = availablePurchases.sort(
      (a, b) => b.transactionDate - a.transactionDate,
    );
    const latestAvailableReceipt =
      sortedAvailablePurchases[0].transactionReceipt;

    const isTestEnvironment = __DEV__;
    const decodedReceipt = await RNIap.validateReceiptIos(
      {
        'receipt-data': latestAvailableReceipt,
        password: ITUNES_CONNECT_SHARED_SECRET,
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

  if (Platform.OS === 'android') {
    // When an active subscription expires, it does not show up in
    // available purchases anymore, therefore we can use the length
    // of the availablePurchases array to determine whether or not
    // they have an active subscription.
    const availablePurchases = await RNIap.getAvailablePurchases();

    for (let i = 0; i < availablePurchases.length; i++) {
      if (SUBSCRIPTIONS.ALL.includes(availablePurchases[i].productId)) {
        return true;
      }
    }
    return false;
  }
}
