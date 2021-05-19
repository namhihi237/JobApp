import React, {Component} from 'react';
import {Toast} from 'native-base';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {changePassword} from '../../redux/actions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header, Left, Body, Button, Icon, Title} from 'native-base';

class changePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: '',
      newPass: '',
    };
    this.showToast.bind(this);
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
    const data = {
      password: this.state.oldPass,
      newPassword: this.state.newPass,
    };
    await this.props.changePassword(data);
    if (this.props.msg == 'Success') {
      this.props.navigation.navigate('');
    }
    this.showToast(this.props.msg);
  };

  changeTextOldPass = (text) => {
    this.setState({oldPass: text});
  };

  changeTextNewPass = (text) => {
    this.setState({newPass: text});
  };

  openBar = () => {
    this.props.navigation.openDrawer();
  };
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1, backgroundColor: '#c5c7db'}}>
          <Header>
            <Left>
              <Button transparent onPress={this.openBar}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title style={{fontFamily: 'Itim-Regular'}}>
                Update Password
              </Title>
            </Body>
          </Header>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Loader status={this.props.loading} msg={'Changing '}></Loader>
              <View style={styles.inputView}>
                <TextInput
                  onChangeText={this.changeTextOldPass}
                  style={styles.inputText}
                  placeholder="Type password..."
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  onChangeText={this.changeTextNewPass}
                  style={styles.inputText}
                  placeholder="New Password..."
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  onChangeText={this.changeTextNewPass}
                  style={styles.inputText}
                  placeholder="Confirm Password..."
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={this.moveToMain}>
                  <Text style={{fontFamily: 'Itim-Regular', fontSize: 23}}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const mapDispatchToProps = {
  changePassword,
};

const mapStateToProps = (state) => {
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
    marginTop: hp('20%'),
  },
  loginBtn: {
    width: wp('50%'),
    backgroundColor: '#a18ef9',
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
    backgroundColor: '#d6d3e5',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    borderColor: '#7b72aa',
    borderWidth: 1,
    padding: 20,
  },
  inputText: {
    height: 60,
    color: 'black',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});
