import React, {Component} from 'react';
import _ from 'lodash';
import * as ImagePicker from 'react-native-image-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getData} from '../../utils';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {getProfile} from '../../redux/actions';
import {Toast} from 'native-base';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: '',
      role: '',
      phone: '',
      address: '',
      birthday: '',
      fullName: '',
      companyName: '',
    };
  }

  showToast = (msg, type) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
      type,
    });
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
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

  handleUpload = async () => {
    try {
      const token = await getData('token');
      const role = await getData('role');
      const {
        phone,
        photo,
        address,
        birthday,
        fullName,
        companyName,
      } = this.state;
      let imageUrl;
      if (photo == '') {
        imageUrl = '';
      } else {
        const result = await axios.get(
          `https://job-it-cnpmp.herokuapp.com/api/v1/images`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        const {signature, timestamp} = _.get(result, 'data.payload');
        const upload = await axios.post(
          `https://api.cloudinary.com/v1_1/do-an-cnpm/image/upload?api_key=484176915684615&timestamp=${timestamp}&signature=${signature}`,
          this.createFormData(this.state.photo),
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        imageUrl = upload.data.url || null;
        if (!imageUrl) {
          this.showToast('Faild');
          return;
        }
      }
      let data = {};
      if (address != '') data = {...data, address};
      if (phone != '') data = {...data, phone};
      if (imageUrl) data = {...data, address, image: imageUrl};
      let url = '';
      if (role == 'company')
        url = 'https://job-it-cnpmp.herokuapp.com/api/v1/companies/profile';
      if (role == 'iter')
        url = 'https://job-it-cnpmp.herokuapp.com/api/v1/iters/profile';
      const res = await axios.post(url, data, {
        headers: {Authorization: `Bearer ${token}`},
      });
      this.showToast(res.data.msg, 'success');
      await this.props.getProfile();
    } catch (error) {
      return null;
    }
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

  onChangeAddress = (address) => {
    this.setState({address});
  };

  onChangePhone = (phone) => {
    this.setState({phone});
  };

  infoCompany = () => {
    const {phone, address, birthday} = this.state;
    if (this.state.role == 'iter')
      return (
        <View>
          <Text style={styles.textLabelContent}>Email</Text>
          <Text style={styles.textContent}>
            {_.get(this.props.user, 'email') || ''}
          </Text>
          <Text style={styles.textLabelContent}>Date Of Birth</Text>
          <Text style={styles.textContent}>{birthday}</Text>
          <View style={styles.line}></View>
          <Text style={styles.textLabelContent}>Phone</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputContent}
              value={phone}
              onChangeText={this.onChangePhone}></TextInput>
            <TouchableOpacity>
              <FontAwesome5 name={'edit'} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
          <Text style={styles.textLabelContent}>Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputContent}
              value={address}
              onChangeText={this.onChangeAddress}></TextInput>
            <TouchableOpacity>
              <FontAwesome5 name={'edit'} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
        </View>
      );
    else if (this.state.role == 'company')
      return (
        <View>
          <Text style={styles.textLabelContent}>Email</Text>
          <Text style={styles.textContent}>
            {_.get(this.props.user, 'email') || ''}
          </Text>
          <View style={styles.line}></View>
          <Text style={styles.textLabelContent}>Phone</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputContent}
              value={phone}
              onChangeText={this.onChangePhone}></TextInput>
            <TouchableOpacity>
              <FontAwesome5 name={'edit'} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
          <Text style={styles.textLabelContent}>Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputContent}
              value={address}
              onChangeText={this.onChangeAddress}></TextInput>
            <TouchableOpacity>
              <FontAwesome5 name={'edit'} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
        </View>
      );
  };
  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getProfile();
      let role = await getData('role');
      let phone = _.get(this.props.user, 'phone') || '';
      let address = _.get(this.props.user, 'address') || '';
      let birthday = _.get(this.props.user, 'birthday') || '';
      let name =
        _.get(this.props.user, 'fullName') ||
        _.get(this.props.user, 'companyName') ||
        '';

      this.setState({role, phone, address, birthday, name});
    });
    return unsubscribe;
  }

  render() {
    const {photo, name} = this.state;
    return (
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.cv}>
            <TouchableOpacity
              onPress={this.handleChoosePhoto}
              style={styles.containerImg}>
              <Image
                style={{
                  height: 150,
                  width: 100,
                  borderRadius: 15,
                }}
                source={{
                  uri:
                    _.get(photo, 'uri') ||
                    _.get(this.props.user, 'image') ||
                    'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
                }}
              />
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={styles.textName}>{name || ``}</Text>
            </View>
          </View>
          <View style={styles.info}>
            <View>
              <Text style={{fontFamily: 'Sarpanch-Black', fontSize: 20}}>
                General
              </Text>
              {this.infoCompany()}
            </View>
            <TouchableOpacity
              onPress={async () => await this.handleUpload()}
              style={{
                flexDirection: 'row-reverse',
                display: 'flex',
                marginRight: 50,
                marginBottom: 25,
              }}>
              <FontAwesome5
                name={'save'}
                style={{
                  fontSize: 25,
                  color: '#356fb7',
                  marginRight: 5,
                  marginRight: 40,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const mapDispatchToProps = {
  getProfile,
};

const mapStateToProps = (state) => {
  const {loading, user, status, msg} = state.getProfile;
  return {
    loading,
    user,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e5ef',
    height: windowHeight * 0.96,
  },
  tinyLogo: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50,
  },
  textLabel: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
  },
  textName: {
    fontSize: 20,
    color: 'white',
    marginTop: 35,
    fontFamily: 'Sailors Slant',
  },
  cv: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0E1442',
    height: 170,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  imgContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    marginLeft: 150,
    marginTop: 50,
    padding: 10,
  },

  containerImg: {
    top: 60,
    height: 150,
    width: 100,
    position: 'absolute',
    marginLeft: 40,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 2,
    shadowColor: '#dadbe8',
  },
  info: {
    height: (windowHeight * 1.1) / 2,
    width: (windowWidth * 3.2) / 4,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 2,
    shadowColor: '#dadbe8',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginLeft: (windowWidth * 0.4) / 4,
    marginRight: (windowWidth * 0.4) / 4,
    marginTop: 80,
    paddingTop: 20,
    paddingLeft: 15,
    display: 'flex',
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    backgroundColor: '#ad9f9f',
    width: (windowWidth * 2.9) / 4,
  },
  textContent: {
    fontFamily: 'TimesNewRoman',
    fontSize: 17,
    color: '#827676',
    marginBottom: 6,
  },
  textLabelContent: {
    fontFamily: 'TimesNewRoman',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 5,
  },
  inputContent: {
    height: 40,
    padding: 2,
    width: (windowWidth * 2.5) / 4,
    color: '#827676',
  },
  icon: {
    fontSize: 15,
    marginTop: 9,
    color: '#356fb7',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 14,
  },
});
