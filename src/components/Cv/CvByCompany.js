import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Toast} from 'native-base';
import {getData} from '../../utils';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default class CvByCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cv: null,
      status: null,
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
    const cvId = this.props.route.params.cvId;
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      try {
        const token = await getData('token');

        const result = await axios.get(
          `https://job-it-cnpmp.herokuapp.com/api/v1/cv/${cvId}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        const cv = result.data.cv;
        const status = result.data.status;
        this.setState({cv, status});
      } catch (error) {}
    });

    return unsubscribe;
  }

  render() {
    const {status, cv} = this.state;
    if (!cv) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scroll}></ScrollView>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View>
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
                        _.get(cv, 'image') ||
                        'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
                    }}
                  />
                  <View>
                    <Text style={styles.textName}>
                      {_.get(cv, 'name') || ``}
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
                        {_.get(cv, 'email') || ``}
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
                        {_.get(cv, 'birthday') || ``}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Technical skills</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(cv, 'skill').join('\n') || ``}
                  </Text>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Soft skill</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(cv, 'softSkill') || ''}
                  </Text>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Experience</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(cv, 'experience') || ``}
                  </Text>
                </View>
                <View style={styles.viewText}>
                  <Text style={styles.textLabel}>Description</Text>
                  <Text
                    style={{fontFamily: 'TimesNewRoman', fontSize: wp('5')}}>
                    {_.get(cv, 'description')}
                  </Text>
                </View>
              </View>
            </View>
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
}

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

  textLabel: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Sailors Slant',
  },
  textContent: {
    fontSize: 30,
    color: 'green',
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
    padding: 5,
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
