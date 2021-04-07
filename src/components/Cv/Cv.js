import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';
import {confirmCode} from '../../redux/actions';

import SelectMultiple from 'react-native-select-multiple';
import {createIterCv} from '../../redux/actions';
import {dataSkill} from '../../constant';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  ScrollView,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Cv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSkill: [],
      personalSkill: '',
      experience: '',
      description: '',
      textSkill: '',
      modalVisible: false,
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.LONG);
  };

  setModalVisible = (status) => {
    this.setState({
      modalVisible: status,
    });
  };

  showModalSkill = () => {
    this.setState({modalVisible: true, skill: true});
  };

  onChangePersonalSkill = (personalSkill) => {
    this.setState({personalSkill});
  };

  onChangeExperience = (experience) => {
    this.setState({experience});
  };

  onChangeDescription = (description) => {
    this.setState({description});
  };

  validateData = () => {
    const {selectedSkill, personalSkill, experience, description} = this.state;
    if (!personalSkill || !experience || !description) return false;
    if (selectedSkill.length == 0) return false;
    return true;
  };

  createCv = async () => {
    if (!this.validateData()) {
      this.showToast('Data is empty');
      return;
    }
    const {selectedSkill, personalSkill, experience, description} = this.state;
    try {
      const skill = selectedSkill.map((e) => e.value);
      const data = {skill, personalSkill, experience, description};
      await this.props.createIterCv(data);
      this.showToast(this.props.msg);
      if (this.props.status != 200 && this.props.state != 304) {
        return;
      }
      this.props.navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  onSelectionsChangesKill = (selectedSkill) => {
    const skills = selectedSkill.map((e) => e.value).join(', ');
    this.setState({selectedSkill, textSkill: skills});
  };

  showSkill = () => {
    return (
      <View style={{height: 300, width: 200}}>
        <SelectMultiple
          items={dataSkill}
          selectedItems={this.state.selectedSkill}
          onSelectionsChange={this.onSelectionsChangesKill}
        />
      </View>
    );
  };

  render() {
    const {modalVisible, textSkill} = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={{flex: 1}}>
            <Loader status={this.props.loading} msg={'Creating '}></Loader>
            <View style={styles.container}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  value={textSkill}
                  style={styles.textInput}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Skill..."></TextInput>
                <TouchableOpacity
                  style={styles.buttonChoice}
                  onPress={this.showModalSkill}>
                  <Text>choice</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.desInput}
                onChangeText={this.onChangePersonalSkill}
                multiline={true}
                numberOfLines={4}
                placeholder="Personal Skill"></TextInput>
              <TextInput
                style={styles.textInput}
                onChangeText={this.onChangeExperience}
                placeholder="Experience"></TextInput>
              <TextInput
                onChangeText={this.onChangeDescription}
                multiline={true}
                numberOfLines={4}
                style={styles.desInput}
                placeholder="Description"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.openButton}
                onPress={this.createCv}>
                <Text style={styles.textStyle}>Create</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  // Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Choice Skill</Text>
                    {this.showSkill()}
                    <View style={styles.containerButton}>
                      <TouchableOpacity
                        style={styles.openButton}
                        onPress={() => {
                          this.setModalVisible(!modalVisible);
                        }}>
                        <Text style={styles.textStyle}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = {
  createIterCv,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.createIterCv;
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Cv);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    display: 'flex',
    height: (windowHeight * 7) / 10,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    width: 250,
    marginBottom: 15,
    paddingLeft: 6,
    marginLeft: 60,
    color: 'black',
    borderRadius: 5,
  },
  desInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 100,
    width: 250,
    marginBottom: 5,
    paddingLeft: 6,
    textAlignVertical: 'top',
    marginLeft: 60,
    borderRadius: 5,
  },
  buttonChoice: {
    marginTop: 5,
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
    marginTop: 15,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 35,
    marginRight: 35,
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
