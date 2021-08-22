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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
        <View style={{flex: 1, backgroundColor: '#fcf9f9'}}>
          <Header title={'           Feedback'} left={true} color="#0E1442" />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.desInputContainer}>
              <View>
                <Text style={styles.feedBackText}>Feedback! 😋</Text>
              </View>
              <View style={styles.faceContainer}>
                <FontAwesome5 name={'frown'} style={styles.face} />
                <FontAwesome5 name={'meh'} style={styles.face} />
                <FontAwesome5
                  name={'smile'}
                  style={{...styles.face, color: '#f29121'}}
                />
              </View>
              <TextInput
                onChangeText={this.changeContent}
                value={this.state.content}
                multiline={true}
                numberOfLines={3}
                style={styles.desInput}
                placeholder="Description"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={this.sendFeedback}>
              <Text
                style={{
                  fontFamily: 'Itim-Regular',
                  fontSize: 23,
                  color: '#fff',
                }}>
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
    backgroundColor: '#464e89',
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
    height: hp('20%'),
    width: wp('70%'),
    textAlignVertical: 'top',
    borderRadius: 5,
    fontFamily: 'TimesNewRoman',
    backgroundColor: '#f7f4f4',
    padding: 20,
    fontSize: 18,
  },
  desInputContainer: {
    width: wp('80%'),
    backgroundColor: '#fff',
    marginTop: hp('20%'),
    height: hp('40%'),
    borderRadius: 10,
    marginLeft: wp('10%'),
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  feedBackText: {
    fontSize: 30,
    color: '#7b72aa',
  },
  face: {
    fontSize: wp('13%'),
  },
  faceContainer: {
    width: wp('60%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
