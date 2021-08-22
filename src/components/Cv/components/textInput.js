import React, {useState} from 'react';
import {TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
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
        <TextInput
          onChangeText={props.onChangeText}
          style={styles.inputText}
          placeholder={props.placeholder}
          editable={props.editable || true}
          placeholderTextColor="#a89292"
          value={props.value}
          onFocus={onFocus}
          onBlur={onBlur}
          value={props.value}
        />
        {props.iconName && (
          <TouchableOpacity onPress={props.onPress}>
            <FontAwesome5 name={props.iconName} style={styles.iconCalendar} />
          </TouchableOpacity>
        )}
      </View>
      <View style={{backgroundColor: color, height}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: wp('80%'),
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: wp('1%'),
  },

  inputText: {
    color: '#000',
    width: wp('62%'),
    fontSize: 17,
  },
  icon: {
    fontSize: 16,
  },
  iconCalendar: {
    color: 'black',
    fontSize: 25,
    marginTop: 3,
    color: 'blue',
  },
});

export default TextInputLogin;
