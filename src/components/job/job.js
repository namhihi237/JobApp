import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Loader} from '../../common';
import axios from 'axios';
import {apiUrl} from '../../api/api';
import {JobDetail} from './jobDtail';
import {getJob, applyJob} from '../../redux/actions';
import {getData} from '../../utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Alert,
  LogBox,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const {GET_JOBS_URL} = apiUrl;
class Job extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      modalVisible: false,
      item: null,
      role: '',
      posts: [],
      page: 1,
      isLoading: false,
      userId: '',
      isFetching: false,
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    await this.props.getJob();
    this.setState({posts: this.props.posts, page: 1});
    this.setState({isFetching: false});
  };

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  updateSearch = (search) => {
    this.setState({search});
  };

  searchItem = async () => {
    if (this.state.search == '') return;
    this.props.navigation.navigate('Search', {search: this.state.search});
  };

  renderApply = (listApply) => {
    for (let applier of listApply) {
      if (
        JSON.stringify(applier.iterId) === JSON.stringify(this.state.userId)
      ) {
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
    }
  };

  renderItem = ({item}) => (
    <View style={styles.item}>
      <View style={styles.logoContainer}>
        <Image
          source={{uri: _.get(item.company[0], 'image')}}
          style={styles.logo}></Image>
        <View style={{padding: 1, marginLeft: 10, maxWidth: wp('60%')}}>
          <Text
            style={{...styles.text, fontSize: hp('2.5%')}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text
            style={{...styles.text, fontSize: hp('2.1%')}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {_.get(item.company[0], 'name')}
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
    </View>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  async componentDidMount() {
    // this._isMounted = true;
    // const unsubscribe = this.props.navigation.addListener('focus', async () => {
    this.setState({search: ''});
    await this.props.getJob();
    const role = await getData('role');
    const userId = await getData('userId');
    this.setState({role, posts: this.props.posts, page: 1, userId});
    // });

    // return unsubscribe;
  }

  async handleLoadMore() {
    try {
      await this.setState({page: this.state.page + 1, isLoading: true});

      if (this.state.page > this.props.numPages) {
        return;
      }
      const result = await axios.get(
        `${GET_JOBS_URL}?page=${this.state.page}&take=${10}`,
      );
      const addPost = result.data.data.posts;
      const currentPage = result.data.data.currentPage;
      let newPost = [...this.state.posts, ...addPost];

      this.setState({
        posts: newPost,
        isLoading: false,
        page: currentPage + 1,
      });
    } catch (error) {
      return;
    }
  }

  footerList = () => {
    return (
      <View style={{flex: 1}}>
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  };

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
        <View style={styles.container}>
          <View style={styles.searchContaier}>
            <View style={{...styles.searchInput}}>
              <TextInput
                style={{
                  height: 50,
                  width: wp('75%'),
                  fontFamily: 'TimesNewRoman',
                  fontSize: 16,
                }}
                onChangeText={this.updateSearch}
                value={this.state.search}
                placeholder="Keyword (skill, company, position,...)"
                placeholderTextColor="#44464f"></TextInput>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={this.searchItem}>
                <FontAwesome5
                  name={'search'}
                  style={{fontSize: 22, marginTop: 2}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            style={styles.flatlist}
            scrollEventThrottle={16}
            data={this.state.posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onEndReached={this.handleLoadMore}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            ListFooterComponent={this.footerList}></FlatList>
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
  getJob,
  applyJob,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.getJob;

  return {
    loading,
    posts: _.get(state.getJob, 'data.posts') || [],
    status,
    msg,
    currentPage: _.get(state.getJob, 'data.scurrentPage') || null,
    numPages: _.get(state.getJob, 'data.numPages') || null,
    statusApply: state.applyJob.status,
    msgApply: state.applyJob.msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Job);

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
  searchInput: {
    height: 50,
    width: windowWidth - 10,
    borderColor: '#7e8591',
    marginLeft: 3,
    marginRight: 3,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    paddingLeft: 15,
    borderRadius: 50,
    backgroundColor: '#c7cadd',
    opacity: 0.7,
  },
  flatlist: {
    marginTop: 3,
    marginBottom: hp('10%'),
    paddingTop: 10,
  },
  searchContaier: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
    backgroundColor: 'rgba(249, 247, 247, 0.1)',
  },
  searchButton: {
    height: 40,
    width: windowWidth * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginLeft: 5,
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
