import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Button,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {registerIter} from '../../redux/actions';
import {connect} from 'react-redux';
import {Loader} from '../../common';
import RadioForm from 'react-native-simple-radio-button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

var radio_props = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
];

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      gender: 'Male',
      birthday: 'YYYY/MM/DD',
      isDatePickerVisible: false,
    };
  }
  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.LONG);
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

  setGender = (value) => {
    this.setState({gender: value});
  };

  // birthday
  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  handleConfirm = (value) => {
    let birthday = `${value.getFullYear()}/${value.getMonth()}/${value.getDate()}`;
    this.setState({birthday});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  validateData = () => {
    let {email, password, fullName, gender, birthday} = this.state;
    if (!email || !password || !fullName || !gender || !birthday) return false;
    if (birthday == 'YYYY/MM/DD') return false;
    return true;
  };

  moveToLogin = () => {
    this.props.navigation.navigate('Login');
  };
  registerAcc = async () => {
    const {email, password, gender, fullName, birthday} = this.state;
    const data = {
      email,
      password,
      gender,
      fullName,
      birthday,
      role: 'iter',
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
      <View style={styles.container}>
        <Loader status={this.props.loading}></Loader>
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
        <RadioForm
          radio_props={radio_props}
          formHorizontal={true}
          buttonColor={'#2196f3'}
          animation={true}
          onPress={this.setGender}
        />

        <View style={styles.birthday}>
          <Button title="Birthday" onPress={this.showDatePicker} />
          <Text style={styles.birthday_text}>{this.state.birthday}</Text>
        </View>
        <DateTimePickerModal
          isVisible={this.state.isDatePickerVisible}
          mode="date"
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={this.registerAcc}>
            <Text style={styles.loginText}>SIGNUP ACCOUT ITER</Text>
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
  type: {height: 40, width: 200},
  birthday: {
    flexDirection: 'row',
  },
  birthday_text: {
    fontSize: 20,
    marginTop: 5,
    marginLeft: 10,
  },
});
