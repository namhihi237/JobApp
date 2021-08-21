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
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {sendFeedback} from '../../redux/actions';
import {Header} from '../../common';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  showToast = (msg, type) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
      type,
    });
  };

  validateData = () => {
    const {content} = this.state;
    if (!content) return false;
    return true;
  };

  sendFeedback = async () => {
    if (!this.validateData()) {
      this.showToast('Content is empty!', 'warning');
      return;
    }
    const data = {
      content: this.state.content,
    };
    await this.props.sendFeedback(data);
    if (this.props.msg == 'Success') {
      this.setState({content: ''});
      this.showToast(this.props.msg, 'success');
      return;
    }
    this.showToast(this.props.msg);
  };

  changeContent = (content) => {
    this.setState({content});
  };

  openBar = () => {
    this.props.navigation.openDrawer();
  };
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1, backgroundColor: '#c5c7db'}}>
          <Header title={'           Feedback'} left={true} color="#0E1442" />
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              onChangeText={this.changeContent}
              value={this.state.content}
              multiline={true}
              numberOfLines={4}
              style={styles.desInput}
              placeholder="Description"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={this.sendFeedback}>
              <Text style={{fontFamily: 'Itim-Regular', fontSize: 23}}>
                Send
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const mapDispatchToProps = {
  sendFeedback,
};

const mapStateToProps = (state) => {
  return {
    msg: state.sendFeedback.msg,
    loading: state.sendFeedback.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);

const styles = StyleSheet.create({
  container: {
    flex: 18,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#a18ef9',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    marginLeft: wp('20%'),
    width: wp('60%'),
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },

  iconBars: {
    fontSize: 30,
    marginTop: 9,
    color: '#356fb7',
    marginLeft: 20,
  },
  desInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 200,
    width: wp('80%'),
    textAlignVertical: 'top',
    marginLeft: wp('10%'),
    borderRadius: 5,
    fontFamily: 'TimesNewRoman',
    backgroundColor: '#d6d3e5',
    marginTop: hp('20%'),
    borderColor: '#7b72aa',
    borderWidth: 1,
    padding: 20,
  },
});
