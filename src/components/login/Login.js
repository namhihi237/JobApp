import React, {Component} from 'react';
import {Toast} from 'native-base';
import {Loader} from '../../common';
import {Button, TextInput} from './components';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from 'react-native';

import {connect} from 'react-redux';
import {login, getFollowing} from '../../redux/actions';
import {getData} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  showToast = (text, type, duration = 2000, buttonText = 'Okey') => {
    Toast.show({
      text,
      buttonText,
      duration,
      type,
    });
  };

  moveToRegisterIter = () => {
    this.props.navigation.navigate('RegisterIter');
  };

  moveToRegisterCompany = () => {
    this.props.navigation.navigate('RegisterCompany');
  };

  validateData = () => {
    const {email, password} = this.state;
    if (!email || !password) return false;
    return true;
  };

  moveToMain = async () => {
    if (!this.validateData()) {
      this.showToast('Email or password is empty!', 'warning');
      return;
    }
    const data = {email: this.state.email, password: this.state.password};
    await this.props.login(data);
    this.showToast(this.props.msg);
    const token = await getData('token');
    const role = await getData('role');
    if (token === null || token === undefined || token === '') {
      this.props.navigation.navigate('Login');
      return;
    }
    if (role == 'iter') {
      this.props.navigation.navigate('MainIter');
    } else {
      this.props.navigation.navigate('MainCompany');
    }
  };

  changeTextEmail = (text) => {
    this.setState({email: text});
  };

  changeTextPass = (text) => {
    this.setState({password: text});
  };

  moveToForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#e1dae9', '#e2ebf1', '#c8eef6']}
          style={{flex: 1}}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <Loader status={this.props.loading} message={'logging'} />
            <Image
              source={require('../../assets/image/login.png')}
              style={styles.image}
            />
            <Text style={styles.text}>Login</Text>
            <View style={styles.form}>
              <TextInput
                iconName={'envelope'}
                onChangeText={this.changeTextEmail}
                value={this.state.email}
                placeholder={'example@gmail.com'}></TextInput>
              <TextInput
                iconName={'key'}
                placeholder={'******'}
                value={this.state.password}
                onChangeText={this.changeTextPass}
                secureTextEntry={true}></TextInput>
              <TouchableOpacity
                style={styles.forgot}
                onPress={this.moveToForgotPassword}>
                <Text style={styles.textRegister}>Forgot your password?</Text>
              </TouchableOpacity>
              <Button onPress={this.moveToMain} label={'Login'}></Button>
            </View>
            <View style={styles.textRegisterContainer}>
              <Text style={styles.textRegister1}>New user? </Text>
              <TouchableOpacity onPress={this.moveToRegisterIter}>
                <Text style={styles.textRegister}>Register Iter</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textRegisterContainerDown}>
              <TouchableOpacity onPress={this.moveToRegisterCompany}>
                <Text style={styles.textRegister}>Company</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }
}
const mapDispatchToProps = {
  login,
  getFollowing,
};

const mapStateToProps = (state) => {
  return {
    msg: state.login.msg,
    loading: state.login.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    paddingLeft: wp('5%'),
  },
  form: {
    width: wp('90%'),
    borderColor: '#3a455b',
  },
  image: {
    height: wp('60%'),
    width: wp('60%'),
    marginTop: hp('3%'),
    marginLeft: wp('15%'),
  },
  text: {
    fontFamily: 'Itim-Regular',
    fontSize: 40,
  },
  textRegisterContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: hp('10%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRegisterContainerDown: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: hp('1%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRegister1: {
    fontSize: 20,
    fontFamily: 'Itim-Regular',
  },
  textRegister: {
    marginLeft: 3,
    color: '#85adfc',
    fontSize: 20,
    fontFamily: 'Itim-Regular',
  },
  checkbox: {
    marginTop: hp('1%'),
  },
  forgot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
});
