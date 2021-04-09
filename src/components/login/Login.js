import React, {Component} from 'react';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {login} from '../../redux/actions';
import {getData} from '../../utils';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
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
      this.showToast('Email or password is empty!');
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
      <View style={styles.container}>
        <Loader status={this.props.loading} msg={'Signing in '}></Loader>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={this.changeTextEmail}
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={this.changeTextPass}
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity onPress={this.moveToForgotPassword}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={this.moveToMain}>
            <Text style={styles.loginText}>LOGIN</Text>
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
    );
  }
}
const mapDispatchToProps = {
  login,
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
    backgroundColor: '#a5e8a4',
    flex: 1,
  },
  forgot: {
    color: 'white',
    fontSize: 13,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 60,
    color: 'white',
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
});
