import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Card = (props) => {
  const {item} = props;
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={{
            uri:
              _.get(item, 'image') ||
              'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
          }}
          style={styles.image}></Image>
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: wp('75%'),
          padding: hp('1%'),
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={styles.title}>{_.get(item, 'title')}</Text>
          <Text style={styles.createdAt}>
            {moment(item.createdAt).format('lll')}
          </Text>
        </View>
        <Text style={styles.body} numberOfLines={3} ellipsizeMode="tail">
          {_.get(item, 'content')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: wp('94%'),
    maxHeight: hp('15%'),
    backgroundColor: '#fff',
    borderRadius: 6,
    marginLeft: wp('3%'),
    paddingLeft: wp('3%'),
    paddingRight: wp('5%'),
    marginTop: 1,
    paddingBottom: 10,
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'TimesNewRoman',
    fontSize: 19,
    fontWeight: 'bold',
    color: 'red',
  },
  body: {
    fontFamily: 'TimesNewRoman',
    fontSize: 17,
  },
  image: {
    height: wp('15%'),
    width: wp('15%'),
  },
  createdAt: {
    fontFamily: 'TimesNewRoman',
    fontSize: 15,
    color: '#7d7d7d',
  },
});
