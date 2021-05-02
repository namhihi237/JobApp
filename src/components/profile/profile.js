import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import _ from 'lodash';
import * as ImagePicker from 'react-native-image-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getData} from '../../utils';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
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
    };
  }

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
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
      const imageUrl = upload.data.url || null;
      if (!imageUrl) {
        this.showToast('Faild');
        return;
      }
      const res = await axios.post(
        'https://job-it-cnpmp.herokuapp.com/api/v1/images',
        {imageUrl},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      this.showToast(res.data.msg);
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

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getProfile();
    });
    return unsubscribe;
  }

  render() {
    const {photo} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.cv}>
          <TouchableOpacity
            onPress={async () => await this.handleUpload()}
            style={{
              flexDirection: 'row-reverse',
              display: 'flex',
            }}>
            <FontAwesome5
              name={'save'}
              style={{
                fontSize: 25,
                color: '#356fb7',
                marginRight: 5,
              }}
            />
          </TouchableOpacity>
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
            <Text style={styles.textName}>
              {_.get(this.props.user, 'fullName') || `Le Trung Nam`}
            </Text>
            <Text style={styles.textemail}>
              {_.get(this.props.user, 'email') || `Trungnam23799@gmail.com`}
            </Text>
          </View>
        </View>
        <View style={styles.info}></View>
      </View>
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
    fontSize: 30,
    color: 'white',
    marginTop: 5,
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
  textemail: {
    fontSize: 20,
    color: 'white',
    marginTop: 5,
    fontFamily: 'TimesNewRoman',
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 2,
    shadowColor: '#dadbe8',
    backgroundColor: '#fff',
    borderRadius: 6,
    marginLeft: (windowWidth * 0.4) / 4,
    marginRight: (windowWidth * 0.4) / 4,
    marginTop: 80,
  },
});
