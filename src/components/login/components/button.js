import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Button = (props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90%'),
    backgroundColor: '#85adfc',
    marginTop: hp('5%'),
  },
  text: {
    fontSize: 25,
    fontFamily: 'Itim-Regular',
  },
});

export default Button;
