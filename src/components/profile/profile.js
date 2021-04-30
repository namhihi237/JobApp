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
        <ScrollView style={styles.scroll}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.titleList}>PROFILE</Text>
              <TouchableOpacity onPress={async () => await this.handleUpload()}>
                <FontAwesome5
                  name={'save'}
                  style={{fontSize: 30, color: '#356fb7'}}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.cv}>
              <View style={styles.imgContainer}>
                <Avatar
                  containerStyle={{marginLeft: 10, marginTop: 15}}
                  activeOpacity={0.7}
                  rounded
                  size="xlarge"
                  onPress={this.handleChoosePhoto}
                  source={{
                    uri:
                      _.get(photo, 'uri') ||
                      _.get(this.props.user, 'image') ||
                      'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
                  }}
                />
              </View>
              <View style={styles.content}>
                <Text style={styles.textName}>
                  {_.get(this.props.user, 'fullName') || `Le Trung Nam`}
                </Text>
                <Text style={styles.textemail}>
                  {_.get(this.props.user, 'email') || `Trungnam23799@gmail.com`}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scroll: {
    minHeight: windowHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    margin: 5,
    borderRadius: 10,
    padding: 10,
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
    color: 'red',
    marginLeft: 20,
    marginTop: 5,
  },
  cv: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'column',
  },
  imgContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  textemail: {
    fontSize: 20,
    marginLeft: 9,
    marginTop: 5,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#aecce2',
    padding: 10,
    borderRadius: 10,
  },
  titleList: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
  },
});
