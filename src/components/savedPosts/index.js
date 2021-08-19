import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {JobDetail} from '../job/jobDtail';
import {applyJob, savePost, getSavedPost} from '../../redux/actions';
import {getData} from '../../utils';
import {Header, Left, Body, Button, Icon, Title} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Loader, CardItem, SearchBar, ModalJob} from '../../common';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
class SavedPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      item: null,
      userId: '',
      isFetching: false,
    };
  }

  onRefresh = async () => {
    await this.props.getSavedPost();
  };

  openBar = () => {
    this.props.navigation.openDrawer();
  };

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  renderItem = ({item}) => (
    <CardItem
      item={item}
      userId={this.state.userId}
      savePost={this.savePost}
      role={'iter'}
      showDetail={this.showDetail}
      savedPosts={this.props.posts}></CardItem>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  async componentDidMount() {
    const userId = await getData('userId');
    this.setState({
      userId,
    });
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  showDetail = (item) => {
    this.setModalVisible(true);
    this.setState({item});
  };

  savePost = async (post) => {
    let newPost = [];
    if (!this.props.posts.map((e) => e.postId).includes(post._id)) {
      newPost = [...this.props.posts, {postId: post._id, post: [post]}];
    } else {
      this.props.posts.forEach((element) => {
        if (element.postId != post._id) {
          newPost.push(element);
        }
      });
    }
    await this.props.savePost(post, newPost);
  };

  iterApplyJob = async () => {
    await this.props.applyJob(this.state.item._id);
    this.showToast(this.props.msgApply);
  };

  renderButtonApply = () => {
    return (
      <TouchableHighlight
        style={{...styles.openButton, backgroundColor: '#37ce3f'}}
        onPress={this.iterApplyJob}>
        <Text style={styles.textStyle}>Apply</Text>
      </TouchableHighlight>
    );
  };

  render() {
    const {modalVisible, item} = this.state;
    return (
      <View>
        <View style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={this.openBar}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title style={{fontFamily: 'Itim-Regular'}}>Saved Posts</Title>
            </Body>
          </Header>
          <FlatList
            style={styles.flatlist}
            scrollEventThrottle={16}
            data={_.flattenDepth(this.props.posts.map((e) => e.post))}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}></FlatList>
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
  applyJob,
  savePost,
  getSavedPost,
};

const mapStateToProps = (state) => {
  return {
    statusApply: state.applyJob.status,
    msgApply: state.applyJob.msg,
    posts: _.get(state.getSavedPost, 'posts') || [],
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SavedPost);

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('7%'),
  },
  flatlist: {
    marginTop: 3,
    marginBottom: hp('10%'),
    paddingTop: 10,
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
});
