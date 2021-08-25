import React, {Component} from 'react';
import {Animated} from 'react-native';
import {getData, storeData} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {Easing} from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginLeftAnimA: new Animated.Value(0),
      marginRightAnimB: new Animated.Value(windowWidth - 80),
    };
  }

  componentDidMount() {
    Animated.parallel([
      this.createAnimation(
        this.state.marginLeftAnimA,
        1000,
        windowWidth / 2 - 60,
      ),
      this.createAnimation(
        this.state.marginRightAnimB,
        1000,
        windowWidth / 2 - 20,
      ),
    ]).start();
  }
  createAnimation = (value, duration, tovalue, delay = 0) => {
    return Animated.timing(value, {
      toValue: tovalue,
      duration,
      easing: Easing.linear,
      delay,
      useNativeDriver: true,
    });
  };
  moveToLoginAccount = async () => {
    const token = await getData('token');

    if (token === '' || token === null || token === undefined) {
      this.props.navigation.navigate('Login');
    } else {
      const role = await getData('role');
      if (role == 'iter') {
        this.props.navigation.navigate('MainIter');
      } else {
        this.props.navigation.navigate('MainCompany');
      }
    }
  };

  clear = async () => {
    await storeData('token', '');
    await storeData('role', '');
    await storeData('userId', '');
    this.props.navigation.navigate('MainGuest');
  };

  render() {
    const {marginLeftAnimA, marginRightAnimB} = this.state;
    return (
      <LinearGradient
        colors={['#cdaeee', '#88bae0', '#3dc7d0']}
        style={styles.container}>
        <View style={styles.ovalContainer}>
          <Animated.View
            style={{
              ...styles.oval1,
              translateX: marginRightAnimB,
            }}></Animated.View>
          <Animated.View
            style={{
              ...styles.oval2,
              translateX: marginLeftAnimA,
            }}></Animated.View>
        </View>
        <View
          style={{
            width: wp('100%'),
            marginTop: hp('22%'),
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/image/landing.png')}
            style={{height: 150, width: 150}}></Image>
        </View>
        <View style={styles.buttonEmailContainer}>
          <TouchableOpacity style={styles.loginEmailBtn} onPress={this.clear}>
            <Text style={styles.loginText}>Guest</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.moveToLoginAccount}>
            <Text style={styles.loginText}>Login with Account</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ovalContainer: {
    width: windowWidth,
    height: 80,
    top: windowHeight * 0.16,
  },
  oval1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 100 / 2,
    backgroundColor: '#596DFF',
  },
  oval2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 100 / 2,
    backgroundColor: 'rgba(250, 96, 125, 0.5)',
  },
  buttonEmailContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    width: windowWidth * 0.7,
    height: 55,
    left: 0.15 * windowWidth,
    top: windowHeight * 0.526,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    width: windowWidth * 0.7,
    height: 55,
    left: 0.15 * windowWidth,
    top: 0.657 * windowHeight,
  },
  loginEmailBtn: {
    width: '100%',
    backgroundColor: 'rgba(51, 100, 183, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#20498c',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginBtn: {
    width: '100%',
    borderColor: '#20498c',
    backgroundColor: 'rgba(51, 100, 183, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    fontSize: 19,
    fontFamily: 'Sarpanch-SemiBold',
  },
});
