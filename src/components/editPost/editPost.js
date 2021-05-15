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
import {editWaitingPost} from '../../redux/actions';
import axios from 'axios';
import {getData} from '../../utils';
import {dataSkill} from '../../constant';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class EditPost extends Component {
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
      postId: '',
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

  cancelSkill = (status) => {
    this.setState({
      modalVisible: status,
      selectedSkill: [],
      textSkill: '',
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

  updatePost = async () => {
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
      postId,
    } = this.state;

    try {
      let skill = [];
      if (
        selectedSkill.length > 0 &&
        selectedSkill[0].hasOwnProperty('label')
      ) {
        skill = selectedSkill.map((e) => e.value);
      }
      if (skill.length == 0) {
        skill = selectedSkill;
      }
      const data = {
        skill,
        salary,
        address,
        endTime,
        description,
        title,
      };
      await this.props.editWaitingPost(data, postId);
      this.showToast(this.props.msg, 'success', 2000, 'Okey');
      if (this.props.status != 200) {
        return;
      }
      this.props.navigation.goBack();
    } catch (error) {
      return;
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

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      try {
        const postId = this.props.route.params.postId;
        const token = getData('token');
        const result = await axios.get(
          `https://job-it-cnpmp.herokuapp.com/api/v1/posts/${postId}/detail`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        let {
          title,
          salary,
          address,
          description,
          endTime,
          skill,
          _id,
        } = result.data.post;
        let dateArr = endTime.split('/');
        dateArr.map((e) => parseInt(e));
        let date = new Date(Date.UTC(dateArr[2], dateArr[1] - 1, dateArr[0]));
        this.setState({
          title,
          salary,
          address,
          description,
          endTime,
          date,
          selectedSkill: skill,
          textSkill: skill.join(', '),
          postId: _id,
        });
      } catch (error) {
        return;
      }
    });
    return unsubscribe;
  }
  render() {
    const {
      modalVisible,
      textSkill,
      date,
      title,
      salary,
      address,
      description,
    } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={{flex: 1, paddingTop: 15}}>
            <Loader status={this.props.loading} msg={'Updating'}></Loader>
            <View style={styles.container}>
              <View style={styles.choice}>
                <TextInput
                  style={{...styles.textInputChoice, marginLeft: 20}}
                  onChangeText={this.onChangeTitle}
                  value={title}
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
                  value={salary}
                  placeholder="Salary. . ."></TextInput>
              </View>
              <View style={styles.containerInput}>
                <FontAwesome5 name={'map-marker-alt'} style={styles.icon} />
                <TextInput
                  style={styles.textInputChoice}
                  onChangeText={this.onChangeAddress}
                  value={address}
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
                <TouchableOpacity onPress={this.showDatepicker}>
                  <FontAwesome5
                    name={'calendar-alt'}
                    style={{color: 'black', fontSize: 25}}
                  />
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
                value={description}
              />
              <TouchableOpacity
                style={styles.buttonCreate}
                onPress={this.updatePost}>
                <Text style={styles.textStyle}>Save</Text>
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
                        style={{
                          ...styles.openButton,
                          backgroundColor: '#363B59',
                        }}
                        onPress={() => {
                          this.cancelSkill(!modalVisible);
                        }}>
                        <Text style={styles.textStyle}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          ...styles.openButton,
                          backgroundColor: '#3d84b8',
                        }}
                        onPress={() => {
                          this.setModalVisible(!modalVisible);
                        }}>
                        <Text style={styles.textStyle}>Add</Text>
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
  editWaitingPost,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.editWaitingPost;
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    borderColor: '#3f51b5',
    height: 40,
    borderBottomWidth: 1,
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
    borderRadius: 4,
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
    height: hp('65%'),
    width: wp('80%'),
    padding: 10,
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
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 100,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Itim-Regular',
  },
  containerButton: {
    marginTop: 15,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around',
  },
  modalText: {
    fontSize: 23,
    marginBottom: 10,
    fontFamily: 'Itim-Regular',
  },
  choice: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    width: windowWidth * 0.8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#3f51b5',
    marginBottom: 15,
  },
  buttonCreate: {
    backgroundColor: '#607f22',
    width: 100,
    padding: 10,
    borderRadius: 6,
    elevation: 2,
    borderColor: '#737796',
    borderWidth: 1,
    marginTop: 20,
  },
  icon: {
    marginTop: 12,
    color: '#96cc2c',
  },
  containerInput: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    width: windowWidth * 0.8,
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: '#3f51b5',
    marginBottom: 15,
  },
});
