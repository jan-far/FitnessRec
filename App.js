import React, { Component } from 'react';
import { Platform, View, StatusBar, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { lightPurp, purple, white } from './utils/color';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AddEntry from './components/AddEntry';
import History from './components/History';
import reducer from './reducers';
import EntryDetail from './components/EntryDetail';
import Live from './components/Live';
import { setLocalNotification } from './utils/helpers';
import Constants from 'expo-constants';

const UdaciStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <SafeAreaView style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar
        {...props}
        showHideTransition="fade"
        translucent
        backgroundColor={backgroundColor}
      />
    </SafeAreaView>
  );
};

// const Tabs = createBottomTabNavigator()
const Tabs = Platform.OS === 'ios' ? createBottomTabNavigator() : createMaterialTopTabNavigator();
const TabBar = () => {
  return (
    <Tabs.Navigator
      lazyPreloadDistance={1}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'History') {
            iconName = focused ? 'bookmarks-outline' : 'bookmarks';
          } else if (route.name === 'Add Entry') {
            iconName = focused ? 'plus-square-o' : 'plus-square';
          } else {
            iconName = focused ? 'ios-speedometer-outline' : 'ios-speedometer';
          }

          return route.name === 'History' || route.name === 'Live' ? (
            <Ionicons name={iconName} color={color} size={size} />
          ) : (
            <FontAwesome name={iconName} color={color} size={size} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: Platform.OS === 'ios' ? purple : white,
        tabStyle: {
          backgroundColor: Platform.OS === 'ios' ? white : purple,
          shadowColor: 'rgba(0, 0, 0, 0.24)',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 1,
          shadowRadius: 6,
          height: 55,
        },
        style: {
          height: Platform.OS === 'ios' ? 55 : 58,
        },
        pressColor: lightPurp,
        pressOpacity: 0.8,
        indicatorStyle: {
          backgroundColor: lightPurp,
          height: 5,
        },
      }}
    >
      <Tabs.Screen name="History" component={History} />
      <Tabs.Screen name="Add Entry" component={AddEntry} />
      <Tabs.Screen name="Live" component={Live} />
    </Tabs.Navigator>
  );
};

const MainView = createStackNavigator();
const MainViewNavigation = () => {
  return (
    <MainView.Navigator
      screenOptions={() => ({
        headerStyle: {
          backgroundColor: Platform.OS === 'ios' ? white : purple,
          shadowColor: 'rgba(0, 0, 0, 0.24)',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 1,
          shadowRadius: 6,
          height: 55,
        },
        headerTintColor: white,
      })}
    >
      <MainView.Screen name="Home" component={TabBar} options={{ headerShown: false }} />
      <MainView.Screen name="EntryDetail" component={EntryDetail} />
    </MainView.Navigator>
  );
};

export default class App extends Component {
  componentDidMount() {
    setLocalNotification();
  }

  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{ flex: 1 }}>
          <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
          <NavigationContainer>
            <MainViewNavigation />
          </NavigationContainer>
        </View>
      </Provider>
    );
  }
}
