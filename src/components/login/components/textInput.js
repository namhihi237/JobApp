import React, {useState} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TextInputLogin = (props) => {
  const [height, setHeight] = useState(1);
  const [color, setColor] = useState('#9b8585');

  const onFocus = () => {
    setHeight(2);
    setColor('#1176f9');
  };

  const onBlur = () => {
    setHeight(1);
    setColor('#9b8585');
  };

  return (
    <View>
      <View style={styles.inputView}>
        <FontAwesome5 name={props.iconName} style={styles.icon} />
        <TextInput
          onChangeText={props.onChangeText}
          style={styles.inputText}
          placeholder={props.placeholder}
          placeholderTextColor="#a89292"
          onFocus={onFocus}
          onBlur={onBlur}
          value={props.value}
          secureTextEntry={props.secureTextEntry}
        />
      </View>
      <View style={{backgroundColor: color, height}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: wp('90%'),
    height: 50,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  inputText: {
    color: '#000',
    width: wp('62%'),
    fontSize: 17,
    marginLeft: 5,
  },
  icon: {
    fontSize: 16,
  },
});

export default TextInputLogin;
