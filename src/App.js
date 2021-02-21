import React, {Component} from 'react';
import {View, Text} from 'react-native';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Landing,
  Login,
  RegisterIter,
  RegisterCompany,
  Job,
  CompanyPost,
  CreatePost,
} from './components';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {storeData, getData} from './utils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CompanyPostStack = createStackNavigator();
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
        <Text>Cmpany</Text>
      </View>
    );
  }
}

class tabBarForIter extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            if (route.name === 'Home') {
              return <Icon name="home" size={28}></Icon>;
            } else if (route.name === 'My CV') {
              return <Icon name="contact-page" size={28}></Icon>;
            } else if (route.name === 'Setting') {
              return <Icon name="settings" size={28}></Icon>;
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={Job} />
        <Tab.Screen name="My CV" component={C2} />
        <Tab.Screen name="Profile" component={C2} />
        <Tab.Screen name="Setting" component={C2} />
      </Tab.Navigator>
    );
  }
}

class CompanyPostnav extends Component {
  render() {
    return (
      <CompanyPostStack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="MyPost"
          component={CompanyPost}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="CreatePost" component={CreatePost} />
      </CompanyPostStack.Navigator>
    );
  }
}
class tabBarForCompany extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            if (route.name === 'Home') {
              return <Icon name="home" size={28}></Icon>;
            } else if (route.name === 'My Post') {
              return <Icon name="work" size={28}></Icon>;
            } else if (route.name === 'Setting') {
              return <Icon name="settings" size={28}></Icon>;
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={Job} />
        <Tab.Screen name="My Post" component={CompanyPostnav} />
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
    await storeData('role', '');
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
