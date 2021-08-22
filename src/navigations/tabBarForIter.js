import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import {HomeJob, ListCompaniesNav, IterNav, Settings} from './';
import {MyTabBar} from '../common';
import {Notification} from '../components';
class tabBarForIter extends Component {
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
        <Tab.Screen
          name="My CV"
          component={IterNav}
          options={{icon: 'file-signature'}}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{icon: 'bell'}}
        />
        <Tab.Screen
          name="Setting"
          component={Settings}
          options={{icon: 'cog'}}
        />
      </Tab.Navigator>
    );
  }
}

export default tabBarForIter;
