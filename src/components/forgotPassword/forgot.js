import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';
import {forgotPassword} from '../../redux/actions';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';
class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.LONG);
  };

  changeTextEmail = (text) => {
    this.setState({email: text});
  };

  resetPassword = async () => {
    if (!this.state.email) {
      this.showToast('Email  is empty!');
      return;
    }
    const data = {email: this.state.email};
    await this.props.forgotPassword(data);
    this.showToast(this.props.msg);
    if (this.props.status != 200 && this.props.status != 304) {
      return;
    } else {
      this.props.navigation.navigate('ConfirmCode', {email: this.state.email});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader status={this.props.loading} msg={''}></Loader>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
            onChangeText={this.changeTextEmail}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.resetPassword}>
            <Text style={styles.loginText}>RESET</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = {
  forgotPassword,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.forgotPassword;
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Forgot);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003f5c',
    flex: 1,
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});
