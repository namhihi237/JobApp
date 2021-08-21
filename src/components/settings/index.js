import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {storeData, getData} from '../../utils';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Card} from './components';
import _ from 'lodash';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {getProfile, login} from '../../redux/actions';
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
    };
  }
  logout = () => {
    storeData('token', '');
    storeData('userId', '');
    storeData('role', '');
    this.props.navigation.navigate('Login');
  };
  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getProfile();
    });
    return unsubscribe;
  }
  moveToScreen = (screen) => this.props.navigation.navigate(screen);
  render() {
    const user = this.props.user;
    return (
      <ScrollView
        style={{flex: 1, backgroundColor: '#fff'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.avatar}
          source={{
            uri:
              _.get(user, 'image') ||
              'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
          }}></Image>
        <View style={styles.info}>
          <Text style={styles.name}>{_.get(user, 'name')}</Text>
        </View>
        <Card
          iconRight={'arrow-alt-circle-right'}
          content={'Manage Account'}
          onPress={() => this.moveToScreen('My Profile')}
          source={require('../../assets/image/user.png')}></Card>
        {this.props.role == 'iter' ? (
          <Card
            iconRight={'arrow-alt-circle-right'}
            content={'Saved Posts'}
            onPress={() => this.moveToScreen('Saved Posts')}
            source={require('../../assets/image/user.png')}></Card>
        ) : null}
        <Card
          iconRight={'arrow-alt-circle-right'}
          content={'Feedback'}
          onPress={() => this.moveToScreen('Feedback')}
          source={require('../../assets/image/user.png')}></Card>
        <Card
          iconRight={'arrow-alt-circle-right'}
          content={'Change password'}
          onPress={() => this.moveToScreen('Change Password')}
          source={require('../../assets/image/user.png')}></Card>

        <TouchableOpacity style={styles.logout} onPress={this.logout}>
          <Text style={styles.textLogout}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
const mapDispatchToProps = {
  getProfile,
  login,
};

const mapStateToProps = (state) => {
  const {loading, user, status, msg} = state.getProfile;
  console.log(state.login.role);
  return {
    loading,
    user,
    status,
    msg,
    role: state.login.role,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    height: wp('34%'),
    width: wp('34%'),
    borderRadius: 100,
    borderColor: '#52729e',
    borderWidth: 1,
    marginTop: hp('2%'),
    marginLeft: wp('33%'),
  },
  name: {
    fontSize: 25,
    fontFamily: 'Itim-Regular',
  },

  info: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logout: {
    backgroundColor: '#c5cdd6',
    height: hp('7%'),
    marginTop: hp('4%'),
    marginLeft: wp('5%'),
    width: wp('90%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textLogout: {
    fontFamily: 'Itim-Regular',
    fontSize: 19,
    color: '#d35858',
  },
});
