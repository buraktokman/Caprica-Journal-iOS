/*
Tabs with Stacks
https://medium.com/wesionary-team/combining-stack-navigator-with-tab-navigator-in-react-native-react-navigation-253656f45181
*/
import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  // useState,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  // YellowBox,
  Easing,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  // TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useSafeArea} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import WelcomeScreen from '../screens/WelcomeScreen';
import IntroScreen from '../screens/IntroScreen';
import SubscribeScreen from '../screens/SubscribeScreen';
import TimelineScreen from '../screens/TimelineScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {colors} from '../src/styles';

const openConfig = {
  animation: 'spring', // spring
  config: {
    easing: Easing.linear,
    duration: 100,
    // stiffness: 1000,
    // damping: 50,
    // mass: 3,
    overshootClamping: true,
    // restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const closeConfig = {
  animation: 'timing',
  config: {
    duration: 100,
    easing: Easing.linear,
  },
};

const SettingsStack = createStackNavigator();
function StackSettingsScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Settings">
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Subscribe" component={SubscribeScreen} />
    </SettingsStack.Navigator>
  );
}

const CategoryStack = createStackNavigator();
function StackCategoryScreen() {
  return (
    <CategoryStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        // gestureDirection: 'vertical',
        // transitionSpec: {open: openConfig, close: closeConfig},
        CardStyleInterpolators: CardStyleInterpolators.forVerticalIOS,
      }}
      initialRouteName="Categories">
      <CategoryStack.Screen name="Categories" component={CategoriesScreen} />
      <CategoryStack.Screen name="Category" component={CategoryScreen} />
    </CategoryStack.Navigator>
  );
}
const TimelineStack = createStackNavigator();
function StackTimelineScreen() {
  return (
    <TimelineStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Timeline">
      <TimelineStack.Screen name="Timeline" component={TimelineScreen} />
    </TimelineStack.Navigator>
  );
}

const IntroStack = createStackNavigator();
function StackIntroScreen(props) {
  props.navigation.setOptions({tabBarVisible: false});
  const {startScreen} = props.route.params;
  const start = startScreen === 'SubExpired' ? 'SubscribeScreen' : 'Welcome';
  // var start = 'Welcome';

  return (
    <IntroStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={start}>
      <IntroStack.Screen name="Welcome" component={WelcomeScreen} />
      <IntroStack.Screen name="Intro_1" component={IntroScreen} />
      <IntroStack.Screen name="Intro_2" component={IntroScreen} />
      <IntroStack.Screen name="Intro_3" component={IntroScreen} />
      <IntroStack.Screen
        name="Subscribe"
        component={SubscribeScreen}
        initialParams={{}}
      />
    </IntroStack.Navigator>
  );
}

function MyTabBar({state, descriptors, navigation}) {
  // console.log(`state.routes > ${JSON.stringify(state.routes)}`);
  // console.log(`navigation > ${JSON.stringify(navigation)}`);
  const insets = useSafeArea();

  return (
    <View
      style={[
        styles.containerTab,
        {
          paddingBottom: insets.bottom,
          //paddingTop: insets.top
        },
      ]}>
      {state.routes
        .filter(function (item) {
          // Don't Show Intro Tab!!!
          if (item.name === 'Intro') {
            return false; // skip
          }
          return true;
        })
        .map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // +1 > Because skip intro tab
          const isFocused = state.index === index + 1;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabBar}
              activeOpacity={0.6}>
              <View style={styles.tab}>
                <Text
                  style={[
                    styles.tabBarText,
                    {color: isFocused ? '#1CA0F1' : '#647785'},
                  ]}>
                  {route.name === 'Timeline' ? (
                    <MaterialCommunityIcons name={'timeline-text'} size={24} />
                  ) : route.name === 'Calendar' ? (
                    <AntDesign name={'calendar'} size={22} />
                  ) : route.name === 'Categories' ? (
                    <Ionicons name={'ios-list'} size={23} />
                  ) : route.name === 'Settings' ? (
                    <Ionicons name={'ios-settings'} size={23} />
                  ) : (
                    <FontAwesome5 name={'unknown'} size={23} />
                  )}
                  {/* {route.name} */}
                </Text>
              </View>

              {/* <Text
              style={[
                styles.tabBarText,
                {color: isFocused ? '#43B207' : 'black'},
              ]}>
              {label}
            </Text> */}
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function Navigator({startScreen}) {
  // console.log('navigator > initiated > ' + startScreen);
  const startTab = startScreen === 'Timeline' ? 'Timeline' : 'Intro';

  return (
    <NavigationContainer>
      <Tab.Navigator
        startScreen
        initialRouteName={startTab}
        tabBar={(props) => <MyTabBar {...props} />}>
        <Tab.Screen
          name="Intro"
          initialParams={{startScreen: startScreen}}
          component={StackIntroScreen}
        />
        <Tab.Screen name="Timeline" component={StackTimelineScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Categories" component={StackCategoryScreen} />
        <Tab.Screen name="Settings" component={StackSettingsScreen} />
      </Tab.Navigator>
      {/* <SafeAreaView style={styles.safeArea} /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerTab: {
    flexDirection: 'row',
    // opacity: 0.7,
  },
  safeArea: {
    // backgroundColor: 'white',
    // opacity: 0.7,
  },
  tab: {
    // flex:1,
    // flexDirection: 'column',
    // textAlignVertical: 'center',
    // backgroundColor: 'pink',
    justifyContent: 'center',
    // alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    // width: 50,
    paddingLeft: 4.5,
    // opacity: 0.7,
  },
  tabBarText: {
    // justifyContent: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '400',
  },
  tabBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6.5,
    height: 44,
    // backgroundColor: 'red',
    borderColor: '#BBC6CE',
    borderTopWidth: 0.5,
    // opacity: 0.7,
  },
});
