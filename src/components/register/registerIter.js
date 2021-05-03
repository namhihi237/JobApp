import React, {Component} from 'react';
import {Toast} from 'native-base';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from 'react-native-gesture-handler';
import {registerIter} from '../../redux/actions';
import {connect} from 'react-redux';
import {Loader} from '../../common';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    };
  }
  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  changeTextEmail = (text) => {
    this.setState({email: text});
  };

  changeTextPass = (text) => {
    this.setState({password: text});
  };

  changeTextConfirmPass = (text) => {
    this.setState({confirmPassword: text});
  };
  changeTextFullName = (text) => {
    this.setState({fullName: text});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  validateData = () => {
    let {email, password, fullName} = this.state;
    if (!email || !password || !fullName) return false;
    return true;
  };

  moveToLogin = () => {
    this.props.navigation.navigate('Login');
  };
  registerAcc = async () => {
    const {email, password, fullName} = this.state;
    const data = {
      email,
      password,
      fullName,
    };
    if (!this.validateData()) {
      this.showToast('Data is empty');
      return;
    }
    await this.props.registerIter(data);
    this.showToast(this.props.msg);
    if (this.props.success) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#cdaeee', '#94e4e9']}
          style={styles.container}>
          <Loader status={this.props.loading} msg={'Registering'}></Loader>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email..."
              placeholderTextColor="#003f5c"
              onChangeText={this.changeTextEmail}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password..."
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={this.changeTextPass}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Confirm password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={this.changeTextConfirmPass}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Full Name..."
              placeholderTextColor="#003f5c"
              onChangeText={this.changeTextFullName}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={this.registerAcc}>
              <Text style={styles.loginText}>SIGNUP ACCOUNT ITER</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.moveToLogin}>
            <Text style={styles.loginText}>SignIn</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }
}

const mapDispatchToProps = {
  registerIter,
};

const mapStateToProps = (state) => {
  return {
    msg: state.registerIter.msg,
    loading: state.registerIter.loading,
    success: state.registerIter.success,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);

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
    backgroundColor: 'rgba(70, 88, 129, 0.8)',
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

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  type: {height: 40, width: 200},
});
