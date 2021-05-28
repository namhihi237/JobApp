import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';
import {getData} from '../../utils';
import SelectMultiple from 'react-native-select-multiple';
import {updateCv} from '../../redux/actions';
import {Toast} from 'native-base';
import _ from 'lodash';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header, Left, Body, Button, Icon, Title, Right} from 'native-base';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import FormData from 'form-data';
import axios from 'axios';

import {dataSkill} from '../../constant';

class UpdateCv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skill: false,
      selectedSkill: [],
      textSkill: '',
      softSkill: '',
      experience: '',
      description: '',
      modalVisible: false,
      photo: null,
      showDate: false,
      birthday: '',
      date: new Date(),
      modalVisible: false,
      image: '',
      name: '',
      email: '',
    };
  }

  setModalVisible = (status) => {
    this.setState({
      modalVisible: status,
    });
  };

  showModalSkill = () => {
    this.setState({modalVisible: true, skill: true});
  };

  showDatepicker = () => {
    this.setState({showDate: true});
  };

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({photo: response});
      }
    });
  };

  showToast = (msg, type) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
      type,
    });
  };

  onChangesoftSkill = (softSkill) => {
    this.setState({softSkill});
  };

  onChangeExperience = (experience) => {
    this.setState({experience});
  };

  onChangeDescription = (description) => {
    this.setState({description});
  };

  onChangeBirthday = (birthday) => {
    this.setState({birthday});
  };

  validateData = () => {
    const {textSkill, softSkill, experience, description} = this.state;
    if (!textSkill || !softSkill || !experience || !description) return false;
    return true;
  };

  updateNewCv = async () => {
    if (!this.validateData()) {
      this.showToast('Data is empty');
      return;
    }
    const {
      softSkill,
      experience,
      description,
      birthday,
      selectedSkill,
      photo,
      image,
      name,
    } = this.state;

    try {
      this.props.navigation.goBack();

      let newImage = image;
      if (photo) {
        newImage = await this.handleUpload();
      }
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
        softSkill,
        experience,
        description,
        image: newImage,
        birthday,
        name,
      };
      await this.props.updateCv(data);
      const {status, msg} = this.props;
      if (status == 200 || status == 304) {
        this.showToast(msg, 'success');
        return;
      }
      this.showToast(msg, 'warning');
    } catch (error) {}
  };

  onChangesKill = (textSkill) => {
    this.setState({textSkill});
  };

  createFormData = (photo) => {
    const data = new FormData();

    data.append('file', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });
    return data;
  };

  onChangeDate = (evemt, selectedDate) => {
    const currentDate = selectedDate || this.state.date;

    this.setState({
      date: currentDate,
      birthday: `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`,
      showDate: false,
    });
  };

  onSelectionsChangesKill = (selectedSkill) => {
    const skills = selectedSkill.map((e) => e.value).join(', ');
    this.setState({selectedSkill, textSkill: skills});
  };

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      const {
        softSkill,
        skill,
        image,
        email,
        name,
        birthday,
        description,
        experience,
      } = this.props.cv;
      let dateArr = birthday.split('/');
      dateArr.map((e) => parseInt(e));
      let date = new Date(Date.UTC(dateArr[2], dateArr[1] - 1, dateArr[0]));
      this.setState({
        softSkill,
        description,
        experience,
        textSkill: skill.join(', '),
        birthday,
        date,
        image,
        name,
        selectedSkill: skill,
        email,
      });
    });

    return unsubscribe;
  }
  showSkill = () => {
    return (
      <View
        style={{
          height: hp('50%'),
          width: wp('60%'),
          padding: 20,
          borderRadius: 10,
        }}>
        <SelectMultiple
          items={dataSkill}
          selectedItems={this.state.selectedSkill}
          onSelectionsChange={this.onSelectionsChangesKill}
        />
      </View>
    );
  };
  handleUpload = async () => {
    try {
      const token = await getData('token');
      const result = await axios.get(
        `https://job-it-cnpmp.herokuapp.com/api/v1/images`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      const {signature, timestamp} = _.get(result, 'data.payload');
      // upload
      const upload = await axios.post(
        `https://api.cloudinary.com/v1_1/do-an-cnpm/image/upload?api_key=484176915684615&timestamp=${timestamp}&signature=${signature}`,
        this.createFormData(this.state.photo),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return upload.data.url || null;
    } catch (error) {
      return null;
    }
  };

  render() {
    const {
      photo,
      date,
      birthday,
      showDate,
      textSkill,
      modalVisible,
      softSkill,
      experience,
      description,
      image,
      name,
      email,
    } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={{flex: 1}}>
            {/* <Loader status={this.props.loading} msg={'Updating'}></Loader> */}
            <Header>
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.goBack()}>
                  <Icon name="arrow-back" />
                </Button>
              </Left>
              <Body>
                <Title style={{fontFamily: 'Itim-Regular'}}>Update CV</Title>
              </Body>
              <Right>
                <Button transparent>
                  <Icon name="menu" />
                </Button>
              </Right>
            </Header>
            <View style={styles.container}>
              <Image
                source={{
                  uri: photo
                    ? photo.uri
                    : image != ''
                    ? image
                    : 'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                onPress={this.handleChoosePhoto}
                style={styles.buttonAvatar}>
                <Text style={{fontFamily: 'Itim-Regular', fontSize: 15}}>
                  Choose Avatar
                </Text>
              </TouchableOpacity>
              <View style={styles.choice}>
                <TextInput
                  style={styles.textInputChoice}
                  value={name}
                  placeholder="Name..."></TextInput>
              </View>
              <View style={styles.choice}>
                <TextInput
                  style={styles.textInputChoice}
                  value={email}
                  placeholder="Email..."></TextInput>
              </View>
              <View style={styles.choice}>
                <TextInput
                  value={birthday}
                  style={styles.textName}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Birthday. . ."></TextInput>
                <TouchableOpacity onPress={this.showDatepicker}>
                  <FontAwesome5
                    name={'calendar-alt'}
                    style={styles.iconCalendar}
                  />
                </TouchableOpacity>
              </View>
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
                  onChange={this.onChangeDate}
                />
              )}
              <View style={styles.choice}>
                <TextInput
                  style={styles.textInputChoice}
                  value={textSkill}
                  editable={false}
                  onChangeText={this.onChangesKill}
                  placeholder="Skill..."></TextInput>
                <TouchableOpacity onPress={this.showModalSkill}>
                  <FontAwesome5 name={'cogs'} style={styles.iconCalendar} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.desInput}
                onChangeText={this.onChangesoftSkill}
                multiline={true}
                numberOfLines={4}
                value={softSkill}
                placeholder="Soft Skill"></TextInput>
              <TextInput
                style={styles.desInput}
                onChangeText={this.onChangeExperience}
                multiline={true}
                numberOfLines={4}
                value={experience}
                placeholder="Experience"></TextInput>
              <TextInput
                onChangeText={this.onChangeDescription}
                multiline={true}
                numberOfLines={4}
                value={description}
                style={styles.desInput}
                placeholder="Description"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.buttonCreate}
                onPress={this.updateNewCv}>
                <Text style={styles.textStyle}>Update</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Choose Skill</Text>
                    {this.showSkill()}
                    <View style={styles.containerButton}>
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
  updateCv,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.updateCv;
  const {cv} = state.getCv;
  return {
    loading,
    status,
    msg,
    cv,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdateCv);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#d5dee2',
    borderRadius: 20,
    height: hp('70%'),
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
    paddingBottom: 8,
  },
  openButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 100,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
    backgroundColor: '#3d84b8',
    marginBottom: 15,
  },
  buttonCreate: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: wp('30%'),
    marginLeft: wp('35%'),
    marginRight: 35,
    marginTop: 15,
    backgroundColor: '#adb0ce',
    borderWidth: 1,
    borderColor: '#6b6f9b',
  },
  modalText: {
    fontSize: 23,
    marginBottom: 10,
    fontFamily: 'Itim-Regular',
  },
  container: {
    justifyContent: 'center',
    flex: 1,
    display: 'flex',
    minHeight: (windowHeight * 9) / 10,
    paddingBottom: 20,
    paddingTop: 10,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    width: wp('80%'),
    marginBottom: 15,
    paddingLeft: 6,
    marginLeft: wp('10%'),
    color: 'black',
    borderRadius: 5,
  },
  desInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 100,
    width: wp('80%'),
    marginBottom: 5,
    paddingLeft: 6,
    textAlignVertical: 'top',
    marginLeft: wp('10%'),
    borderRadius: 5,
    fontFamily: 'TimesNewRoman',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Itim-Regular',
  },
  containerButton: {
    flexDirection: 'row',
  },
  choice: {
    flexDirection: 'row',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#3f51b5',
    marginBottom: 15,
    width: wp('80%'),
    marginLeft: wp('10%'),
  },
  iconCalendar: {
    color: 'black',
    fontSize: 25,
    marginTop: 10,
    marginRight: 5,
  },
  buttonAvatar: {
    height: 40,
    width: wp('28%'),
    marginLeft: wp('36%'),
    backgroundColor: '#8ccca1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderColor: '#51725c',
    borderWidth: 1,
    marginBottom: 10,
  },
  avatar: {
    width: wp('26%'),
    height: 100,
    borderWidth: 1,
    marginBottom: 5,
    borderColor: '#bfa8a8',
    marginLeft: wp('37%'),
  },
  textName: {},
  textInputChoice: {
    height: 40,
    width: windowWidth * 0.6,
    color: 'black',
    marginLeft: 10,
  },
});
