import React, {Component} from 'react';
import {Loader} from '../../common';
import axios from 'axios';
import {apiUrl} from '../../api/api';
const {GET_JOBS_URL} = apiUrl;

import _ from 'lodash';
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
} from 'react-native';

import {JobDetail} from './jobDtail';

import {connect} from 'react-redux';
import {getJob, applyJob, searchJob} from '../../redux/actions';
import {getData} from '../../utils';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {Toast} from 'native-base';
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
      loadingmore: false,
      refreshing: false,
      page: 1,
      isLoading: false,
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
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
    await this.props.searchJob(this.state.search);
    this.setState({posts: this.props.postsSearch});
  };

  renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.text}>Company Name: {item.companyName}</Text>
      <Text style={styles.text}>Salary: {item.salary}</Text>
      <Text style={styles.text}>Skill: {item.skill.join(', ')}</Text>
      <Text style={styles.text}>Position: {item.position.join(', ')}</Text>
      <TouchableOpacity onPress={() => this.showDetail(item)}>
        <Text style={{color: 'green'}}>Detail</Text>
      </TouchableOpacity>
    </View>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  componentDidMount() {
    this._isMounted = true;
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getJob();
      const role = await getData('role');

      this.setState({role, posts: this.props.posts, page: 1});
    });

    return unsubscribe;
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
    await this.props.applyJob(this.state.item._id);
    this.showToast(this.props.msgApply);
  };

  renderButtonApply = () => {
    if (this.state.role == 'iter') {
      return (
        <TouchableHighlight
          style={styles.openButton}
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
          <Text>No data</Text>
        </View>
      );
    }
    return (
      <View>
        <Loader status={this.props.loading}></Loader>
        <View style={styles.container}>
          <View style={styles.searchContaier}>
            <TextInput
              style={styles.searchInput}
              onChangeText={this.updateSearch}
              placeholder="Type Here..."
              placeholderTextColor="#aa5f5f"></TextInput>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={this.searchItem}>
              <Text>Search</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.flatlist}
            data={this.state.posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onEndReached={this.handleLoadMore}
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
                <Text style={styles.modalText}>Job Detail</Text>
                <JobDetail item={item}></JobDetail>
                <View style={styles.containerButton}>
                  <TouchableHighlight
                    style={styles.openButton}
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
  searchJob,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.getJob;

  let postsSearch = _.get(state.searchJob, 'data.posts') || [];
  return {
    loading,
    posts: _.get(state.getJob, 'data.posts') || [],
    status,
    msg,
    currentPage: _.get(state.getJob, 'data.scurrentPage') || null,
    numPages: _.get(state.getJob, 'data.numPages') || null,
    postsSearch,
    statusApply: state.applyJob.status,
    msgApply: state.applyJob.msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Job);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
  searchInput: {
    height: 40,
    width: windowWidth * 0.8,
    borderColor: '#003f5c',
    borderWidth: 2,
    padding: 2,
    borderRadius: 6,
  },
  flatlist: {
    marginTop: 1,
  },
  searchContaier: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
  },
  searchButton: {
    height: 40,
    width: windowWidth * 0.18,
    backgroundColor: '#3c9e69',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  item: {
    height: (windowHeight - 10) / 6,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#aecce2',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
    borderRadius: 7,
    // shawdow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
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
    backgroundColor: 'white',
    borderRadius: 20,
    height: 300,
    width: 300,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  openButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
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
