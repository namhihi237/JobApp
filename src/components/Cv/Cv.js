import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';

import {createIterCv} from '../../redux/actions';
import {Toast} from 'native-base';
import {getData} from '../../utils';
import _ from 'lodash';
import * as ImagePicker from 'react-native-image-picker';
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
  Button,
  Image,
} from 'react-native';
import FormData from 'form-data';
import axios from 'axios';
const windowHeight = Dimensions.get('window').height;

class Cv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skill: '',
      softSkill: '',
      experience: '',
      description: '',
      modalVisible: false,
      photo: null,
    };
  }

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

  validateData = () => {
    const {skill, softSkill, experience, description} = this.state;
    if (!skill || !softSkill || !experience || !description) return false;
    return true;
  };

  createCv = async () => {
    if (!this.validateData()) {
      this.showToast('Data is empty');
      return;
    }
    const {skill, softSkill, experience, description} = this.state;

    try {
      const image = await this.handleUpload();
      const data = {
        skill,
        softSkill,
        experience,
        description,
        image,
        birthday: '23/07/1999',
      };
      await this.props.createIterCv(data);
      this.showToast(this.props.msg);
      if (this.props.status != 200 && this.props.state != 304) {
        return;
      }
      this.props.navigation.goBack();
    } catch (error) {}
  };

  onChangesKill = (skill) => {
    this.setState({skill});
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
    const {photo} = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={{flex: 1}}>
            <Loader status={this.props.loading} msg={'Creating '}></Loader>
            <View style={styles.container}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {photo && (
                  <React.Fragment>
                    <Image
                      source={{uri: photo.uri}}
                      style={{width: 100, height: 100}}
                    />
                  </React.Fragment>
                )}
                <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
              </View>

              <View>
                <TextInput
                  style={styles.desInput}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={this.onChangesKill}
                  placeholder="Skill..."></TextInput>
              </View>
              <TextInput
                style={styles.desInput}
                onChangeText={this.onChangesoftSkill}
                multiline={true}
                numberOfLines={4}
                placeholder="Soft Skill"></TextInput>
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
    height: (windowHeight * 8) / 10,
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
