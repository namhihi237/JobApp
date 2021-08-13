import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Notification = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const keyExtractor = (item) => item.id;

  const renderItem = (item) => <Card item={item}></Card>;

  return <View></View>;
};

export default Notification;

const styles = StyleSheet.create({
  flatListContainer: {
    marginBottom: hp('8%'),
  },
});
