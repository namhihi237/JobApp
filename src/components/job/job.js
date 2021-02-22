import React, {Component} from 'react';
import {SearchBar} from 'react-native-elements';
import {Loader} from '../../common';
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
import {getJob} from '../../redux/actions';
import {getData} from '../../utils';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class JobDetail extends Component {
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
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
  };

  updateSearch = (search) => {
    this.setState({search});
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
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getJob();
      const role = await getData('role');
      this.setState({role});
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

  renderButtonApply = () => {
    if (this.state.role == 'iter') {
      return (
        <TouchableHighlight style={styles.openButton} onPress={this.addItem}>
          <Text style={styles.textStyle}>Appy</Text>
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
          <SearchBar
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={search}
            placeholderTextColor="#aa5f5f"
            showLoading={true}
          />
          <FlatList
            style={styles.flatlist}
            data={this.props.posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}></FlatList>
        </SafeAreaView>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
            }}>
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
};

const mapStateToProps = (state) => {
  const {loading, posts, status, msg} = state.getJob;
  return {
    loading,
    posts,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Job);

const styles = StyleSheet.create({
  flatlist: {
    // backgroundColor: '#003f5c',
    marginTop: 1,
  },
  item: {
    height: (windowHeight - 10) / 6,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#DF2455',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
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
