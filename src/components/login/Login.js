import React, {Component} from 'react';
import {showLoading} from '../../common';
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
  moveToRegister = () => {
    this.props.navigation.navigate('Register');
  };

  moveToMain = async () => {
    const data = {email: this.state.email, password: this.state.password};
    await this.props.login(data);
    console.log('ok');
    this.showToast(this.props.msg);
    const token = await getData('token');
    const role = await getData('role');
    console.log(token, role);
    if (token === null || token === undefined || token === '') {
      this.props.navigation.navigate('Login');
      return;
    }
    if (role == 0) {
      this.props.navigation.navigate('MainStudent');
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

  render() {
    return (
      <View style={styles.container}>
        {showLoading(this.props.loading)}
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

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={this.moveToMain}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.moveToRegister}>
          <Text style={styles.loginText}>Signup</Text>
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
    backgroundColor: '#003f5c',
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
  loginText: {},
});
