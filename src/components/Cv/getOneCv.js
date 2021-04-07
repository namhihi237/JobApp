import React, {Component} from 'react';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {getCv} from '../../redux/actions/getCv';
import {getData} from '../../utils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class getOneCv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCv: [],
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getCv();
      this.showToast(this.props.msg);
      //console.log(this.props)
      this.setState({
        dataCv: this.props.cv,
      });
      //console.log(this.state);
    });

    return unsubscribe;
  }

  moveToCreateCv = () => {
    this.props.navigation.navigate('CreateCv');
  };

  render() {
    const {dataCv} = this.state;
    //console.log(dataCv)
    if (this.props.status != 200 && this.props.status != 304) {
      return (
        <View>
          <Text>No data</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <Loader status={this.props.loading}></Loader>
          <View>
            <Text style={styles.titleList}>My CV</Text>
            <View style={styles.cv}>
              <View style={styles.imgContainer}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../../assets/image/person.png')}
                />

                <View>
                  <Text style={styles.textName}>
                    {dataCv.iterName || `Le Trung Nam`}
                  </Text>
                  <Text style={styles.textemail}>
                    Email: {dataCv.email || `Trungnam23799@gmail.com`}
                  </Text>
                  <Text style={styles.textemail}>
                    Brithday: {dataCv.birthday || `23/07/1999`}
                  </Text>
                </View>
              </View>
              <View style={styles.content}>
                <Text style={styles.textLabel}>
                  Personal Skill: {dataCv.personalSkill || 'Toeic 900+'}
                </Text>
                <Text style={styles.textLabel}>
                  Skill:{' '}
                  {dataCv.skill ||
                    `
                  - C++, Java
                  - Git, GitHub
                  `}
                </Text>
                <Text style={styles.textLabel}>
                  Experience:{' '}
                  {dataCv.experience ||
                    `
                  - 2020 - 2021 : Madison
                  - 2021 -2022 : FPT`}
                </Text>
                <Text style={styles.textLabel}>
                  Description: {dataCv.description}
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
const mapDispatchToProps = {
  getCv,
};

const mapStateToProps = (state) => {
  //console.log(state.getCv)
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
    marginTop: 15,
  },
  cv: {
    display: 'flex',
    marginTop: 20,
    // marginLeft: 20,
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
    // backgroundColor: 'blue',
    marginTop: 5,
    padding: 5,
  },
  textemail: {
    fontSize: 15,
    marginLeft: 9,
    marginTop: 5,
  },
});
