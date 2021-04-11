import React, {Component} from 'react';
import {Loader} from '../../common';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {listApply} from '../../redux/actions';
import {Toast} from 'native-base';
import {getData} from '../../utils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class ApplyList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
  }

  showToast = (msg, type) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
      type,
    });
  };

  componentDidMount() {
    this._isMounted = true;
    const unsubscribe = this.props.navigation.addListener(
      'focus',
      async () => {},
    );
    return unsubscribe;
  }

  moveToCreatePost = () => {
    this.props.navigation.navigate('CreatePost');
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.props.status != 200 && this.props.status != 304) {
      return (
        <View>
          <Text>No data</Text>
        </View>
      );
    }
    return <View style={styles.container}></View>;
  }
}
const mapDispatchToProps = {
  listApply,
};

const mapStateToProps = (state) => {
  const {status, msg, applies} = state.listApply;
  return {
    status,
    msg,
    applies,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ApplyList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
