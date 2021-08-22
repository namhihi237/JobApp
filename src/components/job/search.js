import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {JobDetail} from './jobDtail';
import {applyJob, searchJob, savePost, getSavedPost} from '../../redux/actions';
import {getData} from '../../utils';
import {Loader, CardItem, SearchBar} from '../../common';
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
  Alert,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Search extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      modalVisible: false,
      item: null,
      role: '',
      posts: [],
      userId: '',
    };
  }

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
    let {search} = this.state;
    if (search == '') return;
    await this.props.searchJob(search);
    this.setState({posts: this.props.postsSearch});
  };

  renderItem = ({item}) => (
    <CardItem
      item={item}
      userId={this.state.userId}
      savePost={this.savePost}
      role={this.state.role}
      showDetail={this.showDetail}
      savedPosts={this.props.savedPost}></CardItem>
  );
  alertLoginSaved = () =>
    Alert.alert('You must be login to apply!', null, [
      {
        text: 'Later',
        style: 'cancel',
      },
      {
        text: 'Login now',
        onPress: () => {
          this.props.navigation.navigate('Login');
        },
      },
    ]);

  savePost = async (post) => {
    if (!this.state.userId) {
      this.alertLoginSaved();
      return;
    }
    let newPost = [];
    if (!this.props.savedPost.map((e) => e.postId).includes(post._id)) {
      newPost = [...this.props.savedPost, {postId: post._id, post: [post]}];
    } else {
      this.props.savedPost.forEach((element) => {
        if (element.postId != post._id) {
          newPost.push(element);
        }
      });
    }
    await this.props.savePost(post, newPost);
  };
  keyExtractor = (item) => {
    return item._id;
  };

  async componentDidMount() {
    this._isMounted = true;
    return this.props.navigation.addListener('focus', async () => {
      await this.setState({search: this.props.route.params.search});
      await this.props.searchJob(this.state.search);
      const role = await getData('role');
      if (role === 'iter') {
        await this.props.getSavedPost();
      }
      const userId = await getData('userId');

      this.setState({role, posts: this.props.postsSearch, userId});
    });
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

  backToHome = () => {
    this.props.navigation.popToTop();
  };

  render() {
    const {modalVisible, item} = this.state;

    if (this.props.status != 200 && this.props.status != 304) {
      return <View>{/* <Loader status={this.props.loading}></Loader> */}</View>;
    }
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.searchContaier}>
            <TouchableOpacity
              onPress={this.backToHome}
              style={styles.buttonBack}>
              <FontAwesome5
                name={'arrow-left'}
                style={{
                  fontSize: 22,
                  marginBottom: 3,
                }}
              />
            </TouchableOpacity>
            <View style={styles.searchInput}>
              <TextInput
                style={{
                  height: 50,
                  width: wp('65%'),
                  fontFamily: 'TimesNewRoman',
                  fontSize: 16,
                }}
                value={this.state.search}
                onChangeText={this.updateSearch}
                placeholder="Keyword (skill, company, position,...)"
                placeholderTextColor="#44464f"></TextInput>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={this.searchItem}>
                <FontAwesome5
                  name={'search'}
                  style={{fontSize: 22, marginTop: 2, color: '#f25430'}}
                />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.posts.length > 0 ? (
            <FlatList
              style={styles.flatlist}
              scrollEventThrottle={16}
              data={this.state.posts}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              onEndReached={this.handleLoadMore}></FlatList>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'TimesNewRoman',
                  fontSize: hp('3.1%'),
                  padding: 30,
                }}>
                Sorry, we couldn't find any results for your search!
              </Text>
            </View>
          )}
        </View>
        <View style={styles.centeredView}>
          <Modal
            style={styles.search}
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 30}}>Job Detail</Text>
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
  applyJob,
  searchJob,
  savePost,
  getSavedPost,
};

const mapStateToProps = (state) => {
  let postsSearch = _.get(state.searchJob, 'data.posts') || [];
  return {
    postsSearch,
    statusApply: state.applyJob.status,
    msgApply: state.applyJob.msg,
    loading: _.get(state.searchJob, 'loading'),
    status: state.searchJob.status,
    savedPost: _.get(state.getSavedPost, 'posts') || [],
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);

const styles = StyleSheet.create({
  container: {
    height: windowHeight - 26,
  },
  searchInput: {
    height: 50,
    width: wp('85%'),
    borderColor: '#E0E0E0',
    margin: wp('4%'),
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    paddingLeft: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  flatlist: {
    marginTop: 3,
    marginBottom: 3,
    paddingTop: 10,
    paddingBottom: 100,
  },
  searchContaier: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
    backgroundColor: 'rgba(249, 247, 247, 0.1)',
  },
  searchButton: {
    height: 40,
    paddingRight: 20,
    width: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
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
  headerStyle: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    color: '#000',
  },
  buttonBack: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginLeft: 6,
  },
});
