import {Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const MyHeader = (props) => {
  const navigation = useNavigation();
  const back = () => navigation.goBack();

  return (
    <Header style={{backgroundColor: props.color}}>
      <Left>
        {props.left ? (
          <Button transparent onPress={back}>
            <Icon name="arrow-back" />
          </Button>
        ) : null}
      </Left>
      <Body style={{flex: 2, alignItems: 'center'}}>
        <Title style={{fontFamily: 'Itim-Regular', fontSize: 23}}>
          {props.title}
        </Title>
      </Body>
      <Right>
        <Button transparent onPress={props.onPressRight}>
          <Icon name="menu" />
        </Button>
      </Right>
    </Header>
  );
};

export default MyHeader;
