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

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Image,
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

  renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <View style={styles.logoContainer}>
          <Image
            source={{uri: _.get(item.company[0], 'image')}}
            style={styles.logo}></Image>
          <View style={{padding: 1, marginLeft: 10, width: wp('65%')}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{...styles.text, fontSize: hp('2.5%')}}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.title}
              </Text>
              {this.renderButtonSaved(item)}
            </View>
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
              <TouchableOpacity
                onPress={() => this.showDetail(item)}
                style={{}}>
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
  };

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

  renderButtonSaved = (post) => {
    return (
      <TouchableOpacity onPress={() => this.savePost(post)}>
        <FontAwesome5
          name={'bookmark'}
          style={{
            color: 'red',
            fontSize: hp('2.5%'),
          }}
        />
      </TouchableOpacity>
    );
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

  flatlist: {
    marginTop: 3,
    marginBottom: hp('10%'),
    paddingTop: 10,
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
    maxWidth: wp('61%') - 20,
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
});
