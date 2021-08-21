import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Card = (props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={props.onPress}>
      <Image style={styles.image} source={props.source} />
      <Text style={styles.content}>{props.content}</Text>
      <FontAwesome5 name={props.iconRight} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#c5cdd6',
    height: hp('10%'),
    marginTop: hp('2%'),
    marginLeft: wp('5%'),
    width: wp('90%'),
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    fontSize: 21,
  },
  content: {
    fontSize: 19,
    fontFamily: 'Itim-Regular',
    width: wp('45%'),
  },
  image: {
    height: 25,
    width: 25,
  },
});

export default Card;
