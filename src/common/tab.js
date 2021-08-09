import * as React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MyTabBar = ({state, descriptors, navigation}) => {
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
              <FontAwesome5
                name={icon}
                style={{...styles.icon, color: isFocused ? '#673ab7' : '#222'}}
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
    backgroundColor: '#fff',
    height: hp('8%'),
    borderRadius: 50,
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
    marginBottom: hp('1%'),
    width: wp('80%'),
    marginLeft: wp('10%'),
  },
  icon: {
    fontSize: 25,
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
    backgroundColor: '#b4cbe8',
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
