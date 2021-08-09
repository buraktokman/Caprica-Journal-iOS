import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-community/async-storage';

import {fireAddEntry, fireAddCategory} from '../src/api/firebaseApi';
import {customCategories} from '../src/custom/categories';
import {customEntries} from '../src/custom/entries';
import {customSettings} from '../src/custom/settings';
import {customSubscription} from '../src/custom/subscription';
import {customAnalytics} from '../src/custom/analytics';
// import {time_diff_hours} from '../src/utils';

class StateStore {
  // Data
  @observable entries = customEntries;
  // Categories
  @observable categories = customCategories;
  // Settings
  @observable settings = customSettings;
  // Settings
  @observable subscription = customSubscription;
  // Analytics
  @observable analytics = customAnalytics;

  // ------ HANDLER - TIMELINE -----------

  @action handlerAddEntry = async (entry) => {
    // const entry = await {
    //   content: data.content,
    //   date: data.date,
    //   category: data.category.id,
    // };
    console.log(`store handler > add entry > ${JSON.stringify(entry)}`);
    this.entries = [entry, ...this.entries];
    // Save to disk
    this._saveEntries();
    // Upload to Firestore
    fireAddEntry(entry, (response) =>
      console.log('firebase response > ' + JSON.stringify(response)),
    );
  };
  @action handlerEditEntry = async (entry) => {
    console.log(`store handler > edit entry > ${JSON.stringify(entry)}`);
    const {content, date, category} = entry;
    this.entries = this.entries.map((entry) =>
      entry.date === date ? {...entry, content, date, category} : entry,
    );
    // Save to disk
    this._saveEntries();
  };
  @action handlerDelEntry = (selectedEntry) => {
    console.log(`store handler > del entry > ${JSON.stringify(selectedEntry)}`);

    var entriesAfterDelete = [...this.entries]; // make a separate copy of the array
    var index = entriesAfterDelete.indexOf(selectedEntry);
    if (index !== -1) {
      entriesAfterDelete.splice(index, 1);
      this.entries = entriesAfterDelete;
    }
    // Save to disk
    this._saveEntries();
  };
  // Remove categories by category name
  @action handlerDelEntriesOfCategory = async (categoryName) => {
    console.log(`store > deleting entries of > ${categoryName}`);

    // Filter entries matching categories
    var filteredEntries = this.entries.filter(function (entry) {
      if (entry.category !== categoryName) {
        return entry;
      }
    });
    this.entries = filteredEntries;

    // Save to disk
    // this._saveEntries();
    // Sort
    this.sortEntriesByDate();
  };

  // ------ SORT - ENTRIES --------------

  sortEntriesByDate = async () => {
    console.log('store > sort entries > newest');
    this.entries = this.entries.sort((a, b) => b.date - a.date);
    // if (sortBy === 'newest') {
    //   this.entries = this.entries.sort((a, b) => a.date - b.date)
    // } else {
    //   this.entries = this.entries.sort((a, b) => b.date - a.date)
    // }
    // Save to disk
    this._saveEntries();
  };

  // ------ HANDLER - CATEGORIES ---------

  @action handlerAddCategory = (category) => {
    const {id, name, color, icon} = category;
    console.log(`store > add cat > ${id} ${name} ${icon} ${color}`);
    this.categories = [
      {
        id,
        name,
        icon,
        color,
      },
      ...this.categories,
    ];
    // Save to disk
    this._saveCategories();
    // Upload to Firestore
    fireAddCategory({id, name, color, icon}, (response) =>
      console.log('firebase response > ' + JSON.stringify(response)),
    );
  };
  @action handlerEditCategory = (data) => {
    console.log(`store > edit cat > ${JSON.stringify(data)}`);
    var {id, name, color, icon} = data;
    this.categories = this.categories.map((category) =>
      category.id === id // || category.name === oldName
        ? {id, name: name, color, icon} // {...category, name: name, color, icon}
        : category,
    );
    // this.categories.map((item) => {
    //   console.log(`store > edit cat > ${JSON.stringify(item)}`);
    // });
    // Save to disk
    this._saveCategories();
  };
  @action handlerDelCategory = (categoryName) => {
    console.log(`store > del cat > ${categoryName}`);
    this.categories = this.categories.filter(function (category) {
      return category.name !== categoryName;
    });
    // Del Entries of Category
    this.handlerDelEntriesOfCategory(categoryName);
    // Save to disk
    this._saveCategories();
  };
  @action isCategoryNameAvailable = (categoryName) => {
    const {categories} = this;
    for (let i = 0; i < this.categories.length; i++) {
      if (categories[i].name === categoryName) {
        console.log(
          `store > check cat name > ${categoryName} - NOT available!`,
        );
        return false;
      } else if (i + 1 === categories.length) {
        console.log(`store > check cat name > ${categoryName} - is available!`);
        return true;
      }
    }
  };
  @action isCategoryExistByID = (catID) => {
    const {categories} = this;
    for (let i = 0; i < this.categories.length; i++) {
      if (categories[i].id === catID) {
        console.log(`store > check cat Exist (${catID})`);
        return true;
      } else if (i + 1 === categories.length) {
        console.log(`store > check cat NOT exist (${catID})`);
        return false;
      }
    }
  };
  @action setCategories = (categories) => {
    console.log(`store > set cats > ${JSON.stringify(categories)}`);
    this.categories = categories;
    // Save to disk
    this._saveCategories();
  };

