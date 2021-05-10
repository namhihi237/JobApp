import React, {Component} from 'react';
import {Avatar} from 'react-native-elements';
import _ from 'lodash';
import {StyleSheet, View, Text, Dimensions, ScrollView} from 'react-native';
import {Toast} from 'native-base';
import {getData} from '../../utils';
import axios from 'axios';

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
      } catch (error) {}
    });

    return unsubscribe;
  }

  render() {
    const {status, cv} = this.state;
    if (status != 200 && status != 304) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scroll}></ScrollView>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <View>
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
                    {_.get(cv, 'name') || `Le Trung Nam`}
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
                  Skill:{`\n`}
                  {_.get(cv, 'skill') ||
                    `
                  - C++, Java
                  - Git, GitHub
                  `}
                </Text>
                <Text style={styles.textLabel}>
                  Soft skill:{`\n`}
                  {_.get(cv, 'softSkill') || 'Toeic 900+'}
                </Text>

                <Text style={styles.textLabel}>
                  Experience:{`\n`}
                  {_.get(cv, 'experience') ||
                    `
                  - 2020 - 2021 : Madison
                  - 2021 -2022 : FPT`}
                </Text>
                <Text style={styles.textLabel}>
                  Description:{`\n`} {_.get(cv, 'description')}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: '#c7c8d6',
    margin: 5,
    borderRadius: 10,
    padding: 10,
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
    fontSize: 30,
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
    backgroundColor: 'rgba(113, 115, 127,0.9)',
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
    padding: 5,
  },
  content: {
    marginTop: 5,
    padding: 5,
  },
  textemail: {
    fontSize: 16,
    marginLeft: 9,
    marginTop: 5,
    fontFamily: 'TimesNewRoman',
  },
});
