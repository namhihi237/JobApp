import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';
import {confirmCode} from '../../redux/actions';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
class Cv extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.LONG);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>CV</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(Cv);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
