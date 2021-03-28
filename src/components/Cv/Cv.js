import React, {Component} from 'react';
import {Loader} from '../../common';
import {connect} from 'react-redux';
import {confirmCode} from '../../redux/actions';
import SelectMultiple from 'react-native-select-multiple';
import {createIterCv} from '../../redux/actions'

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

const dataSkill = [
  'C',
  'C++',
  'C#',
  'Java',
  'Javascript',
  'PHP',
  'Python',
  'Nodejs',
  'Spring',
  'Flask',
  'VueJs',
  'ReactJs',
  'DotNet',
];
class Cv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSkill : [],
      personalSkill : '',
      experience : '',
      description : '',
      textSkill : '',
      modalVisible : false,
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.LONG);
  };

  setModalVisible = (status) => {
    this.setState({
      modalVisible: status,
    });
  };

  showModalSkill = () => {
    this.setState({modalVisible: true, skill: true});
  };

  onChangePersonalSkill = (personalSkill) => {
    this.setState({personalSkill})
  }

  onChangeExperience = (experience) => {
    this.setState({experience})
  }

  onChangeDescription = (description) => {
    this.setState({description})
  }

  validateData = () => {
    const {selectedSkill, personalSkill, experience, description} = this.state
    if (!personalSkill || !experience || !description) return false;
    if (selectedSkill.length == 0) return false;
    return true;
  }

  createCv = async () => {
    if(!this.validateData()){
      this.showToast('Data is emtry')
      return
    }
    const {selectedSkill, personalSkill, experience, description } = this.state
    try {
      const skill = selectedSkill.map((e) => e.value);
      const data = {skill, personalSkill, experience, description};
      console.log(data);
      await this.props.createIterCv(data);
      this.showToast(this.props.msg);
      if (this.props.status != 200&&this.props.state !=304) {
        //return;
        console.log('api fail')
      }
      this.props.navigation.goBack();
    } catch (error) {
      console.log(error)
    }
  }
  onSelectionsChangesKill = (selectedSkill) => {
    const skills = selectedSkill.map((e) => e.value).join(', ');
    this.setState({selectedSkill, textSkill: skills});
  };

  showSkill = () => {
    return (
      <View style={{height: 300, width: 200}}>
        <SelectMultiple
          items={dataSkill}
          selectedItems={this.state.selectedSkill}
          onSelectionsChange={this.onSelectionsChangesKill}
        />
      </View>
    );
  }


  render() {
    const {modalVisible, textSkill} = this.state;
    return (
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{flex: 1}}>
        <Loader status={this.props.loading} msg={'Creating '}></Loader>
          <View style={styles.container}>
            <Text style = {{fontSize: 30, marginBottom:20}}>CREATE CV</Text>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                value={textSkill}
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
            <TextInput
              style={styles.textInput}
              onChangeText={this.onChangePersonalSkill}
              placeholder="Personal Skill"></TextInput>
            <TextInput
              style={styles.textInput}
              onChangeText={this.onChangeExperience}
              placeholder="Experience"></TextInput>
            <TextInput
              onChangeText={this.onChangeDescription}
              multiline={true}
              numberOfLines={4}
              style={styles.desInput}
              placeholder="Description"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.openButton}
              onPress={this.createCv}>
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
  createIterCv,
};

const mapStateToProps = (state) => {
//console.log(state.createPost)

  const {loading, status, msg} = state.createIterCv;
  console.log("n:,",state.createIterCv)
  return {
    loading,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Cv);

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
    color: 'black',
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
    marginTop : 5,
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
