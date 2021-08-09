// REQUEST SUBSCRIBE RESPONSE - SUCCESS
const s = {
  "transactionReceipt": "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",
  "transactionDate": 1591271122000,
  "productId": "com.bulrosa.caprica.monthly",
  "transactionId": "1000000674901689"
}

// REQUEST SUBSCRIBE RESPONSE - CANCEL
const s = {
  code: "E_USER_CANCELLED",
  message: "Cannot connect to iTunes Store",
  domain: "SKErrorDomain",
  userInfo: {
    NSLocalizedDescription: "Cannot connect to iTunes Store",
  },
  nativeStackIOS: [
    "0   Caprica                             0x00000001039b41d0 RCTJSErrorFromCodeMessageAndNSError + 156",
    "1   Caprica                             0x000000010394091c __41-[RCTModuleMethod processMethodSignature]_block_invoke_2.129 + 176",
    "2   Caprica                             0x000000010381a964 -[RNIapIos rejectPromisesForKey:code:message:error:] + 512",
    "3   Caprica                             0x000000010381e9dc __45-[RNIapIos paymentQueue:updatedTransactions:]_block_invoke + 1084",
    "4   libdispatch.dylib                   0x0000000193fbf184 B9D95EAB-9269-367D-B2F4-C2B45821A32D + 377220",
    "5   libdispatch.dylib                   0x0000000193f71c04 B9D95EAB-9269-367D-B2F4-C2B45821A32D + 60420",
    "6   Caprica                             0x000000010381e484 -[RNIapIos paymentQueue:updatedTransactions:] + 912",
    "7   libdispatch.dylib                   0x0000000193fbe610 B9D95EAB-9269-367D-B2F4-C2B45821A32D + 374288",
    "8   libdispatch.dylib                   0x0000000193fbf184 B9D95EAB-9269-367D-B2F4-C2B45821A32D + 377220",
    "9   libdispatch.dylib                   0x0000000193f71190 B9D95EAB-9269-367D-B2F4-C2B45821A32D + 57744",
    "10  CoreFoundation                      0x00000001942705e4 7519E999-1053-3367-B9D5-8844F6D3BDC6 + 693732",
    "11  CoreFoundation                      0x000000019426b5d8 7519E999-1053-3367-B9D5-8844F6D3BDC6 + 673240",
    "12  CoreFoundation                      0x000000019426aadc CFRunLoopRunSpecific + 464",
    "13  GraphicsServices                    0x000000019e20b328 GSEventRunModal + 104",
    "14  UIKitCore                           0x000000019837863c UIApplicationMain + 1936",
    "15  Caprica                             0x0000000102be5010 main + 124",
    "16  libdyld.dylib                       0x00000001940f4360 7B531A15-3E73-3185-90E2-B88D9476DA5E + 4960",
  ],
  line: 2247,
  column: 45,
  sourceURL:
    "http://192.168.1.102:8081/index.bundle?platform=ios&dev=true&minify=false",
};

// getSubscriptions
const s = [
  {
    currency: "USD",
    description: "Monthly subscription to Caprica",
    discounts: [],
    introductoryPrice: "",
    introductoryPriceNumberOfPeriodsIOS: "",
    introductoryPricePaymentModeIOS: "",
    introductoryPriceSubscriptionPeriodIOS: "",
    localizedPrice: "$3.99",
    price: "3.99",
    productId: "com.bulrosa.caprica.monthly",
    subscriptionPeriodNumberIOS: "1",
    subscriptionPeriodUnitIOS: "MONTH",
    title: "Caprica Monthly",
    type: "Do not use this. It returned sub only before",
  },
  {
    currency: "USD",
    description: "Yearly subscription to Caprica",
    discounts: [],
    introductoryPrice: "",
    introductoryPriceNumberOfPeriodsIOS: "",
    introductoryPricePaymentModeIOS: "",
    introductoryPriceSubscriptionPeriodIOS: "",
    localizedPrice: "$35.99",
    price: "35.99",
    productId: "com.bulrosa.caprica.yearly",
    subscriptionPeriodNumberIOS: "1",
    subscriptionPeriodUnitIOS: "YEAR",
    title: "Caprica Yearly",
    type: "Do not use this. It returned sub only before",
  },
];


// getAvailablePurchases
const s = {
  originalTransactionDateIOS: 1591271123000,
  originalTransactionIdentifierIOS: "1000000674901689",
  productId: "com.bulrosa.caprica.monthly",
  transactionDate: 1591272322000,
  transactionId: "1000000674910077",
  transactionReceipt:
    "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",
};

