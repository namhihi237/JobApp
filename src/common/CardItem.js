import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _ from 'lodash';
const windowWidth = Dimensions.get('window').width;
const CardItem = (props) => {
  const item = props.item;
  const userId = props.userId;
  const savedPosts = props.savedPosts;
  const savePost = props.savePost;
  const role = props.role;
  const showDetail = props.showDetail;
  const renderApply = (listApply, userId) => {
    for (let applier of listApply) {
      if (JSON.stringify(applier.iterId) === JSON.stringify(userId)) {
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 15,
            }}>
            <FontAwesome5
              name={'check-circle'}
              style={{fontSize: 15, marginTop: 2, color: 'green'}}
            />
            <Text
              style={{
                fontFamily: 'TimesNewRoman',
                marginLeft: 2,
                color: '#996f6f',
              }}>
              Applied
            </Text>
          </View>
        );
      }
    }
  };
  const renderButtonSaved = (savedPosts, post) => {
    if (role == 'iter' || !role) {
      return (
        <TouchableOpacity onPress={() => savePost(post)}>
          <FontAwesome5
            name={'bookmark'}
            style={{
              color: `${
                savedPosts.map((e) => e.postId).includes(post._id)
                  ? '#f25430'
                  : '#9a8072'
              }`,
              fontSize: hp('2.5%'),
            }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.item}>
      <View style={styles.logoContainer}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <FastImage
            style={styles.logo}
            source={{
              uri: _.get(item.company[0], 'image'),
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          {renderApply(item.apply, userId)}
        </View>
        <View style={{padding: 1, marginLeft: 10, width: wp('65%')}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{...styles.text, fontSize: hp('2.5%')}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.title}
            </Text>
            {renderButtonSaved(savedPosts, item)}
          </View>
          <Text
            style={{...styles.text, fontSize: hp('2.1%')}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {_.get(item.company[0], 'name')}
          </Text>
          <View style={styles.fiedlsText}>
            <FontAwesome5 name={'money-bill'} style={styles.iconText} />
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              {item.salary}
            </Text>
          </View>
          <View style={styles.fiedlsText}>
            <FontAwesome5 name={'code'} style={styles.iconText} />
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              {item.skill.join(', ')}
            </Text>
          </View>
          <View style={styles.fiedlsText}>
            <FontAwesome5 name={'map-marker-alt'} style={styles.iconText} />
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              {item.address}
            </Text>
          </View>
          <View style={styles.seeMore}>
            <TouchableOpacity onPress={() => showDetail(item)} style={{}}>
              <Text
                style={{
                  color: '#927874',
                  backgroundColor: '#d9d2c5',
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 5,
                }}>
                See more
              </Text>
            </TouchableOpacity>

            <View style={styles.fiedlsText}>
              <FontAwesome5
                name={'history'}
                style={{...styles.iconText, color: 'red'}}
              />
              <Text style={{marginLeft: 10}}>{item.endTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    height: (hp('100%') - 5) / 5,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,

    backgroundColor: '#fff',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,

    borderRadius: 15,
    elevation: 1,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  logo: {
    marginTop: 25,
    width: 80,
    height: 80,
  },
  text: {
    marginBottom: 1,
    marginLeft: 5,
    fontFamily: 'TimesNewRoman',
    fontSize: hp('2.1%'),
    maxWidth: wp('61%') - 20,
  },
  fiedlsText: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconText: {
    marginTop: 4,
    marginLeft: 5,
  },
  seeMore: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (windowWidth * 1.8) / 3,
    marginTop: 1,
  },
});
export default CardItem;
