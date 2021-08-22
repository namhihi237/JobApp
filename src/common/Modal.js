import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;
import {JobDetail} from '../components/job/jobDtail';
import _ from 'lodash';
const windowWidth = Dimensions.get('window').width;
const ModalJob = (props) => {
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={props.visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 30, fontFamily: 'Sailors Slant'}}>
              Job Detail
            </Text>
            <JobDetail item={props.item}></JobDetail>
            <View style={styles.containerButton}>
              <TouchableOpacity
                style={{...styles.openButton, backgroundColor: '#d9d2c5'}}
                onPress={props.onPress}>
                <Text style={styles.textCancel}>Cancel</Text>
              </TouchableOpacity>
              {props.renderButtonApply}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#9a8072',
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
  textCancel: {
    color: '#927874',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default ModalJob;
