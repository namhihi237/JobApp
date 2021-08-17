import React, {Component} from 'react';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
  EditPost,
  UpdateCv,
  Companies,
  JobCompanies,
  Feedback,
  Notification,
  SavedPosts,
} from './components';
import {MyTabBar} from './common';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {storeData, getData} from './utils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CompanyPostStack = createStackNavigator();
const IterStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ListCompaniesStack = createStackNavigator();
const Drawer = createDrawerNavigator();
class SettingDrawer extends Component {
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
                  await storeData('userId', '');
                  props.navigation.navigate('Loading');
                }}
              />
            </DrawerContentScrollView>
          );
        }}>
        <Drawer.Screen name="My Profile" component={Profile} />
        {this.state.role === 'iter' ? (
          <Drawer.Screen name="Saved Posts" component={SavedPosts} />
        ) : null}
        <Drawer.Screen name="Change Password" component={changePass} />
        <Drawer.Screen name="Feedback" component={Feedback} />
      </Drawer.Navigator>
    );
  }
}

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
          component={ListCompaniesnav}
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
          component={SettingDrawer}
          options={{icon: 'cog'}}
        />
      </Tab.Navigator>
    );
  }
}

class CompanyPostnav extends Component {
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

class ListCompaniesnav extends Component {
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
        tabBar={(props) => <MyTabBar {...props} />}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeJob} options={{icon: 'home'}} />
        <Tab.Screen
          name="Companies"
          component={ListCompaniesnav}
          options={{icon: 'building'}}
        />
        <Tab.Screen
          name="My Post"
          component={CompanyPostnav}
          options={{icon: 'briefcase'}}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{icon: 'bell'}}
        />
        <Tab.Screen
          name="Setting"
          component={SettingDrawer}
          options={{icon: 'cog'}}
        />
      </Tab.Navigator>
    );
  }
}

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
          component={ListCompaniesnav}
          options={{icon: 'building'}}
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
              <Stack.Screen name="MainGuest" component={tabBarForGuest} />
            </Stack.Navigator>
          </NavigationContainer>
        </Root>
      </Provider>
    );
  }
}
