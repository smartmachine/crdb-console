import React, { Component } from 'react';
import './App.css';
import {Card, Container, Grid, Header, Icon, Image, List, Menu} from "semantic-ui-react";
import logo from './assets/logo.svg'
import Websocket from "./Websocket";

class App extends Component {

  handleData = (data) => {
    console.log(JSON.parse(data));
    this.websocket.sendMessage(JSON.stringify({
      text: "Back at ya!"
    }))
  };

  render() {
    return (
      <div>
        <Menu fixed='top'>
          <Menu.Item as='div' header>
            <Image size="small" src={logo}/>
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name="server"/>
            Clusters
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name="plus circle"/>
            Create
          </Menu.Item>
        </Menu>
        <Grid id="content">
          <Grid.Column width={4}>
            <Card>
              <Card.Content>
                <Card.Header>Clusters</Card.Header>
              </Card.Content>
              <Card.Content>
                <List>
                  <List.Item>
                    crdb-apps
                  </List.Item>
                  <List.Item>
                    crdb-infra
                  </List.Item>
                </List>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={12}>
            <Container>
              <Header as='h4'>
                Detail
              </Header>
            </Container>
          </Grid.Column>
        </Grid>
        <Websocket url='ws://localhost:8080/ws' onMessage={this.handleData} ref={(Websocket) => {this.websocket = Websocket}}/>
      </div>
    );
  }
}

export default App;
