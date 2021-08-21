import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Companies, JobCompanies} from '../components';
const Stack = createStackNavigator();
const ListCompaniesStack = createStackNavigator();

class ListCompaniesNav extends Component {
  render() {
    return (
      <ListCompaniesStack.Navigator
        initialRouteName="Companies"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Companies" component={Companies} />
        <Stack.Screen name="ListJobs" component={JobCompanies} />
      </ListCompaniesStack.Navigator>
    );
  }
}

export default ListCompaniesNav;
