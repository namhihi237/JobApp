import React, {Component} from 'react';
import {getData, storeData} from '../../utils';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export class Landing extends Component {
  moveToLoginAccount = async () => {
    const token = await getData('token');

    if (token === '' || token === null || token === undefined) {
      this.props.navigation.navigate('Login');
    } else {
      const role = await getData('role');
      if (role == 0) {
        this.props.navigation.navigate('MainStudent');
      } else {
        this.props.navigation.navigate('MainCompany');
      }
    }
  };

  clear = async () => {
    await storeData('token', '');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.ovalContainer}>
          <View style={styles.oval1}></View>
          <View style={styles.oval2}></View>
        </View>
        <View style={styles.buttonEmailContainer}>
          <TouchableOpacity style={styles.loginEmailBtn} onPress={this.clear}>
            <Text style={styles.loginText}>Login with Email</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.moveToLoginAccount}>
            <Text style={styles.loginText}>Login with Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  ovalContainer: {
    width: 130,
    height: 80,
    left: windowWidth * 0.328,
    top: windowHeight * 0.16,
  },
  oval1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 100 / 2,
    backgroundColor: '#596DFF',
    left: (50 % -80) / 2 - 24.5,
  },
  oval2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 100 / 2,
    backgroundColor: 'rgba(250, 96, 125, 0.5)',
    left: (50 % -80) / 2 + 25.5,
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
    backgroundColor: '#3364B7',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#3364B7',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    fontSize: 19,
  },
});
