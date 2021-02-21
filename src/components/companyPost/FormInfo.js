import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native';
export class FormInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {post} = this.props;
    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
        <View style={styles.post}>
          <TextInput style={styles.textInput} placeholder="Skill"></TextInput>
          <TextInput style={styles.textInput}></TextInput>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  post: {},
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    width: 200,
    marginBottom: 5,
  },
});
