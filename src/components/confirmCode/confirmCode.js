import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';
import {confirmCode} from '../../redux/actions';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';
import {TabRouter} from '@react-navigation/routers';
class ConfirmCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.LONG);
  };

  changeTextCode = (text) => {
    this.setState({code: text});
  };

  confirmCode = async () => {
    if (!this.state.code) {
      this.showToast('code is empty!');
      return;
    }
    const data = {code: this.state.code, email: this.props.route.params.email};
    await this.props.confirmCode(data);
    this.showToast(this.props.msg);
    if (this.props.status != 200 && this.props.status != 304) {
      return;
    } else {
      this.props.navigation.navigate('UpdatePassword', {
        email: this.props.route.params.email,
        code: this.state.code,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader status={this.props.loading} msg={''}></Loader>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Code..."
            placeholderTextColor="#003f5c"
            onChangeText={this.changeTextCode}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={this.confirmCode}>
            <Text style={styles.loginText}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = {
  confirmCode,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.confirmCode;
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCode);

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
