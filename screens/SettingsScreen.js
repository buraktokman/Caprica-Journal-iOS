/*
Export Data time format > https://momentjs.com/
*/
import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  View,
  ScrollView,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import {
  ThemeProvider,
  DefaultTheme,
  TableView,
  NavigationRow,
  // InfoRow,
  SwitchRow,
  // RowItem,
  // TextFieldRow,
} from 'react-native-ios-kit';
import color from 'color';
import moment from 'moment';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Rate from 'react-native-rate';

import {STORE_URL} from '../AppData.json';
import {getAppVersion} from '../src/utils';
import TitleScreen from '../shared/TitleScreen';
import {shareApp} from '../src/share';
import {colors} from '../src/styles';

// Version
const VERSION = getAppVersion();

@inject('store')
@observer
class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
  }

  // --------- UTIL --------------

  exportData = async () => {
    // Sort
    await this.props.store.sortEntriesByDate();

    const {entries, categories} = this.props.store;

    var year = moment(entries[0].date).format('YYYY');
    // Add Year to top
    var entryStr = `${year}`;
    for (let i = 0; i < entries.length; i++) {
      // Find category of the entry
      const category = categories.filter(function (category) {
        if (entries[i].category === category.id) {
          return category;
        }
      })[0];
      entryStr = `${entryStr}\n${moment(entries[i].date).format(
        'MMMM D, h:mm', // YYYY - MMMM Do, h:mm
      )}\t   ${category.icon} ${category.name} - ${entries[i].content}`;

      // Year if next year
      let newYear = moment(entries[0].date).format('YYYY');
      if (year !== newYear) {
        entryStr = `\n\n${year}`;
        year = newYear;
      }
    }

    // Add Caprica to bottom
    entryStr = await `${entryStr}\n\nvia Caprica for iOS\n${STORE_URL}\n\n`;

    console.log(entryStr);
    Linking.openURL(
      `mailto:hello@bulrosa.com?subject=My Timeline via Caprica&body=${entryStr}`,
    ).catch((err) =>
      console.error('ERROR > export data > cannot open send email', err),
    );
  };

  deleteEverything = () => {
    console.log('settings > delete my data');
    Alert.alert('Caution', 'Are you sure you want to delete your everything?', [
      {
        text: 'Cancel',
        onPress: () => console.log('entry remove canceled'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          this.props.store.resetData();
          this.navigation.navigate('Timeline', {});
        },
        style: 'destructive',
      },
    ]);
  };

  openLink = async (url) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url);
        console.log('browser > ' + JSON.stringify(result));
      } else {
        Linking.openURL(url);
      }
    } catch (error) {}
  };

  rateApp = async () => {
    const options = {
      AppleAppID: '1515005632',
      // GooglePackageName:"com.mywebsite.myapp",
      // preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
    };
    console.log('setting > rate > started');
    Rate.rate(options, (success) => {
      if (success) {
        // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
        console.log('setting > rate > completed');
        this.setState({rated: true});
      }
    });
  };

  // --------- LIFE --------------

  componentDidMount() {}

  render() {
    const theme = {
      ...DefaultTheme,
      primaryColor: colors.blue,
      // backgroundColor: 'white',
      barColor: '#EFF3EF',
      // headernoteBackgroundColor: 'white',
      textColor: colors.black,
      dividerColor: '#CCD5DD',
      footnoteBackgroundColor: 'white',
      primaryLightColor: color('tomato').lighten(0.2).rgb().string(),
      disabledColor: 'yellow',
    };

    console.log(
      `settings > initiated > ${JSON.stringify(this.props.store.settings)}`,
    );

    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />
          <SafeAreaView />
          <ScrollView style={styles.settingsTable}>
            <TitleScreen title="Preferences" style={{marginBottom: 13.5}} />

            <TableView
              footer="Turning off options above might cause to incomplete user experience"
              footerStyle={{alignItems: 'center'}}
              withoutFooter={false}
              withoutHeader={true}>
              <SwitchRow
                theme={theme}
                title="Notifications"
                icon={'ios-notifications-outline'}
                value={this.props.store.settings.notification}
                onValueChange={() => this.props.store.handlerNotification()}
              />
              <SwitchRow
                theme={theme}
                title="Sound"
                icon={'ios-volume-low'}
                value={this.props.store.settings.sound}
                onValueChange={() => this.props.store.handlerSound()}
              />
              <SwitchRow
                theme={theme}
                title="Vibration"
                icon={'ios-flash'}
                value={this.props.store.settings.vibration}
                onValueChange={() => this.props.store.handlerVibration()}
              />
            </TableView>

            {/* <TableView withoutFooter={true} withoutHeader={true}>
              <NavigationRow
                title="Restore purchases"
                icon={'ios-bookmark'}
                onPress={() => {
                  console.log(
                    'settings > restore purchase  > CAUTION INCOMOPLTE',
                  );
                }}
              />
              <NavigationRow
                title="Manage my subscription"
                icon={'ios-bookmark'}
                onPress={() => {
                  console.log('settings > manage sub.');
                  Linking.openURL(
                    'https://apps.apple.com/account/subscriptions',
                  );
                }}
              />
              <NavigationRow
                title="Buy me a Coffee 😊"
                icon={'ios-ice-cream'}
                theme={{
                  primaryColor: colors.green,
                  // textColor: 'red',
                }}
                onPress={() => {
                  console.log('settings > donate > CAUTION INCOMPLETE');
                }}
              />
            </TableView>
            <View style={styles.rowSeparator} /> */}

            <TableView
              header=" "
              footer="Let the word out. Tell people Caprica"
              // footerStyle={{alignItems: 'center'}}
              withoutFooter={false}
              withoutHeader={true}>
              <NavigationRow
                title="Share this App"
                icon={'ios-share-alt'}
                theme={{primaryColor: colors.green}}
                onPress={() => {
                  console.log('settings > share this app');
                  shareApp(STORE_URL);
                }}
              />
              <NavigationRow
                title="Rate if you liked"
                icon={'ios-star-half'}
                theme={{
                  primaryColor: '#F2D71D',
                }}
                onPress={() => this.rateApp()}
              />
            </TableView>
            {/* <View style={styles.rowSeparator} /> */}

            <TableView
              footer="Your personal data stored on this device & never shared with any third-party"
              withoutFooter={false}
              withoutHeader={true}>
              <NavigationRow
                title="Export my data"
                icon={'ios-share'}
                theme={{primaryColor: colors.blue}}
                onPress={() => {
                  this.exportData();
                }}
              />
              <NavigationRow
                title="Delete everything"
                icon={'ios-hand'}
                theme={{
                  primaryColor: colors.red,
                  textColor: colors.red,
                }}
                onPress={() => this.deleteEverything()}
              />
            </TableView>

            <TableView
              footer="Get in touch with us for feature requests & business inquiries"
              // footerStyle={{alignItems: 'center'}}
              withoutFooter={false}
              withoutHeader={false}>
              <NavigationRow
                title="E-mail"
                onPress={() => {
                  console.log('settings > opening send email');
                  Linking.openURL(
                    `mailto:hello@bulrosa.com?subject=Caprica for iOS v${VERSION}`,
                  ).catch((err) =>
                    console.error('ERROR > cannot open send email', err),
                  );
                }}
                info="hello@bulrosa.com"
              />
              <NavigationRow
                title="Web"
                onPress={() => {
                  console.log('settings > opening webpage');
                  this.openLink('https://www.bulrosa.com');
                }}
                info="Bulrosa.com"
              />
            </TableView>
            {/* <View style={styles.rowSeparator} /> */}

            <TableView
              footerStyle={{alignItems: 'center'}}
              footer="Developed by Bulrosa with 💕"
              // onFooterPress={() => alert('Hello')}
            >
              <NavigationRow
                title="Terms & Conditions"
                onPress={() => {
                  console.log('settings > open terms page');
                  this.openLink(
                    'https://www.bulrosa.com/terms/terms-of-use.html',
                  );
                }}
                info=""
              />
              <NavigationRow
                title="Privacy Policy"
                onPress={() => {
                  console.log('settings > opening privacy page'),
                    this.openLink(
                      'https://www.bulrosa.com/privacy/privacy-policy.html',
                    );
                }}
                info=""
              />
            </TableView>
          </ScrollView>
        </View>
      </ThemeProvider>
    );
  }
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingsRows: {
    marginTop: 20,
  },
  settingsTable: {
    flex: 1,
    backgroundColor: 'white',
  },
  rowSeparator: {
    height: 35,
    backgroundColor: 'white',
  },
});
