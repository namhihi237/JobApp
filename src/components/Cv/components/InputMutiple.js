import React, {useState} from 'react';
import {TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TextInputMultiple = (props) => {
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
      <View
        style={{...styles.inputView, borderWidth: height, borderColor: color}}>
        <TextInput
          onChangeText={props.onChangeText}
          style={styles.inputText}
          placeholder={props.placeholder}
          editable={props.editable || true}
          placeholderTextColor="#a89292"
          numberOfLines={props.numberOfLines}
          multiline={true}
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
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: wp('80%'),
    height: 120,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 4,
  },

  inputText: {
    color: '#000',
    width: wp('62%'),
    textAlignVertical: 'top',
    fontSize: 17,
  },
  icon: {
    fontSize: 16,
  },
  iconCalendar: {
    color: 'black',
    fontSize: 25,
    marginTop: 10,
    color: 'blue',
  },
});

export default TextInputMultiple;
