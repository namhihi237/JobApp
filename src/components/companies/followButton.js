import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import _ from 'lodash';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FollowButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: props.isFollow ? '#61BCF9' : '#fff',
      }}
      onPress={props.onPress}>
      <Text style={styles.text}>Follow</Text>
    </TouchableOpacity>
  );
};

export default FollowButton;

const styles = StyleSheet.create({
  container: {
    height: 26,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#61BCF9',
    borderRadius: 7,
  },
  title: {
    fontFamily: 'TimesNewRoman',
    fontSize: 22,
  },
});
