import React, {Component} from 'react';
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
class CompanyPost extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      dataAccept: [],
      dataWait: [],
      dataComplete: [],
      index: 0,
      routes: [
        {key: 'Waiting', title: 'Approving'},
        {key: 'Accepted', title: 'Approved'},
        {key: 'Complete', title: 'Expired'},
      ],
    };
  }

  AcceptRoute = () =>
    this.state.dataAccept.length > 0 ? (
      <FlatList
        horizontal={false}
        data={this.state.dataAccept}
        renderItem={this.renderItemAccept}
        keyExtractor={this.keyExtractor}
      />
    ) : (
      <View style={styles.nodata}>
        <Text style={styles.textNodata}>No data</Text>
      </View>
    );

  WaitingRoute = () => (
    <View style={styles.waitingContainer}>
      {this.state.dataWait.length > 0 ? (
        <FlatList
          horizontal={false}
          data={this.state.dataWait}
          renderItem={this.renderItemWait}
          keyExtractor={this.keyExtractor}
        />
      ) : (
        <View style={styles.nodata}>
          <Text style={styles.textNodata}>No data</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={this.moveToCreatePost}>
        <Text style={styles.textAdd}> + </Text>
      </TouchableOpacity>
    </View>
  );

  CompleteRoute = () =>
    this.state.dataComplete.length > 0 ? (
      <FlatList
        horizontal={false}
        data={this.state.dataComplete}
        renderItem={this.renderItemAccept}
        keyExtractor={this.keyExtractor}
      />
    ) : (
      <View style={styles.nodata}>
        <Text style={styles.textNodata}>No data</Text>
      </View>
    );

  renderScene = SceneMap({
    Accepted: this.AcceptRoute,
    Waiting: this.WaitingRoute,
    Complete: this.CompleteRoute,
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
        style: 'cancel',
      },
      {text: 'Apply List', onPress: () => this.moveToApplyList(postId)},
      {text: 'Done', onPress: async () => this.completePost(postId)},
    ]);

  showAlertComplete = (postId) =>
    Alert.alert('Option', `Pick your option `, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Apply List', onPress: () => this.moveToApplyList(postId)},
    ]);

  showAlert = (postId) =>
    Alert.alert('Option', `Pick your option `, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Edit', onPress: () => this.moveToEditForm(postId)},
      {text: 'Delete', onPress: async () => await this.deletePost(postId)},
    ]);

  completePost = async (postId) => {
    try {
      const token = await getData('token');
      const result = await axios.patch(
        `${apiUrl.BASE_URL}/api/v1/posts/${postId}/complete`,
        null,
        {headers: {authorization: `Bearer ${token}`}},
      );
      if (result.data.msg == 'Success') {
        await this.props.getCompanyPost();
        this.setState({
          dataWait: this.props.posts.filter((e) => e.status == 'WAITING'),
          dataAccept: this.props.posts.filter((e) => e.status == 'ACCEPTED'),
          dataComplete: this.props.posts.filter((e) => e.status == 'DONE'),
        });
        this.showToast(result.data.msg);
      }
      return;
    } catch (error) {
      return;
    }
  };

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
              dataWait: this.props.posts.filter((e) => e.status == 'WAITING'),
              dataAccept: this.props.posts.filter(
                (e) => e.status == 'ACCEPTED',
              ),
              dataComplete: this.props.posts.filter((e) => e.status == 'DONE'),
            });
          } else this.showToast(this.props.delMsg, 'warning', 2000);
        },
      },
    ]);
  };

  renderItemAccept = ({item, index, separators}) => (
    <TouchableOpacity
      onLongPress={() => {
        this.showAlertComplete(item._id);
      }}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Title: {item.title}
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Company Name: {_.get(item.company[0], 'name')}
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Salary: {item.salary}
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Skill: {item.skill.join(', ')}
        </Text>
        <Text style={styles.text}>End Time: {item.endTime} </Text>
      </View>
    </TouchableOpacity>
  );

  renderItemWait = ({item, index, separators}) => (
    <TouchableOpacity
      onLongPress={() => this.showAlert(item._id)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Title: {item.title}
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Company Name: {_.get(item.company[0], 'name')}
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Salary: {item.salary}
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          Skill: {item.skill.join(', ')}
        </Text>
        <Text style={styles.text}>End Time: {item.endTime} </Text>
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
        dataWait: this.props.posts.filter((e) => e.status == 'WAITING'),
        dataAccept: this.props.posts.filter((e) => e.status == 'ACCEPTED'),
        dataComplete: this.props.posts.filter((e) => e.status == 'DONE'),
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
        style={{backgroundColor: '#fff'}}
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
    backgroundColor: '#f4efef',
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
    backgroundColor: '#eebbc3',
    borderRadius: 100,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },
  textAdd: {
    fontSize: 30,
    fontWeight: '900',
  },
  text: {
    fontFamily: 'TimesNewRoman',
    fontSize: hp('2.2%'),
  },
  nodata: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNodata: {
    fontSize: 30,
  },
});
