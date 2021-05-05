import React, {Component} from 'react';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {getCompanyPost, deletePost} from '../../redux/actions';
import {Toast} from 'native-base';
import {TabView, SceneMap} from 'react-native-tab-view';
import _ from 'lodash';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CompanyPost extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      dataAccept: [],
      dataWait: [],
      index: 0,
      routes: [
        {key: 'Waiting', title: 'Waiting'},
        {key: 'Accepted', title: 'Accepted'},
      ],
    };
  }

  AcceptRoute = () => (
    <FlatList
      horizontal={false}
      data={this.state.dataAccept}
      renderItem={this.renderItemAccept}
      keyExtractor={this.keyExtractor}
    />
  );

  WaitingRoute = () => (
    <View style={styles.waitingContainer}>
      <FlatList
        horizontal={false}
        data={this.state.dataWait}
        renderItem={this.renderItemWait}
        keyExtractor={this.keyExtractor}
      />
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={this.moveToCreatePost}>
        <Text style={styles.textAdd}> + </Text>
      </TouchableOpacity>
    </View>
  );

  renderScene = SceneMap({
    Accepted: this.AcceptRoute,
    Waiting: this.WaitingRoute,
  });

  showToast = (text, type, duration = 2000, buttonText = 'Okey') => {
    Toast.show({
      text,
      buttonText,
      duration,
      type,
    });
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  setIndex = (index) => {
    this.setState({index});
  };

  showAlertAccept = (postId) =>
    Alert.alert('Option', `Pick your option `, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Apply List', onPress: () => this.moveToApplyList(postId)},
      {text: 'Done', onPress: () => console.log('OK Pressed')},
    ]);

  showAlert = (postId) =>
    Alert.alert('Option', `Pick your option `, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Edit', onPress: () => this.moveToEditForm(postId)},
      {text: 'Delete', onPress: async () => await this.deletePost(postId)},
    ]);

  deletePost = async (postId) => {
    Alert.alert('Confirm', `Are you sure you want to delete`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await this.props.deletePost(postId);
          if (this.props.Delstatus == 200 || this.props.Delstatus == 304) {
            this.showToast(this.props.delMsg, 'success', 2000);
            await this.props.getCompanyPost();
            this.setState({
              dataWait: this.props.posts.filter((e) => e.accept == false),
              dataAccept: this.props.posts.filter((e) => e.accept == true),
            });
          } else this.showToast(this.props.delMsg, 'warning', 2000);
        },
      },
    ]);
  };

  renderItemAccept = ({item, index, separators}) => (
    <TouchableOpacity
      onLongPress={() => this.showAlertAccept(item._id)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text}> Titile: {item.title} </Text>
        <Text style={styles.text}> Company Name: {item.name} </Text>
        <Text style={styles.text}> Salary: {item.salary} </Text>
        <Text style={styles.text}> Skill: {item.skill} </Text>
      </View>
    </TouchableOpacity>
  );

  renderItemWait = ({item, index, separators}) => (
    <TouchableOpacity
      onLongPress={() => this.showAlert(item._id)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text}> Titile: {item.title} </Text>
        <Text style={styles.text}> Company Name: {item.name} </Text>
        <Text style={styles.text}> Salary: {item.salary} </Text>
        <Text style={styles.text}> Skill: {item.skill} </Text>
      </View>
    </TouchableOpacity>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  componentDidMount() {
    this._isMounted = true;
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getCompanyPost();
      this.setState({
        dataWait: this.props.posts.filter((e) => e.accept == false),
        dataAccept: this.props.posts.filter((e) => e.accept == true),
      });
    });
    return unsubscribe;
  }

  moveToCreatePost = () => {
    this.props.navigation.navigate('CreatePost');
  };

  moveToApplyList = (postId) => {
    this.props.navigation.navigate('ApplyList', {postId});
  };

  moveToEditForm = (postId) => {
    this.props.navigation.navigate('EditForm', {postId});
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {index, routes} = this.state;
    return (
      <TabView
        navigationState={{index, routes}}
        renderScene={this.renderScene}
        onIndexChange={this.setIndex}
        initialLayout={{width: windowWidth}}
      />
    );
  }
}
const mapDispatchToProps = {
  getCompanyPost,
  deletePost,
};

const mapStateToProps = (state) => {
  const {loading, posts, status, msg} = state.getCompanyPost;
  return {
    loading,
    posts,
    status,
    msg,
    delMsg: state.deletePost.msg,
    Delstatus: state.deletePost.status,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CompanyPost);

const styles = StyleSheet.create({
  waitingContainer: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#b8c2d1',
    width: windowWidth - 40,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  textAdd: {
    fontSize: 30,
    fontWeight: '900',
  },
});
