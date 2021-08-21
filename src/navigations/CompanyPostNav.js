import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  CompanyPost,
  CreatePost,
  ApplyList,
  CvByCompany,
  EditPost,
} from '../components';
const CompanyPostStack = createStackNavigator();
const Stack = createStackNavigator();
class CompanyPostNav extends Component {
  render() {
    return (
      <CompanyPostStack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="MyPost" component={CompanyPost} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen
          name="ApplyList"
          component={ApplyList}
          options={{headerTitleAlign: 'center', title: 'Applied List'}}
        />
        <Stack.Screen
          name="EditForm"
          component={EditPost}
          options={{headerTitleAlign: 'center', title: 'Edit Post'}}
        />
        <Stack.Screen name="CV" component={CvByCompany} />
      </CompanyPostStack.Navigator>
    );
  }
}

export default CompanyPostNav;
