import * as React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Badge} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Pusher from 'pusher-js/react-native';

// configuration settings pusher
Pusher.logToConsole = true;
var pusher = new Pusher('8b94f31b5cb93338e859', {
  cluster: 'ap1',
});
import {getData, storeData} from '../utils';

const MyTabBar = ({state, descriptors, navigation}) => {
  const [isNotification, setIsNotification] = React.useState(false);
  const [count, setCount] = React.useState(0);
  let channel = null;

  React.useEffect(() => {
    getData('userId').then((userId) => {
      channel = pusher.subscribe(`notification-${userId}`);
      getData('notify').then((notify) => {
        console.log(isNaN(notify), notify);
        if (isNaN(notify)) {
        } else {
          console.log(notify);
          setCount((previousCount) => notify - 0);
        }
        if (channel) {
          console.log(count);
          channel.bind('push-new-notification', function (data) {
            if (data.message) {
              setIsNotification(true);
              console.log(data.message);
              console.log('count====', count);
              setCount((previousCount) => previousCount + 1);
              storeData('notify', count + 1 + '');
            }
          });
        }
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const icon = options.icon;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity onPress={onPress} style={styles.button}>
            <View style={isFocused ? styles.focus : styles.noFocus}>
              {options.icon == 'bell' && isNotification && count != 0 ? (
                <Badge
                  value={`${count}`}
                  status="error"
                  container={{position: 'absolute', top: -1, right: -1}}
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
    //backgroundColor: '#fff',
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
