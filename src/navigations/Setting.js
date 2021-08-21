import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Settings,
  Profile,
  changePass,
  Feedback,
  SavedPosts,
} from '../components';
const Stack = createStackNavigator();
const SettingStack = createStackNavigator();
import {getData} from '../utils';
class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
    };
  }
  async componentDidMount() {
    const role = await getData('role');
    this.setState({role});
  }

  render() {
    return (
      <SettingStack.Navigator
        initialRouteName="Setting"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Setting" component={Settings} />
        <Stack.Screen name="My Profile" component={Profile} />
        {this.state.role === 'iter' ? (
          <Stack.Screen name="Saved Posts" component={SavedPosts} />
        ) : null}
        <Stack.Screen name="Change Password" component={changePass} />
        <Stack.Screen name="Feedback" component={Feedback} />
      </SettingStack.Navigator>
    );
  }
}
export default Setting;
