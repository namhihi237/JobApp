import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Loader} from '../../common';
import axios from 'axios';
import {apiUrl} from '../../api/api';

import {} from '../../redux/actions';
import {getData} from '../../utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const {GET_JOBS_URL} = apiUrl;
class Companies extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <View></View>;
  }
}
const mapDispatchToProps = {};

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Companies);

const styles = StyleSheet.create({
  container: {
    height: windowHeight - 26,
  },
});
