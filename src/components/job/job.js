import React, {Component} from 'react';
import {SearchBar} from 'react-native-elements';
import {Loader} from '../../common';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import {connect} from 'react-redux';
import {getJob, applyJob, searchJob} from '../../redux/actions';
import {getData} from '../../utils';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class JobDetail extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
  }
  render() {
    const {item} = this.props;
    return (
      <View style={styles.itemDetail}>
        <Text style={styles.text}>Company Name: {item.companyName}</Text>
        <Text style={styles.text}>Address: {item.address}</Text>
        <Text style={styles.text}>Description: {item.description}</Text>
        <Text style={styles.text}>Salary: {item.salary}</Text>
        <Text style={styles.text}>Skill: {item.skill.join(', ')}</Text>
        <Text style={styles.text}>Position: {item.position.join(', ')}</Text>
        <Text style={styles.text}>End time: {item.endTime}</Text>
      </View>
    );
  }
}

class Job extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      modalVisible: false,
      item: null,
      role: '',
      posts: [],
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
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

      this.setState({role, posts: this.props.posts});
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

  render() {
    const {search, modalVisible, item} = this.state;

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
        <SafeAreaView>
          <View style={styles.searchContaier}>
            <SearchBar
              placeholder="Type Here..."
              onChangeText={this.updateSearch}
              value={search}
              placeholderTextColor="#aa5f5f"
              showLoading={true}
            />
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
            renderItem={this.renderItem}></FlatList>
        </SafeAreaView>
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
  search: {
    borderBottomRightRadius: 10,
    height: 50,
  },
  flatlist: {
    // backgroundColor: '#003f5c',
    marginTop: 1,
  },
  searchButton: {
    height: 30,
    width: 50,
    backgroundColor: '#afaa',
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
  itemDetail: {
    height: (windowHeight - 10) / 4,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#6ca2c1',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 15,
    // fontWeight: 'bold',
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
});
