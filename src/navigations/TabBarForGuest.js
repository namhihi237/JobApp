import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import {HomeJob, ListCompaniesNav} from './';
import {MyTabBar} from '../common';
class tabBarForGuest extends Component {
  render() {
    return (
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeJob} options={{icon: 'home'}} />
        <Tab.Screen
          name="Companies"
          component={ListCompaniesNav}
          options={{icon: 'building'}}
        />
      </Tab.Navigator>
    );
  }
}

export default tabBarForGuest;