  // ------ SORT - CATEGORIES ------------

  @action sortCategoriesByAlpha = () => {
    console.log(`store > cats. > sort by > alpha`);
    this.categories = this.categories.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  @action sortCategoriesByCount = () => {
    console.log(`store > handler > sort by > count`);
    const {categories, entries} = this;
    // Get entry count of category
    for (let i = 0; i < categories.length; i++) {
      const entryCount = entries.filter(function (itemEntry) {
        return itemEntry.category === categories[i].name;
      }).length;
      categories[i].count = entryCount;
    }
    // Sort by entry count
    this.categories = categories.slice().sort((a, b) => b.count - a.count);
  };

  // ------ HANDLER - SUBSCRIPTION ---------

  @action handlerSubscription = async (data) => {
    // var data = {
    //   status: true,
    //   productId: 'monthly',
    //   dateBegin: null,
    //   dateExpiry: null,
    // };
    console.log(`store handler > subscription > ${JSON.stringify(data)}`);
    this.subscription = data;

    // Save to disk
    this._saveSubscription();
  };
  @action checkSubscriptionStatus = () => {
    console.log('store > checking subscription status...');
    const {dateBegin, dateExpiry, isTrialPeriod} = this.subscription;
    //
    // FIRST START - NO-ACTIVE FREE TRIAL
    //
    if (isTrialPeriod === null) {
      console.log(
        `CAUTION > Never subscribed before! > ${JSON.stringify(dateExpiry)}`,
      );
      return null;
    }
    //
    // TRIAL EXPIRED
    //
    // else if (time_diff_hours(new Date(), dateBegin) >= 7) {
    //   console.log('CAUTION > Trial expired!');
    //   this.setTrialStatus(false);
    //   return false;
    // }
    //
    // ACTIVE FREE TRIAL
    //
    else if (isTrialPeriod === true) {
      console.log('CAUTION > Trial subscription is active!');
      return true;
    }
    //
    // SUBSCRIPTION EXPIRED
    //
    // else if (new Date() >= dateExpiry) {
    //   // EXPIRED SUB.
    //   console.log(
    //     `CAUTION > Subscription expired! > ${JSON.stringify(dateExpiry)}`,
    //   );
    //   return false;
    // } else {
    //   console.log(`store > subscription valid > ${JSON.stringify(dateExpiry)}`);
    //   return true;
    // }
  };
  @action setSubscriptionExpDate = async (date) => {
    console.log(`store > set subscription exp date  > ${JSON.stringify(date)}`);
    this.subscription = {
      ...this.subscription,
      dateExpiry: date,
    };
    // Save to disk
    this._saveSubscription();
  };
  @action setSubscriptionBeginDate = async (date) => {
    console.log(
      `store > set subscription begin date  > ${JSON.stringify(date)}`,
    );
    this.subscription = {
      ...this.subscription,
      dateBegin: date,
    };
    // Save to disk
    this._saveSubscription();
  };
  @action setTrialStatus = (val) => {
    console.log(`store > set trial status  > ${JSON.stringify(val)}`);
    this.subscription = {...this.subscription, isTrialPeriod: val};
    // Save to disk
    this._saveSubscription();
  };

  // --------- SETTINGS ------------------

  @action handlerNotification = () => {
    this.settings.notification = !this.settings.notification;
    // Save to disk
    this._saveSettings();
  };
  @action handlerSound = () => {
    this.settings.sound = !this.settings.sound;
    // Save to disk
    this._saveSettings();
  };
  @action handlerVibration = () => {
    this.settings.vibration = !this.settings.vibration;
    // Save to disk
    this._saveSettings();
  };

  // ------ INITIALIZE STATES ------------

  @action loadStates = async () => {
    console.log('INIT > store > loading last state');
    // const LOAD_FROM_DISK = true

    //  ------ ENTRIES -------
    try {
      const entries = await AsyncStorage.getItem('entries');
      var entriesParsed = JSON.parse(entries);

      // Add Dummy data if no entry
      //
      //  INCOMPLETE - REMOVE COMMENT IF DISK ENABLED
      //
      if (entries === null) {
        //  || entriesParsed.length === 0
        console.log(
          'CAUTION > store > no entries found on disk. Using customs',
        );
        this.entries = customEntries;
      } else {
        console.log('INIT > store > loading entries from disk');
        // Convert Str to Date Object
        this.entries = entriesParsed.map((item) => {
          return {...item, date: new Date(item.date)};
        });
      }
      // this.entries = customEntries;

      // VERBOSE
      // this.entries.map((item) => {
      //   console.log(`INIT > store > entry > ${JSON.stringify(item)}`);
      // });
    } catch (error) {
      console.warn('ERROR > storage > loadStates > entries > ' + error);
    }

    //  ------ CATEGORIES -------
    try {
      const categories = await AsyncStorage.getItem('categories');
      var categoriesParsed = JSON.parse(categories);

      // Add Dummy data if no entry
      //
      //  INCOMPLETE
      //
      if (categories === null) {
        // || categoriesParsed.length === 0
        console.log(
          'CAUTION > store > no categories found on disk. Using customs',
        );
        categoriesParsed = customCategories;
      }

      console.log('INIT > store > loading categories from disk');
      this.categories = categoriesParsed;

      // Sort
      await this.sortCategoriesByCount();

      // VERBOSE
      // this.categories.map((item) => {
      //   console.log(`INIT > store > cat > ${JSON.stringify(item)}`);
      // });
    } catch (error) {
      console.warn('ERROR > storage > loadStates > categories > ' + error);
    }

    //  ------ SETTINGS -------
    try {
      const settings = await AsyncStorage.getItem('settings');
      let settingsParsed = JSON.parse(settings);
      if (settings !== null) {
        this.settings = settingsParsed;

        // VERBOSE
        // console.log(
        //   `INIT > store > settings > ${JSON.stringify(this.settings)}`,
        // );
      }
    } catch (error) {
      console.warn('ERROR > storage > loadStates > settings > ' + error);
    }

    //  ------ SUBSCRIPTION -------
    try {
      const subscription = await AsyncStorage.getItem('subscription');
      let subscriptionParsed = JSON.parse(subscription);
      if (subscription !== null) {
        // Str to Date Obj
        this.subscription = {
          ...subscriptionParsed,
          dateBegin: new Date(subscriptionParsed.dateBegin),
          dateExpiry: new Date(subscriptionParsed.dateExpiry),
        };

        console.log(
          `INIT > store > subscription > ${JSON.stringify(this.subscription)}`,
        );
      }
    } catch (error) {
      console.warn('ERROR > storage > loadStates > subscription > ' + error);
    }

    // Save to disk - settings
    this._saveSettings();
    // Save subs
    this._saveSubscription();
    // Save entries
    this._saveEntries();
    // Save categories
    this._saveCategories();
  };

  @action resetData = async () => {
    console.log('CAUTION - Removing all user data!!!');

    // Wipe
    this.removeStorage('entries');
    this.removeStorage('categories');
    this.removeStorage('settings');

    // Load Custom
    this.entries = []; // customEntries;
    this.categories = customCategories;
    this.settings = customSettings;

    // Save
    this._saveEntries();
    this._saveCategories();
    this._saveSettings();
  };

  // ------ STORAGE ---------------------

  _saveEntries = async () => {
    console.log('store > save to disk > entries');
    try {
      AsyncStorage.setItem('entries', JSON.stringify(this.entries));
    } catch (error) {
      console.warn('ERROR > storage > saveEntries > ' + error);
    }
  };
  _saveCategories = async () => {
    console.log('store > save to disk > categories');
    try {
      AsyncStorage.setItem('categories', JSON.stringify(this.categories));
    } catch (error) {
      console.warn('ERROR > storage > saveCategories > ' + error);
    }
  };
  _saveSettings = async () => {
    console.log('store > save to disk > settings');
    try {
      AsyncStorage.setItem('settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('ERROR > storage > saveSettings > ' + error);
    }
  };
  _saveSubscription = async () => {
    console.log('store > save to disk > subscription');
    try {
      AsyncStorage.setItem('subscription', JSON.stringify(this.subscription));
    } catch (error) {
      console.warn('ERROR > storage > saveSubscription > ' + error);
    }
  };

  // REMOVE by KEY
  removeStorage = (key) => {
    try {
      console.log('storage > removing > ' + key);
      AsyncStorage.removeItem(key);
      console.log('storage > removed > ' + key);
    } catch (error) {
      console.log('ERROR > storage > remove > ' + error);
    }
  };

  // WIPE ALL
  wipeStorage = async () => {
    try {
      AsyncStorage.clear();
      console.log('storage > wiped');
      // alert('storage wiped!');
    } catch (error) {
      console.log('ERROR > storage > wipe > ' + error);
    }
  };

  // _getData = async () => {
  //   try {
  //     const lastState = await AsyncStorage.getItem('stateCategories');
  //     let lastStateParsed = JSON.parse(lastState);
  //     if (lastState !== null) {
  //       await Object.keys(this.state).map((key) => {
  //         this.setState({[key]: lastStateParsed[key]});
  //       });
  //       // console.log(`state after > ${JSON.stringify(this.state)}`);
  //     }
  //   } catch (error) {
  //     console.warn('ERROR > storage > getData > ' + error);
  //   }
  // };
}
export default StateStore;
