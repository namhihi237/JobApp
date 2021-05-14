import React, {Component} from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Avatar} from 'react-native-elements';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {getCv} from '../../redux/actions/getCv';
import {Toast} from 'native-base';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
import axios from 'axios';

const windowHeight = Dimensions.get('window').height;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class getOneCv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendEmail: false,
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

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getCv();
      this.setState({sendEmail: this.props.cv.receiveMail});
    });

    return unsubscribe;
  }

  moveToCreateCv = () => {
    this.props.navigation.navigate('CreateCv');
  };

  moveToUpdateCv = () => {
    this.props.navigation.navigate('UpdateCV');
  };

  onOffSendMail = async (isOn) => {
    try {
      if (!this.props.cv) {
        this.showToast('You need create Cv');
        return;
      }
      const token = await getData('token');
      this.setState({sendEmail: isOn});

      await axios.patch(
        `${apiUrl.BASE_URL}/api/v1/iters/receive-mail`,
        {receive: isOn},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
    } catch (error) {}
  };

  render() {
    if (!this.props.cv) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scroll}>
            <View>
              <Text style={styles.titleList}>You have not created a CV</Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={this.moveToCreateCv}>
            <Text style={styles.textAdd}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View>
            <ToggleSwitch
              isOn={this.state.sendEmail}
              onColor="green"
              offColor="red"
              label="Receive email job"
              labelStyle={{color: 'black', fontWeight: '900'}}
              size="small"
              onToggle={(isOn) => this.onOffSendMail(isOn)}
            />
            <View style={styles.cv}>
              <View style={styles.content}>
                <View style={styles.imgContainer}>
                  <Avatar
                    containerStyle={{marginLeft: 10, marginTop: 15}}
                    activeOpacity={0.7}
                    rounded
                    size="large"
                    source={{
                      uri:
                        _.get(this.props.cv, 'image') ||
                        'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
                    }}
                  />
                  <View>
                    <Text style={styles.textName}>
                      {_.get(this.props.cv, 'name') || ``}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: 20,
                      }}>
                      <FontAwesome5
                        name={'envelope'}
                        style={{fontSize: 15, marginTop: 11}}
                      />
                      <Text style={styles.textemail}>
                        {_.get(this.props.cv, 'email') || ``}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: 20,
                      }}>
                      <FontAwesome5
                        name={'birthday-cake'}
                        style={{fontSize: 15, marginTop: 11}}
                      />
                      <Text style={styles.textemail}>
                        {_.get(this.props.cv, 'birthday') || ``}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Technical skills</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(this.props.cv, 'skill').join('\n') || ``}
                  </Text>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Soft skill</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(this.props.cv, 'softSkill') || ''}
                  </Text>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Experience</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(this.props.cv, 'experience') || ``}
                  </Text>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Description</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(this.props.cv, 'description')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={this.moveToUpdateCv}>
          <Text style={styles.textAdd}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getCv,
};

const mapStateToProps = (state) => {
  const {loading, cv, status, msg} = state.getCv;
  return {
    loading,
    cv,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(getOneCv);

const styles = StyleSheet.create({
  scroll: {
    minHeight: windowHeight * 0.86,
    backgroundColor: '#f9f2f2',
  },

  container: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
  },
  tinyLogo: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#b8c2d1',
    width: 200,
    height: 150,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
  },
  line: {
    height: 1,
    backgroundColor: 'black',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 10,
  },
  titleList: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Sarpanch-SemiBold',
  },
  buttonAdd: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: '#907fa4',
    borderRadius: 100,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },
  textAdd: {
    fontSize: 30,
    fontWeight: '900',
  },
  textLabel: {
    fontSize: 20,
    marginBottom: 5,
    fontFamily: 'Sailors Slant',
  },

  textName: {
    fontSize: wp('6%'),
    marginLeft: 20,
    marginTop: 5,
    fontFamily: 'Sarpanch-ExtraBold',
  },
  cv: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'column',
  },
  imgContainer: {
    backgroundColor: 'rgba(249, 247, 247 , 0.8)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.54,
    display: 'flex',
    flexDirection: 'row',
    borderBottomRightRadius: 80,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 15,
    paddingBottom: 5,
  },
  content: {
    marginTop: 5,
    padding: 8,
  },
  textemail: {
    fontSize: wp('4.8%'),
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'TimesNewRoman',
  },
  viewText: {
    backgroundColor: '#f7f4f4',
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
});
