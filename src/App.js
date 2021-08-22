import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Root} from 'native-base';

import {
  tabBarForGuest,
  tabBarForCompany,
  tabBarForIter,
} from '../src/navigations';
import {
  Landing,
  Login,
  RegisterIter,
  RegisterCompany,
  Forgot,
  Confirm,
  UpdatePassword,
} from './components';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {storeData, getData} from './utils';

const Stack = createStackNavigator();

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
              <Stack.Screen name="MainGuest" component={tabBarForGuest} />
            </Stack.Navigator>
          </NavigationContainer>
        </Root>
      </Provider>
    );
  }
}
