import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';
import {updatePass} from '../../redux/actions';
import {Toast} from 'native-base';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      password: '',
      confirmPassword: '',
    };
  }

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  changeTextCode = (text) => {
    this.setState({code: text});
  };

  changeTextPass = (text) => {
    this.setState({password: text});
  };

  changeTextPassConfirm = (text) => {
    this.setState({confirmPassword: text});
  };

  updatePassword = async () => {
    if (!this.state.password || !this.state.confirmPassword) {
      this.showToast('data is empty!');
      return;
    }
    const data = {
      code: this.props.route.params.code,
      email: this.props.route.params.email,
      password: this.state.password,
    };
    await this.props.updatePass(data);
    this.showToast(this.props.msg);
    if (this.props.status != 200 && this.props.status != 304) {
      return;
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader status={this.props.loading} msg={''}></Loader>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={this.changeTextPass}
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={this.changeTextPassConfirm}
            style={styles.inputText}
            placeholder="Confirm Password..."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.updatePassword}>
            <Text style={styles.loginText}>UPDATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = {
  updatePass,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.updatePass;
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccfea',
    flex: 1,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#a4acea',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    borderColor: '#4352bc',
    borderWidth: 1,
  },
  inputText: {
    height: 60,
    color: 'white',
  },
  loginBtn: {
    width: '60%',
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});
