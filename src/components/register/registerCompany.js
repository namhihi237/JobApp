import React, {Component} from 'react';
import {Toast} from 'native-base';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-gesture-handler';
import {registerCompany} from '../../redux/actions';
import {connect} from 'react-redux';
import {Loader} from '../../common';
import LinearGradient from 'react-native-linear-gradient';
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
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

  changeTextname = (text) => {
    this.setState({name: text});
  };

  moveToLogin = () => {
    this.props.navigation.navigate('Login');
  };

  validateData = () => {
    let {email, password, name} = this.state;
    if (!email || !password || !name) return false;
    return true;
  };

  registerAcc = async () => {
    const {email, password, name} = this.state;
    const data = {
      email,
      password,
      name,
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#cdaeee', '#94e4e9']}
          style={styles.container}>
          <Loader status={this.props.loading} msg={'Register'}></Loader>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <View style={styles.inputView}>
                <FontAwesome5 name={'envelope'} style={styles.icon} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Email..."
                  placeholderTextColor="#003f5c"
                  onChangeText={this.changeTextEmail}
                />
              </View>
              <View style={styles.inputView}>
                <FontAwesome5 name={'key'} style={styles.icon} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Password..."
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={this.changeTextPass}
                />
              </View>
              <View style={styles.inputView}>
                <FontAwesome5 name={'key'} style={styles.icon} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Confirm password..."
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={this.changeTextConfirmPass}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Company Name..."
                  placeholderTextColor="#003f5c"
                  onChangeText={this.changeTextname}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={this.registerAcc}>
                  <Text style={styles.loginText}>SIGNUP COMPANY</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.moveToLogin}>
                <Text
                  style={{
                    ...styles.loginText,
                    textDecorationLine: 'underline',
                  }}>
                  SignIn
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
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
    flex: 1,
    height: hp('102.5%'),
  },
  forgot: {
    color: 'white',
    fontSize: 13,
  },
  loginBtn: {
    width: wp('55%'),
    backgroundColor: '#fb5b5a',
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
  type: {height: 40, width: 200},
  loginText: {
    fontFamily: 'Itim-Regular',
    fontSize: 20,
  },
});
