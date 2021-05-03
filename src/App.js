import React, {Component} from 'react';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Root} from 'native-base';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Landing,
  Login,
  RegisterIter,
  RegisterCompany,
  Job,
  CompanyPost,
  CreatePost,
  Forgot,
  Confirm,
  UpdatePassword,
  Cv,
  ApplyList,
  CvByCompany,
  changePass,
  getOneCv,
  Profile,
  Search,
} from './components';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {storeData, getData} from './utils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CompanyPostStack = createStackNavigator();
const IterStack = createStackNavigator();
const HomeStack = createStackNavigator();

const Drawer = createDrawerNavigator();
class SettingDrawer extends Component {
  render() {
    return (
      <Drawer.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            if (route.name === 'My Profile') {
              return <Icon name="home" size={28}></Icon>;
            } else if (route.name === 'Change Password') {
              return <Icon name="work" size={28}></Icon>;
            }
          },
        })}
        initialRouteName="My Profile"
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem
                label="Logout"
                onPress={async () => {
                  await storeData('token', '');
                  await storeData('role', '');
                  props.navigation.navigate('Loading');
                }}
              />
            </DrawerContentScrollView>
          );
        }}>
        <Drawer.Screen name="My Profile" component={Profile} />
        <Drawer.Screen name="Change Password" component={changePass} />
      </Drawer.Navigator>
    );
  }
}

class IterNav extends Component {
  render() {
    return (
      <IterStack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="My CV"
          component={getOneCv}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateCv"
          component={Cv}
          options={{headerTitleAlign: 'center', title: 'Create Cv'}}
        />
      </IterStack.Navigator>
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
        <Tab.Screen name="Home" component={HomeJob} />
        <Tab.Screen name="My CV" component={IterNav} />
        <Tab.Screen name="Setting" component={SettingDrawer} />
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
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{headerTitleAlign: 'center', title: 'Create Post'}}
        />
        <Stack.Screen
          name="ApplyList"
          component={ApplyList}
          options={{headerTitleAlign: 'center', title: 'Applied List'}}
        />
        <Stack.Screen name="CV" component={CvByCompany} />
      </CompanyPostStack.Navigator>
    );
  }
}

class HomeJob extends Component {
  render() {
    return (
      <HomeStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Home"
          component={Job}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          screenOptions={{
            headerShown: true,
          }}
        />
      </HomeStack.Navigator>
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
        <Tab.Screen name="Home" component={HomeJob} />
        <Tab.Screen name="My Post" component={CompanyPostnav} />
        <Tab.Screen
          name="Setting"
          component={SettingDrawer}
          options={{
            headerRight: () => (
              <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#00cc00"
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

export class App extends Component {
  checkLogin = async () => {
    const token = await getData('token');
    if (!token) {
      return false;
    }
    return true;
  };

  clear = async () => {
    await storeData('token', '');
    await storeData('role', '');
  };

  initScreen = (async () => {
    const check = await this.checkLogin();
    if (check) {
      const role = await getData('role');
      return role == 'iter' ? 'MainIter' : 'MainCompany';
    }
    return 'Loading';
  })();
  render() {
    return (
      <Provider store={store}>
        <Root>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Loading"
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Loading" component={Landing} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="ForgotPassword" component={Forgot} />
              <Stack.Screen name="ConfirmCode" component={Confirm} />
              <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
              <Stack.Screen name="RegisterIter" component={RegisterIter} />
              <Stack.Screen
                name="RegisterCompany"
                component={RegisterCompany}
              />
              <Stack.Screen name="MainIter" component={tabBarForIter} />
              <Stack.Screen name="MainCompany" component={tabBarForCompany} />
            </Stack.Navigator>
          </NavigationContainer>
        </Root>
      </Provider>
    );
  }
}
