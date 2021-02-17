import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const showLoading = (condition) => {
  if (condition) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    width: windowWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
