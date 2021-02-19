import React, {Component} from 'react';
import {View, Text} from 'react-native';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Landing, Login, RegisterIter, RegisterCompany} from './components';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {storeData, getData} from './utils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

class C2 extends Component {
  render() {
    return (
      <View>
        <Text>HS</Text>
      </View>
    );
  }
}

class C3 extends Component {
  render() {
    return (
      <View>
        <Text>COmpany</Text>
      </View>
    );
  }
}

class tabBarForIter extends Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Todos" component={C3} />
        <Tab.Screen name="Settings" component={C2} />
      </Tab.Navigator>
    );
  }
}

class tabBarForCompany extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            if (route.name === 'Job') {
              return <Icon name="home" size={15}></Icon>;
            } else if (route.name === 'My Job') {
              return <Icon name="home" size={15}></Icon>;
            }
          },
        })}>
        <Tab.Screen name="Job" component={C2} />
        <Tab.Screen name="My Job" component={C3} />
        <Tab.Screen name="Profile" component={C3} />
        <Tab.Screen name="Setting" component={C3} />
      </Tab.Navigator>
    );
  }
}

export class App extends Component {
  checkLogin = async () => {
    const token = await getData('token');

    if (token === '' || token === null || token === undefined) {
      return false;
    }
    return true;
  };

  clear = async () => {
    await storeData('token', '');
  };

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Loading" component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RegisterIter" component={RegisterIter} />
            <Stack.Screen name="RegisterCompany" component={RegisterCompany} />
            <Stack.Screen name="MainIter" component={tabBarForIter} />
            <Stack.Screen name="MainCompany" component={tabBarForCompany} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
