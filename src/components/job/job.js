import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Toast } from 'native-base';
import { Loader, CardItem, SearchBar, ModalJob } from '../../common';
import axios from 'axios';
import { apiUrl } from '../../api/api';
import { getJob, applyJob, savePost, getSavedPost } from '../../redux/actions';
import { getData } from '../../utils';
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
  ActivityIndicator,
  Alert,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const { GET_JOBS_URL } = apiUrl;
class Job extends Component {
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
    this.setState({ isFetching: true });
    await this.props.getJob();
    this.setState({ posts: this.props.posts, page: 1 });
    this.setState({ isFetching: false });
  };

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      type: 'success',
      duration: 3000,
    });
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  searchItem = async () => {
    if (this.state.search == '') return;
    this.props.navigation.navigate('Search', { search: this.state.search });
  };

  renderItem = ({ item }) => (
    <CardItem
      item={item}
      userId={this.state.userId}
      savePost={this.savePost}
      role={this.state.role}
      showDetail={this.showDetail}
      savedPosts={this.props.savedPost}></CardItem>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  async componentDidMount() {
    await this.props.getJob();
    const role = await getData('role');
    const userId = await getData('userId');
    if (role === 'iter') {
      await this.props.getSavedPost();
    }

    this.setState({
      search: '',
      role,
      posts: this.props.posts,
      page: 1,
      userId,
      item: this.props.posts[0],
    });
  }

  async handleLoadMore() {
    try {
      await this.setState({ page: this.state.page + 1, isLoading: true });

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
      <View style={{ flex: 1 }}>
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  showDetail = (item) => {
    this.setModalVisible(true);
    this.setState({ item });
  };

  alertLogin = () =>
    Alert.alert('You must be login to apply!', null, [
      {
        text: 'Later',
        style: 'cancel',
      },
      {
        text: 'Login now',
        onPress: () => {
          this.props.navigation.navigate('Login');
          this.setModalVisible(!this.state.modalVisible);
        },
      },
    ]);
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
      newPost = [...this.props.savedPost, { postId: post._id, post: [post] }];
    } else {
      this.props.savedPost.forEach((element) => {
        if (element.postId != post._id) {
          newPost.push(element);
        }
      });
    }
    await this.props.savePost(post, newPost);
  };

  iterApplyJob = async () => {
    if (!this.state.role) {
      this.alertLogin();
      return;
    }
    await this.props.applyJob(this.state.item._id);
    this.showToast(this.props.msgApply);
  };

  renderButtonApply = () => {
    if (this.state.role == 'iter' || !this.state.role) {
      return (
        <TouchableOpacity
          style={{ ...styles.openButton, backgroundColor: '#37ce3f' }}
          onPress={this.iterApplyJob}>
          <Text style={styles.textStyle}>Apply</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  render() {
    const { modalVisible, item } = this.state;

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
          <SearchBar
            onPress={this.searchItem}
            onChangeText={this.updateSearch}
            value={this.state.search}
            placeholder={'keyword (skill, company, position,...)'}
          />
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
        <ModalJob
          item={item}
          onPress={() => this.setModalVisible(!modalVisible)}
          visible={modalVisible}
          renderButtonApply={this.renderButtonApply()}></ModalJob>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getJob,
  applyJob,
  savePost,
  getSavedPost,
};

const mapStateToProps = (state) => {
  const { loading, status, msg } = state.getJob;

  return {
    loading,
    posts: _.get(state.getJob, 'data.posts') || [],
    status,
    msg,
    currentPage: _.get(state.getJob, 'data.scurrentPage') || null,
    numPages: _.get(state.getJob, 'data.numPages') || null,
    statusApply: state.applyJob.status,
    msgApply: state.applyJob.msg,
    savedPost: _.get(state.getSavedPost, 'posts') || [],
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Job);

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('10%'),
  },
  flatlist: {
    marginTop: 3,
    marginBottom: hp('14%'),
  },
  searchButton: {
    height: 40,
    paddingRight: 30,
    width: windowWidth * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // modal

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
