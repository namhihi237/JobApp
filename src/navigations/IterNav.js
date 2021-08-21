import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Cv, getOneCv, UpdateCv} from '../components';
const Stack = createStackNavigator();
const IterStack = createStackNavigator();
class IterNav extends Component {
  render() {
    return (
      <IterStack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="My CV" component={getOneCv} />
        <Stack.Screen name="CreateCv" component={Cv} />
        <Stack.Screen name="UpdateCV" component={UpdateCv} />
      </IterStack.Navigator>
    );
  }
}
export default IterNav;
