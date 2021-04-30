import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import axios from 'axios';
import _ from 'lodash';
import {getData} from '../../utils';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Toast} from 'native-base';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
      } catch (error) {
        // console.log(_.get(error.response, 'data.msg'));
        // console.log(error);
      }
    });

    return unsubscribe;
  }

  render() {
    const {status, cv} = this.state;
    if (status != 200 && status != 304) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scroll}>
            <View>
              <Text style={styles.titleList}>CV</Text>
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
        <ScrollView style={styles.scroll}>
          {/* <Loader status={this.props.loading}></Loader> */}
          <View>
            <Text style={styles.titleList}>My CV</Text>
            <View style={styles.cv}>
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
                    {_.get(cv, 'iterName') || `Le Trung Nam`}
                  </Text>
                  <Text style={styles.textemail}>
                    Email: {_.get(cv, 'email') || `Trungnam23799@gmail.com`}
                  </Text>
                  <Text style={styles.textemail}>
                    Brithday: {_.get(cv, 'birthday') || `23/07/1999`}
                  </Text>
                </View>
              </View>
              <View style={styles.content}>
                <Text style={styles.textLabel}>
                  Soft skill: {_.get(cv, 'softSkill') || 'Toeic 900+'}
                </Text>
                <Text style={styles.textLabel}>
                  Skill:{' '}
                  {(_.get(cv, 'skill') || []).join(', ') ||
                    `
                  - C++, Java
                  - Git, GitHub
                  `}
                </Text>
                <Text style={styles.textLabel}>
                  Experience:{' '}
                  {_.get(cv, 'experience') ||
                    `
                  - 2020 - 2021 : Madison
                  - 2021 -2022 : FPT`}
                </Text>
                <Text style={styles.textLabel}>
                  Description: {_.get(cv, 'description')}
                </Text>
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
    minHeight: windowHeight,
  },

  container: {
    flex: 1,
    backgroundColor: '#45fad3',
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
    backgroundColor: '#ee6e73',
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
    marginBottom: 10,
    color: 'red',
  },
  textContent: {
    fontSize: 30,
    color: 'green',
  },
  textName: {
    fontSize: 30,
    color: 'green',
    marginLeft: 20,
    marginTop: 5,
  },
  cv: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'column',
  },
  imgContainer: {
    backgroundColor: '#8bdb85',
    display: 'flex',
    flexDirection: 'row',
    borderBottomRightRadius: 80,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 5,
  },
  content: {
    marginTop: 5,
    padding: 5,
  },
  textemail: {
    fontSize: 15,
    marginLeft: 9,
    marginTop: 5,
  },
});
