import React, {Component} from 'react';
import {Toast} from 'native-base';
import {Loader} from '../../common';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {login, getFollowing} from '../../redux/actions';
import {getData} from '../../utils';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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
      eye: false,
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

  togglePassword = () => {
    this.setState({eye: !this.state.eye});
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#cdaeee', '#3b5998']}
          style={{
            width: windowWidth,
            height: windowHeight + 20,
            ...styles.container,
          }}>
          <Loader status={this.props.loading} msg={'Login'}></Loader>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#8094bc',
              padding: 10,
              borderRadius: 20,
              paddingBottom: 30,
              paddingTop: 30,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 8,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            }}>
            <View style={styles.inputView}>
              <FontAwesome5 name={'envelope'} style={styles.icon} />
              <TextInput
                onChangeText={this.changeTextEmail}
                style={styles.inputText}
                placeholder="Email. . ."
                placeholderTextColor="#003f5c"
              />
            </View>
            <View style={styles.inputView}>
              <FontAwesome5 name={'key'} style={styles.icon} />
              <TextInput
                onChangeText={this.changeTextPass}
                style={styles.inputText}
                placeholder="Password..."
                placeholderTextColor="#003f5c"
                secureTextEntry={!this.state.eye}
              />
              <TouchableOpacity onPress={this.togglePassword}>
                {this.state.eye ? (
                  <FontAwesome5 name={'eye-slash'} style={styles.icon} />
                ) : (
                  <FontAwesome5 name={'eye'} style={styles.icon} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={this.moveToForgotPassword}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={this.moveToMain}>
                <Text style={{fontFamily: 'Itim-Regular', fontSize: 29}}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={this.moveToRegisterIter}
              style={{marginBottom: 10}}>
              <Text style={styles.loginText}>Signup for Iter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.moveToRegisterCompany}>
              <Text style={styles.loginText}>Signup for Company</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  forgot: {
    color: 'white',
    fontSize: 13,
  },
  loginBtn: {
    width: wp('55%'),
    backgroundColor: 'rgba(251, 91, 90, 0.8)',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },
  inputView: {
    width: wp('80%'),
    backgroundColor: 'rgba(70, 88, 129 , 0.7)',
    borderWidth: 1,
    borderColor: '#3a455b',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    color: 'white',
    width: wp('62%'),
    fontFamily: 'TimesNewRoman',
    fontSize: 17,
    marginLeft: 5,
  },

  buttonLogin: {
    height: 50,
    width: 100,
    backgroundColor: '#456745',
    margin: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    fontSize: 16,
  },
  loginText: {
    fontFamily: 'TimesNewRoman',
    fontSize: 17,
    textDecorationLine: 'underline',
  },
});
