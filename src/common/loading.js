import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View, Modal, Text} from 'react-native';

export class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        visible={this.props.status}
        transparent={true}
        animationType={'none'}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#00ff00" />
            {this.props.msg ? <Text>{this.props.msg}</Text> : null}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
