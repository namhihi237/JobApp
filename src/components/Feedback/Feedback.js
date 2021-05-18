import React, {Component} from 'react';
import {Toast} from 'native-base';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {sendFeedback} from '../../redux/actions';

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
    console.log(data);
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
      <View style={{flex: 1, backgroundColor: '#eadede'}}>
        <TouchableOpacity onPress={this.openBar}>
          <FontAwesome5 name={'bars'} style={styles.iconBars} />
        </TouchableOpacity>
        <TextInput
          onChangeText={this.changeContent}
          value={this.state.content}
          multiline={true}
          numberOfLines={4}
          style={styles.desInput}
          placeholder="Description"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.loginBtn} onPress={this.sendFeedback}>
          <Text style={{fontFamily: 'Sarpanch-Black', fontSize: 20}}>Send</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#9b6363',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    marginLeft: wp('20%'),
    width: wp('60%'),
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
    marginBottom: 5,
    paddingLeft: 6,
    textAlignVertical: 'top',
    marginLeft: wp('10%'),
    borderRadius: 5,
    fontFamily: 'TimesNewRoman',
    backgroundColor: '#fff',
    marginTop: hp('10%'),
  },
});
