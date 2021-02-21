import React, {Component} from 'react';
import CheckboxList from 'rn-checkbox-list';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from 'react-native';

import {connect} from 'react-redux';
import {createPost} from '../../redux/actions';

const dataSkill = [
  {id: 1, name: 'C'},
  {id: 2, name: 'C++'},
  {id: 3, name: 'C#'},
  {id: 4, name: 'Java'},
  {id: 5, name: 'Javascript'},
  {id: 6, name: 'PHP'},
  {id: 7, name: 'Python'},
  {id: 8, name: 'Nodejs'},
  {id: 9, name: 'Spring'},
  {id: 10, name: 'Flask'},
  {id: 11, name: 'Vuejs'},
  {id: 12, name: 'ReactJs'},
  {id: 13, name: 'DotNet'},
];

const dataPosition = [
  {id: 1, name: 'Inter'},
  {id: 2, name: 'Fresher'},
  {id: 3, name: 'Junio'},
  {id: 4, name: 'Senio'},
  {id: 5, name: 'Project Manager'},
  {id: 6, name: 'Team Leader'},
  {id: 7, name: 'Tester'},
  {id: 8, name: 'Developer'},
  {id: 9, name: 'Software Engineer'},
];
class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      skill: false,
      positionId: [],
      skillId: [],
      salary: '',
      address: '',
      endTime: '',
      description: '',
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
  };

  setModalVisible = (status) => {
    this.setState({
      modalVisible: status,
    });
  };

  showModalSkill = () => {
    this.setState({modalVisible: true, skill: true});
  };

  showModalPosition = () => {
    this.setState({modalVisible: true, skill: false});
  };

  setSkills = (ids) => {
    console.log(ids);
    // this.setState({skillId: ids});
  };

  setPos = (ids) => {
    this.setState({positionId: ids});
  };

  validateData = () => {
    const {
      salary,
      description,
      address,
      endTime,
      skillId,
      positionId,
    } = this.state;
    if (!salary || !description || !address || !endTime) return false;
    if (skillId.length == 0 || positionId.length == 0) return false;
    return true;
  };

  createPost = () => {
    if (this.validateData()) {
      this.showToast('Data is empty!');
      return;
    }
    const {
      salary,
      description,
      address,
      endTime,
      skillId,
      positionId,
    } = this.state;

    const skill = dataSkill
      .filter((e) => skillId.includes(e.id))
      .map((e) => e.name);

    const position = dataPosition
      .filter((e) => positionId.includes(e.id))

      .map((e) => e.name);
    console.log(skill);
    const data = {};
    try {
    } catch (error) {}
  };

  showSkill = () => {
    if (!this.state.skill)
      return (
        <View style={{height: 300, width: 200}}>
          <CheckboxList
            theme="red"
            listItems={dataPosition}
            onChange={({ids, items}) => this.setPos(ids)}
            listItemStyle={{borderBottomColor: '#eee', borderBottomWidth: 1}}
            checkboxProp={{boxType: 'square'}}
            selectedListItems={this.state.positions}
            // onLoading={() => <LoaderComponent />}
          />
        </View>
      );
    return (
      <View style={{height: 300, width: 200}}>
        <CheckboxList
          theme="red"
          listItems={dataSkill}
          onChange={({ids, items}) => this.setSkills(ids)}
          listItemStyle={{borderBottomColor: '#eee', borderBottomWidth: 1}}
          checkboxProp={{boxType: 'square'}}
          selectedListItems={this.state.skills}
          // onLoading={() => <LoaderComponent />}
        />
      </View>
    );
  };

  render() {
    const {modalVisible} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{flex: 1}}>
          <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.textInput}
                editable={false}
                selectTextOnFocus={false}
                placeholder="Skill..."></TextInput>
              <TouchableOpacity
                style={styles.buttonChoice}
                onPress={this.showModalSkill}>
                <Text>choice</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.textInput}
                editable={false}
                selectTextOnFocus={false}
                placeholder="Position..."></TextInput>
              <TouchableOpacity
                style={styles.buttonChoice}
                onPress={this.showModalPosition}>
                <Text>choice</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Salary..."></TextInput>
            <TextInput
              style={styles.textInput}
              placeholder="Address..."></TextInput>
            <TextInput
              style={styles.textInput}
              placeholder="End Time..."></TextInput>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={styles.desInput}
              placeholder="Description"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.openButton}
              onPress={this.createPost}>
              <Text style={styles.textStyle}>Create</Text>
            </TouchableOpacity>
          </View>
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
                  <Text style={styles.modalText}>Choice Skill</Text>
                  {this.showSkill()}
                  <View style={styles.containerButton}>
                    <TouchableOpacity
                      style={styles.openButton}
                      onPress={() => {
                        this.setModalVisible(!modalVisible);
                      }}>
                      <Text style={styles.textStyle}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapDispatchToProps = {
  createPost,
};

const mapStateToProps = (state) => {
  const {loading, posts, status, msg} = state.createPost;
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    width: 200,
    marginBottom: 5,
    paddingLeft: 6,
    marginLeft: 100,
  },
  desInput: {
    borderColor: 'black',
    borderWidth: 1,
    height: 100,
    width: 200,
    marginBottom: 5,
    paddingLeft: 6,
    textAlignVertical: 'top',
    marginLeft: 100,
  },
  buttonChoice: {
    height: 30,
    width: 50,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },

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
    height: 500,
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
