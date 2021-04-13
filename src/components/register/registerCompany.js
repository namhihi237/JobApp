import React, {Component} from 'react';
import {Toast} from 'native-base';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {registerCompany} from '../../redux/actions';
import {connect} from 'react-redux';
import {Loader} from '../../common';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
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

  changeTextCompanyName = (text) => {
    this.setState({companyName: text});
  };

  moveToLogin = () => {
    this.props.navigation.navigate('Login');
  };

  validateData = () => {
    let {email, password, companyName} = this.state;
    if (!email || !password || !companyName) return false;
    return true;
  };

  registerAcc = async () => {
    const {email, password, companyName} = this.state;
    const data = {
      email,
      password,
      companyName,
    };
    if (!this.validateData()) {
      this.showToast('Data is empty');
      return;
    }
    await this.props.registerCompany(data);
    this.showToast(this.props.msg);
    if (this.props.success) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader status={this.props.loading} msg={'Register'}></Loader>
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
            placeholder="Name..."
            placeholderTextColor="#003f5c"
            onChangeText={this.changeTextCompanyName}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={this.registerAcc}>
            <Text style={styles.loginText}>SIGNUP ACCOUNT COMPANY</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.moveToLogin}>
          <Text style={styles.loginText}>SignIn</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = {
  registerCompany,
};

const mapStateToProps = (state) => {
  return {
    msg: state.registerCompany.msg,
    loading: state.registerCompany.loading,
    success: state.registerCompany.success,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);

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
  type: {height: 40, width: 200},
});
