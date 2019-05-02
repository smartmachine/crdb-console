import React, { Component } from 'react';

import {Button, Grid, Header, Icon, Image, Label, Menu, Segment} from "semantic-ui-react";

import Websocket from "./Websocket";

import { Terminal } from 'xterm';
import * as fullScreen from 'xterm/lib/addons/fullscreen/fullscreen';

import logo from './assets/logo.svg'

import 'xterm/dist/xterm.css'
import 'xterm/lib/addons/fullscreen/fullscreen.css';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clusters: {},
      currentDatabase: undefined,
      log: []
    }
  }

  handleData = (data) => {
    let record = JSON.parse(data);
    let clusters = this.state.clusters;
    let log = this.state.log;
    let { key, crud } = record;
    let newState = {};
    if (this.state.currentDatabase) {
      newState['currentDatabase'] = this.state.currentDatabase;
    }
    if (crud === 'record') {
      clusters[key] = record['data'];
      log.unshift(record['data']['status']['state']);
    }
    if (crud === 'delete') {
      delete clusters[key];
      if (this.state.currentDatabase === key) {
        newState['currentDatabase'] = undefined;
      }
      log = []
    }
    newState['clusters'] = clusters;
    newState['log'] = log;
    if (!newState.currentDatabase && Object.keys(clusters).length > 0) {
      newState.currentDatabase = Object.keys(clusters)[0]
    }
    this.setState(newState);
    console.log(this.state)
  };

  handleOpen = () => {
    //this.websocket.sendMessage(JSON.stringify({cmd: "detail", key: "crdb/crdb-test"}))
  };

  termOpen = (event, data) => {
      if (data.activeIndex === 2) {
        this.term = new Terminal();
        this.term.open(document.getElementById('terminal'));
        this.term.write('Hello from react');
      } else if (this.term) {
        this.term.dispose();
      }
  };

  selectDatabase = (name) => {
    this.websocket.sendMessage(JSON.stringify({cmd: "detail", key: name}));
    this.setState({ currentDatabase: name})
  };

  componentDidMount() {
    Terminal.applyAddon(fullScreen);
  }


  render() {

    let { clusters, currentDatabase, log } = this.state;
    let nodes = [];
    if (currentDatabase && clusters[currentDatabase]['status']['nodes']) {
      nodes = clusters[currentDatabase]['status']['nodes']
    }

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
        <Grid celled style={{height: '95vh'}}>
          <Grid.Column width={2} textAlign="left">
            <Header as="h2">
              Clusters
            </Header>
            {Object.keys(clusters).map((item, index) => (
              <Label as='a' color='blue' key={index} onClick={() => this.selectDatabase(item)} image>
                <Icon name="bolt"/>
                {item.split('/')[0]}
                <Label.Detail>{item.split('/')[1]}</Label.Detail>
              </Label>
            ))}
          </Grid.Column>
          <Grid.Column width={14}>
            <Grid.Row style={{height: '70%'}}>
              <Header as="h2">
                {currentDatabase}
              </Header>
              {nodes.length > 0 ? nodes.map((item, index) => (<p key={index}>{item.name}</p>)) : (<p/>) }
              <br/>
            </Grid.Row>
            <Grid.Row style={{height: '30%'}}>
              <Segment.Group style={{height: '100%'}}>
                <Segment>
                  <Button compact size='small' floated='right' onClick={this.clearLog}>
                    Clear
                  </Button>
                  Event Log <Label circular>{log.length}</Label>
                </Segment>
                <Segment secondary style={{ overflow: 'auto', maxHeight: '70%'}} hidden={log.length === 0}>
                  <pre>{log.map((e, i) => <div key={i}>{e}</div>)}</pre>
                </Segment>
              </Segment.Group>
            </Grid.Row>
          </Grid.Column>
        </Grid>
        <Websocket url='ws://localhost:8080/ws' onMessage={this.handleData} onOpen={this.handleOpen} ref={(Websocket) => {this.websocket = Websocket}}/>
      </div>
    );
  }
}

export default App;
