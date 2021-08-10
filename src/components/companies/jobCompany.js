import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Loader} from '../../common';
import {JobDetail} from './detail';
import {getJobCompany, applyJob} from '../../redux/actions';
import {getData} from '../../utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header, Left, Body, Button, Icon, Title} from 'native-base';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
class JobCompanies extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      item: null,
      role: '',
      posts: [],
      userId: '',
      isFetching: false,
    };
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    await this.props.getJobCompany(this.props.route.params.companyId);
    this.setState({isFetching: false});
  };

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  renderApply = (listApply) => {
    for (let applier of listApply) {
      if (applier.iterId === this.state.userId)
        return (
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <FontAwesome5
              name={'check-circle'}
              style={{fontSize: 15, marginTop: 2, color: 'green'}}
            />
            <Text
              style={{
                fontFamily: 'TimesNewRoman',
                marginLeft: 2,
                color: '#996f6f',
              }}>
              Applied
            </Text>
          </View>
        );
    }
  };

  renderItem = ({item}) => (
    <View style={styles.item}>
      <View style={{padding: 1, marginLeft: 10, maxWidth: wp('60%')}}>
        <Text
          style={{...styles.text, fontSize: hp('2.5%')}}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.title}
        </Text>
        <View style={styles.fiedlsText}>
          <FontAwesome5 name={'money-bill'} style={styles.iconText} />
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {item.salary}
          </Text>
        </View>
        <View style={styles.fiedlsText}>
          <FontAwesome5 name={'code'} style={styles.iconText} />
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {item.skill.join(', ')}
          </Text>
        </View>
        <View style={styles.fiedlsText}>
          <FontAwesome5 name={'map-marker-alt'} style={styles.iconText} />
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {item.address}
          </Text>
        </View>
        <View style={styles.seeMore}>
          <TouchableOpacity onPress={() => this.showDetail(item)} style={{}}>
            <Text style={{color: 'green'}}>See more</Text>
          </TouchableOpacity>
          {this.renderApply(item.apply)}
          <View style={styles.fiedlsText}>
            <FontAwesome5
              name={'history'}
              style={{...styles.iconText, color: 'red'}}
            />
            <Text style={{marginLeft: 10}}>{item.endTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  componentDidMount() {
    this._isMounted = true;
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getJobCompany(this.props.route.params.companyId);
      const role = await getData('role');
      const userId = await getData('userId');
      this.setState({role, userId});
    });

    return unsubscribe;
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  showDetail = (item) => {
    this.setModalVisible(true);
    this.setState({item});
  };

  iterApplyJob = async () => {
    if (!this.state.role) {
      Alert.alert('You must be login to apply!', `Pick your option `, [
        {
          text: 'Later',
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => {
            this.props.navigation.navigate('Login');
            this.setModalVisible(!this.state.modalVisible);
          },
        },
      ]);
      return;
    }
    await this.props.applyJob(this.state.item._id);
    this.showToast(this.props.msgApply);
  };

  renderButtonApply = () => {
    if (this.state.role == 'iter' || !this.state.role) {
      return (
        <TouchableHighlight
          style={{...styles.openButton, backgroundColor: '#37ce3f'}}
          onPress={this.iterApplyJob}>
          <Text style={styles.textStyle}>Apply</Text>
        </TouchableHighlight>
      );
    }
    return null;
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {modalVisible, item} = this.state;

    if (this.props.status != 200 && this.props.status != 304) {
      return (
        <View>
          <Loader status={this.props.loading}></Loader>
        </View>
      );
    }
    return (
      <View>
        <Loader status={this.props.loading}></Loader>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{}</Title>
          </Body>
        </Header>
        <View style={styles.container}>
          <FlatList
            style={styles.flatlist}
            scrollEventThrottle={16}
            data={this.props.posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            onEndReached={this.handleLoadMore}></FlatList>
        </View>
        <View style={styles.centeredView}>
          <Modal
            style={styles.search}
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 30, fontFamily: 'Sailors Slant'}}>
                  Job Detail
                </Text>
                <JobDetail item={item}></JobDetail>
                <View style={styles.containerButton}>
                  <TouchableHighlight
                    style={{...styles.openButton, backgroundColor: '#d14545'}}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableHighlight>
                  {this.renderButtonApply()}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getJobCompany,
  applyJob,
};

const mapStateToProps = (state) => {
  const {loading, status, msg, posts} = state.getJobCompany;

  return {
    loading,
    posts,
    status,
    msg,
    statusApply: state.applyJob.status,
    msgApply: state.applyJob.msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobCompanies);

const styles = StyleSheet.create({
  container: {
    height: windowHeight - 26,
  },
  fiedlsText: {
    display: 'flex',
    flexDirection: 'row',
  },
  seeMore: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (windowWidth * 1.8) / 3,
    marginTop: 1,
  },

  flatlist: {
    marginTop: 3,
    marginBottom: 3,
    paddingBottom: 100,
    paddingTop: 10,
  },
  item: {
    height: (hp('100%') - 5) / 5,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,

    backgroundColor: '#fff',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,

    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  iconText: {marginTop: 4, marginLeft: 5},
  text: {
    marginBottom: 1,
    marginLeft: 10,
    fontFamily: 'TimesNewRoman',
    fontSize: hp('2.1%'),
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  logo: {
    marginTop: 25,
    width: 80,
    height: 80,
  },
  // modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(103, 104, 107 , 0.95)',
    borderRadius: 20,
    maxHeight: windowHeight * 0.8,
    minHeight: windowHeight * 0.6,
    width: windowWidth / 1.15,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  openButton: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
