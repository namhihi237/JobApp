import React, {Component} from 'react';
import {Header, Left, Body, Button, Icon, Title} from 'native-base';

class HeaderRight extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Header>
        <Left>
          <Button transparent onPress={this.props.onPress}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title style={{fontFamily: 'Itim-Regular'}}>{this.props.title}</Title>
        </Body>
      </Header>
    );
  }
}

export default HeaderRight;
