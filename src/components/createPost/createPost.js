import React, {Component} from 'react';
import SelectMultiple from 'react-native-select-multiple';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Toast} from 'native-base';
import {connect} from 'react-redux';
import {createPost} from '../../redux/actions';
import {dataPosition, dataSkill} from '../../constant';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      skill: false,
      selectedSkill: [],
      selectedPos: [],
      salary: '',
      address: '',
      endTime: '',
      description: '',
      textSkill: '',
      textPos: '',
    };
  }

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  setModalVisible = (status) => {
    this.setState({
      modalVisible: status,
    });
  };

  showModalSkill = () => {
    this.setState({modalVisible: true, skill: true});
  };

  showModalPosition = () => {
    this.setState({modalVisible: true, skill: false});
  };

  onChangeSalary = (salary) => {
    this.setState({salary});
  };

  onChangeAddress = (address) => {
    this.setState({address});
  };

  onChangeEndTime = (endTime) => {
    this.setState({endTime});
  };

  onChangeDescription = (description) => {
    this.setState({description});
  };

  validateData = () => {
    const {
      salary,
      description,
      address,
      endTime,
      selectedSkill,
      selectedPos,
    } = this.state;
    if (!salary || !description || !address || !endTime) return false;
    if (selectedSkill.length == 0 || selectedPos.length == 0) return false;
    return true;
  };

  createCompanyPost = async () => {
    if (!this.validateData()) {
      this.showToast('Data is empty!');
      return;
    }
    const {
      salary,
      description,
      address,
      endTime,
      selectedSkill,
      selectedPos,
    } = this.state;

    try {
      const skill = selectedSkill.map((e) => e.value);
      const position = selectedPos.map((e) => e.value);
      const data = {skill, position, salary, address, endTime, description};
      console.log(data);
      await this.props.createPost(data);
      this.showToast(this.props.msg);
      if (this.props.status != 200) {
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

  onSelectionsChangePos = (selectedPos) => {
    const pos = selectedPos.map((e) => e.value).join(' ,');
    this.setState({selectedPos, textPos: pos});
  };

  showSkill = () => {
    if (!this.state.skill)
      return (
        <View style={{height: 300, width: 200}}>
          <SelectMultiple
            items={dataPosition}
            selectedItems={this.state.selectedPos}
            onSelectionsChange={this.onSelectionsChangePos}
          />
        </View>
      );
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
    const {modalVisible, textSkill, textPos} = this.state;
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
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  value={textPos}
                  style={styles.textInput}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Position..."></TextInput>
                <TouchableOpacity
                  style={styles.buttonChoice}
                  onPress={this.showModalPosition}>
                  <Text>choice</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                onChangeText={this.onChangeSalary}
                placeholder="Salary..."></TextInput>
              <TextInput
                style={styles.textInput}
                onChangeText={this.onChangeAddress}
                placeholder="Address..."></TextInput>
              <TextInput
                style={styles.textInput}
                onChangeText={this.onChangeEndTime}
                placeholder="End Time..."></TextInput>
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
                onPress={this.createCompanyPost}>
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
  createPost,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.createPost;
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
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
    width: 260,
    marginBottom: 15,
    paddingLeft: 6,
    marginLeft: 50,
    color: 'black',
    borderRadius: 5,
  },
  desInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 100,
    width: 260,
    marginBottom: 15,
    paddingLeft: 6,
    textAlignVertical: 'top',
    marginLeft: 50,
    borderRadius: 5,
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
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
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
