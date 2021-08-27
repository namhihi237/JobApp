import React, {Component} from 'react';
import {Header} from '../../common';
import {connect} from 'react-redux';
import {getData} from '../../utils';
import SelectMultiple from 'react-native-select-multiple';
import {updateCv} from '../../redux/actions';
import {Toast} from 'native-base';
import _ from 'lodash';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
const windowWidth = Dimensions.get('window').width;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Input, Textarea} from './components';
import FastImage from 'react-native-fast-image';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
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
        this.props.navigation.goBack();
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

  onChangeDate = (event, selectedDate) => {
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
      return upload.data.secure_url || null;
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
      <View style={{paddingBottom: hp('5%')}}>
        <Header
          title={'     Update CV'}
          left={true}
          hideRight={false}
          color="#0E1442"
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Image
                style={styles.avatar}
                source={{
                  uri: photo
                    ? photo.uri
                    : image != ''
                    ? image
                    : 'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
                }}
              />
              <TouchableOpacity
                onPress={this.handleChoosePhoto}
                style={styles.buttonAvatar}>
                <Text style={{fontFamily: 'Itim-Regular', fontSize: 15}}>
                  Choose Avatar
                </Text>
              </TouchableOpacity>
              <Input value={name}></Input>
              <Input value={email}></Input>
              <Input
                value={birthday}
                editable={false}
                selectTextOnFocus={false}
                placeholder="Birthday. . ."
                iconName={'calendar-alt'}
                onPress={this.showDatepicker}></Input>
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
                  onChange={this.onChangeDate}
                  maximumDate={new Date()}
                />
              )}
              <Input
                value={textSkill}
                editable={false}
                onChangeText={this.onChangesKill}
                placeholder="Skill..."
                iconName={'cogs'}
                onPress={this.showModalSkill}></Input>
              <Textarea
                onChangeText={this.onChangesoftSkill}
                numberOfLines={4}
                value={softSkill}
                placeholder="Soft Skill"></Textarea>
              <Textarea
                onChangeText={this.onChangeExperience}
                numberOfLines={4}
                value={experience}
                placeholder="Experience"></Textarea>
              <Textarea
                onChangeText={this.onChangeDescription}
                numberOfLines={4}
                value={description}
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
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const mapDispatchToProps = {
  updateCv,
};

const mapStateToProps = (state) => {
  const {status, msg} = state.updateCv;
  const {cv} = state.getCv;
  return {
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
    width: wp('40%'),
    marginLeft: wp('20%'),
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
    paddingBottom: 20,
    paddingTop: 10,
    paddingLeft: wp('10%'),
    paddingRight: wp('10%'),
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
  buttonAvatar: {
    height: 40,
    width: wp('28%'),
    marginLeft: wp('26%'),
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
    borderColor: '#bfa8a8',
    marginLeft: wp('27%'),
  },
  textInputChoice: {
    height: 40,
    width: windowWidth * 0.6,
    color: 'black',
    marginLeft: 10,
  },
});
