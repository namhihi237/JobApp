import * as React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Badge} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Pusher from 'pusher-js/react-native';
import axios from 'axios';
import {apiUrl} from '../api/api';

// configuration settings pusher
// Pusher.logToConsole = true;
var pusher = new Pusher('8b94f31b5cb93338e859', {
  cluster: 'ap1',
});
import {getData, storeData} from '../utils';

const MyTabBar = ({state, descriptors, navigation}) => {
  const [count, setCount] = React.useState(0);
  const [token, setToken] = React.useState(null);
  let channel = null;

  React.useEffect(() => {
    getData('token').then(async (token) => {
      if (!token) return;
      setToken(token);
      const result = await axios.get(
        `${apiUrl.BASE_URL}/api/v1/notifications/number`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      result.data?.numberOfNotifications
        ? setCount(result.data.numberOfNotifications)
        : setCount(0);
    });
    getData('userId').then((userId) => {
      if (!userId) return;
      channel = pusher.subscribe(`notification-${userId}`);
      if (channel) {
        channel.bind('push-new-notification', function (data) {
          if (data.numberOfNotifications) {
            setCount(data.numberOfNotifications);
          }
        });
      }
    });
  }, []);

  const resetNumberOfNotifications = async () => {
    try {
      setCount(0);
      await axios.post(
        `${apiUrl.BASE_URL}/api/v1/notifications/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      return;
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const icon = options.icon;
        const isFocused = state.index === index;

        const onPress = async () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
          if (route.name === 'Notification') {
            await resetNumberOfNotifications();
          }
        };

        return (
          <TouchableOpacity onPress={onPress} style={styles.button}>
            <View style={isFocused ? styles.focus : styles.noFocus}>
              {options.icon == 'bell' && count != 0 ? (
                <Badge
                  value={`${count}`}
                  status="error"
                  containerStyle={{position: 'absolute', top: -1, right: -1}}
                />
              ) : null}
              <FontAwesome5
                name={icon}
                style={{
                  ...styles.icon,
                  color: isFocused ? '#E5512F' : '#fff',
                }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1C1D26',
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    width: wp('100%'),
  },
  icon: {
    fontSize: 25,
    color: '#E5512F',
  },
  button: {
    flex: 1,

    alignItems: 'center',
  },
  buttonFocus: {
    flex: 1,
    alignItems: 'center',
  },
  focus: {
    backgroundColor: '#d9d2c5',
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  noFocus: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
});
export default MyTabBar;
