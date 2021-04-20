import React, {Component} from 'react';
import {Toast} from 'native-base';
import {Loader} from '../../common';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {changePassword} from '../../redux/actions';
import {getData} from '../../utils';

class changePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: '',
      newPass: '',
    };
  }

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  validateData = () => {
    const {oldPass, newPass} = this.state;
    if (!oldPass || !newPass) return false;
    return true;
  };

  moveToMain = async () => {
    if (!this.validateData()) {
      this.showToast('Old Password or new Password is empty!');
      return;
    }
    const data = {password: this.state.oldPass, newPassword: this.state.newPass};
    console.log(data);
    await this.props.changePassword(data);
    if(this.props.msg == 'Success'){
      this.props.navigation.navigate('');
    }
    this.showToast(this.props.msg);
   // console.log(this.props);
    
  };

  changeTextOldPass = (text) => {
    this.setState({oldPass: text});
  };

  changeTextNewPass = (text) => {
    this.setState({newPass: text});
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader status={this.props.loading} msg={'Changing '}></Loader>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={this.changeTextOldPass}
            style={styles.inputText}
            placeholder="Type password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={this.changeTextNewPass}
            style={styles.inputText}
            placeholder="Type New Password..."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
          />
        </View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={this.moveToMain}>
            <Text style={styles.loginText}>CHANGE</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}
const mapDispatchToProps = {
  changePassword,
};

const mapStateToProps = (state) => {
    console.log(state.changePassword);
  return {
    msg: state.changePassword.msg,
    loading: state.changePassword.loading,
  };
  
};

export default connect(mapStateToProps, mapDispatchToProps)(changePass);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aecce2',
    flex: 1,
  },
  forgot: {
    color: 'white',
    fontSize: 13,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#3c9e69',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#ffff',
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
