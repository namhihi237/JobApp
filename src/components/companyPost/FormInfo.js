import React, {Component} from 'react';
import CheckboxList from 'rn-checkbox-list';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  Modal,
} from 'react-native';

const data = [
  {id: 1, name: 'Green Book'},
  {id: 2, name: 'Bohemian Rhapsody'},
  {id: 3, name: 'Roma'},
  {id: 4, name: 'Black Panther'},
  {id: 5, name: 'The Favourite'},
  {id: 6, name: 'A Star Is Born'},
  {id: 7, name: 'Vice'},
  {id: 8, name: 'BlacKkKlansman'},
  {id: 9, name: 'First Man'},
  {id: 10, name: 'If Beale Street Could Talk'},
  {id: 11, name: 'Bao'},
  {id: 12, name: 'Free Solo'},
  {id: 13, name: 'Period. End of Sentence.'},
  {id: 14, name: 'Skin'},
  {id: 15, name: 'Spider-Man: Into the Spider-Verse'},
];

export class FormInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  setModalVisible = (status) => {
    this.setState({
      modalVisible: status,
    });
  };

  showCheckBox = () => {
    this.setModalVisible(true);
  };

  render() {
    const {post, modalVisible} = this.props;
    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
        <View style={styles.post}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInput}
              editable={false}
              selectTextOnFocus={false}
              placeholder="Skill..."></TextInput>
            <TouchableOpacity
              style={styles.buttonChoice}
              onPress={this.showCheckBox}>
              <Text>choice</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.buttonChoice}
              onPress={this.showCheckBox}>
              <Text>choice</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Salary..."></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Address..."></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="End Time..."></TextInput>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.desInput}
            placeholder="Description"
            autoCorrect={false}
          />
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Choice Skill</Text>
                {/* <FormInfo></FormInfo> */}
                <View style={styles.containerButton}>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={this.addItem}>
                    <Text style={styles.textStyle}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    paddingLeft: 6,
  },
  desInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 100,
    width: 200,
    marginBottom: 5,
    paddingLeft: 6,
    textAlignVertical: 'top',
  },
  buttonChoice: {
    height: 30,
    width: 50,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 500,
    width: 300,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  openButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerButton: {
    flexDirection: 'row',
  },
  modalText: {
    fontSize: 20,
  },
});
