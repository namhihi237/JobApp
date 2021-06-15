import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class Input extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.inputView}>
        <TextInput
          onChangeText={this.props.onChangeText}
          style={styles.inputText}
          placeholder={this.props.placeholder}
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
        />
      </View>
    );
  }
}

export default Input;

const styles = StyleSheet.create({
  inputView: {
    width: wp('80%'),
    backgroundColor: '#d6d3e5',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    borderColor: '#7b72aa',
    borderWidth: 1,
    padding: 20,
  },
  inputText: {
    height: 60,
    color: 'black',
  },
});
