import React, {Component} from 'react';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import {getCompanyPost} from '../../redux/actions';

import {FormInfo} from './FormInfo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CompanyPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAccept: [],
      dataWait: [],
      modalVisible: false,
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  renderItemAccept = ({item, index, separators}) => (
    <TouchableOpacity
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text}>Company Name: {item.companyName}</Text>
        <Text style={styles.text}>Salary: {item.salary}</Text>
        <Text style={styles.text}>Skill: {item.skill.join(', ')}</Text>
        <Text style={styles.text}>Position: {item.position.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  renderItemWait = ({item, index, separators}) => (
    <TouchableOpacity
      onPress={() => Alert.alert('ok')}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text}>Company Name: {item.companyName}</Text>
        <Text style={styles.text}>Salary: {item.salary}</Text>
        <Text style={styles.text}>Skill: {item.skill.join(', ')}</Text>
        <Text style={styles.text}>Position: {item.position.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  showModalAdd = () => {
    this.setModalVisible(true);
  };

  async componentDidMount() {
    // const unsubscribe = this.props.navigation.addListener('focus', async () => {
    //   await this.props.getCompanyPost();
    // });
    // return unsubscribe;
    await this.props.getCompanyPost();
    this.setState({
      dataWait: this.props.posts.filter((e) => e.accept == false),
      dataAccept: this.props.posts.filter((e) => e.accept == true),
    });
  }

  render() {
    const {dataAccept, dataWait, modalVisible} = this.state;
    if (this.props.status != 200 && this.props.status != 304) {
      return (
        <View>
          <Text>No data</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Loader status={this.props.loading}></Loader>
        <View>
          <Text style={styles.titleList}>Accepted post list</Text>
          <FlatList
            horizontal={true}
            data={dataAccept}
            renderItem={this.renderItemAccept}
            keyExtractor={this.keyExtractor}
          />
        </View>
        <View style={styles.line} />
        <View>
          <Text style={styles.titleList}>Waiting post list</Text>
          <FlatList
            horizontal={true}
            data={dataWait}
            renderItem={this.renderItemWait}
            keyExtractor={this.keyExtractor}
          />
        </View>
        <TouchableOpacity style={styles.buttonAdd} onPress={this.showModalAdd}>
          <Text style={styles.textAdd}>+</Text>
        </TouchableOpacity>
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
                <Text style={styles.modalText}>Create New Job</Text>
                <FormInfo></FormInfo>
                <View style={styles.containerButton}>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={this.addItem}>
                    <Text style={styles.textStyle}>Create</Text>
                  </TouchableOpacity>
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
  getCompanyPost,
};

const mapStateToProps = (state) => {
  const {loading, posts, status, msg} = state.getCompanyPost;

  return {
    loading,
    posts,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CompanyPost);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  //modal
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
    height: 400,
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
  modalText: {
    fontSize: 20,
  },
});
