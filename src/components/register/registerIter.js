import React, {Component} from 'react';
import {Toast} from 'native-base';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from 'react-native';
import {registerIter} from '../../redux/actions';
import {connect} from 'react-redux';
import {Loader} from '../../common';
import {Button, TextInput} from '../login/components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  validateData = () => {
    let {email, password, name} = this.state;
    if (!email || !password || !name) return false;
    return true;
  };

  moveToLogin = () => {
    this.props.navigation.navigate('Login');
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
          colors={['#e1dae9', '#e2ebf1', '#c8eef6']}
          style={{flex: 1}}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <Loader status={this.props.loading} message={'Sign up'} />
            <Image
              source={require('../../assets/image/register.png')}
              style={styles.image}
            />
            <Text style={styles.text}>Signup Iter</Text>
            <View style={styles.form}>
              <TextInput
                iconName={'user'}
                onChangeText={this.changeTextname}
                placeholder={'Full Name'}></TextInput>
              <TextInput
                iconName={'envelope'}
                onChangeText={this.changeTextEmail}
                placeholder={'Email'}></TextInput>
              <TextInput
                iconName={'key'}
                placeholder={'Password'}
                onChangeText={this.changeTextPass}
                secureTextEntry={true}></TextInput>
              <TextInput
                iconName={'key'}
                placeholder={'Confirm password'}
                onChangeText={this.changeTextConfirmPass}
                secureTextEntry={true}></TextInput>
              <Button onPress={this.registerAcc} label={'Sign up'}></Button>
            </View>
            <View style={styles.textRegisterContainer}>
              <Text style={styles.textRegister1}>Already Registered? </Text>
              <TouchableOpacity onPress={this.moveToLogin}>
                <Text style={styles.textRegister}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    paddingLeft: wp('5%'),
  },
  form: {
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 35,
  },
  textRegisterContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: hp('6%'),
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
});
