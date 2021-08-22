import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Job, Search} from '../components';
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
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
export default HomeJob;
