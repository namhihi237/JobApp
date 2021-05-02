import React, {Component} from 'react';
import SelectMultiple from 'react-native-select-multiple';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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

import {dataSkill} from '../../constant';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      skill: false,
      selectedSkill: [],
      salary: '',
      address: '',
      endTime: '',
      description: '',
      textSkill: '',
      title: '',
      date: new Date(),
      showDate: false,
    };
  }

  showDatepicker = () => {
    this.setState({showDate: true});
  };

  showToast = (text, type, duration = 2000, buttonText = 'Okey') => {
    Toast.show({
      text,
      buttonText,
      duration,
      type,
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

  onChangeSalary = (salary) => {
    this.setState({salary});
  };

  onChangeTitle = (title) => {
    this.setState({title});
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
      title,
      salary,
      description,
      address,
      endTime,
      selectedSkill,
    } = this.state;
    if (!salary || !description || !address || !endTime || !title) return false;
    if (selectedSkill.length == 0) return false;
    return true;
  };

  createCompanyPost = async () => {
    if (!this.validateData()) {
      this.showToast('Data is empty!', 'warning', 2000, 'Okey');
      return;
    }
    const {
      salary,
      description,
      address,
      endTime,
      selectedSkill,
      title,
    } = this.state;

    try {
      const skill = selectedSkill.map((e) => e.value);
      const data = {
        skill,
        salary,
        address,
        endTime,
        description,
        title,
      };
      await this.props.createPost(data);
      this.showToast(this.props.msg, 'info', 2000, 'Okey');
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

  onChangeDate = (evemt, selectedDate) => {
    const currentDate = selectedDate || this.state.date;

    this.setState({
      date: currentDate,
      endTime: `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`,
      showDate: false,
    });
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
    const {modalVisible, textSkill, date} = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={{flex: 1, paddingTop: 15}}>
            <Loader status={this.props.loading} msg={'Creating '}></Loader>
            <View style={styles.container}>
              <View style={styles.choice}>
                <TextInput
                  style={{...styles.textInputChoice, marginLeft: 20}}
                  onChangeText={this.onChangeTitle}
                  placeholder="Title. . ."></TextInput>
              </View>
              <View style={styles.choice}>
                <FontAwesome5 name={'code'} style={styles.icon} />
                <TextInput
                  value={textSkill}
                  style={styles.textInputChoice}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Skills. . ."></TextInput>
                <TouchableOpacity
                  style={styles.buttonChoice}
                  onPress={this.showModalSkill}>
                  <Text>choice</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containerInput}>
                <FontAwesome5 name={'money-bill'} style={styles.icon} />
                <TextInput
                  style={styles.textInputChoice}
                  onChangeText={this.onChangeSalary}
                  placeholder="Salary. . ."></TextInput>
              </View>
              <View style={styles.containerInput}>
                <FontAwesome5 name={'map-marker-alt'} style={styles.icon} />
                <TextInput
                  style={styles.textInputChoice}
                  onChangeText={this.onChangeAddress}
                  placeholder="Address. . ."></TextInput>
              </View>

              <View style={styles.choice}>
                <FontAwesome5 name={'history'} style={styles.icon} />
                <TextInput
                  value={this.state.endTime}
                  style={styles.textInputChoice}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="End time. . ."></TextInput>
                <TouchableOpacity
                  style={styles.buttonChoice}
                  onPress={this.showDatepicker}>
                  <Text>choice</Text>
                </TouchableOpacity>
              </View>
              {this.state.showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
                  onChange={this.onChangeDate}
                />
              )}
              <TextInput
                onChangeText={this.onChangeDescription}
                multiline={true}
                numberOfLines={4}
                style={styles.desInput}
                placeholder="Description. . ."
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.buttonCreate}
                onPress={this.createCompanyPost}>
                <Text style={styles.textStyle}>Create</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
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
    alignItems: 'center',
  },
  textInput: {
    borderColor: '#3f51b5',
    height: 40,
    borderBottomWidth: 2,
    width: windowWidth * 0.8,
    marginBottom: 15,
    paddingLeft: 6,
    color: 'black',
  },
  textInputChoice: {
    height: 40,
    width: windowWidth * 0.6,
    color: 'black',
    marginLeft: 10,
  },
  desInput: {
    borderColor: '#3f51b5',
    borderWidth: 1,
    height: 100,
    width: windowWidth * 0.8,
    marginBottom: 15,
    paddingLeft: 6,
    textAlignVertical: 'top',
  },
  buttonChoice: {
    height: 30,
    width: 50,
    backgroundColor: '#a7abcc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    marginTop: 5,
    borderColor: '#737796',
    borderWidth: 1,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#d5dee2',
    borderRadius: 20,
    height: 450,
    width: 300,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  openButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 60,
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
    marginBottom: 10,
  },
  choice: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    width: windowWidth * 0.8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#3f51b5',
    marginBottom: 15,
  },
  buttonCreate: {
    backgroundColor: '#a4bfad',
    width: 100,
    padding: 10,
    borderRadius: 6,
    elevation: 2,
    borderColor: '#737796',
    borderWidth: 1,
  },
  icon: {
    marginTop: 12,
    color: '#36e23f',
  },
  containerInput: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 2,
    width: windowWidth * 0.8,
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: '#3f51b5',
    marginBottom: 15,
  },
});
