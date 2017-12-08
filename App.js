import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Dimensions } from 'react-native';
import { Peer, RemoteVideo, LocalVideo } from 'react-native-skyway';

const PEER_ID = 'SET_PEER_ID_A';
const CALLEE_PEER_ID = 'SET_PEER_ID_B';
const options = {
  key: 'YOUR_API_KEY',
  domain: 'localhost',
  debug: 3
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.onPressCall = this.onPressCall.bind(this);
    this.onPeerOpen = this.onPeerOpen.bind(this);
    this.onPeerClose = this.onPeerClose.bind(this);
    this.onPeerCall = this.onPeerCall.bind(this);
    this.onPeerError = this.onPeerError.bind(this);
    this.onMediaConnectionError = this.onMediaConnectionError.bind(this);
    this.onMediaConnectionClose = this.onMediaConnectionClose.bind(this);

    this.state = {
      peer: null,
      open: false,
    };
  }

  componentDidMount() {
    const peer = new Peer(PEER_ID, options);
    peer.connect();

    peer.addEventListener('peer-open', this.onPeerOpen);
    peer.addEventListener('peer-close', this.onPeerClose);
    peer.addEventListener('peer-call', this.onPeerCall);
    peer.addEventListener('peer-error', this.onPeerError);
    peer.addEventListener('media-connection-close', this.onMediaConnectionClose);
    peer.addEventListener('media-connection-error', this.onMediaConnectionError);

    this.setState({ peer });
  }

  componentWillUnmount() {
    this.dispose();
  }

  dispose() {
    if (this.state.peer) {
      this.state.peer.dispose();
      this.state.peer.removeEventListener('peer-open', this.onPeerOpen);
      this.state.peer.removeEventListener('peer-close', this.onPeerClose);
      this.state.peer.removeEventListener('peer-call', this.onPeerCall);
      this.state.peer.removeEventListener('peer-error', this.onPeerError);
      this.state.peer.removeEventListener('media-connection-close', this.onMediaConnectionClose);
      this.state.peer.removeEventListener('media-connection-error', this.onMediaConnectionError);
      this.setState({peer: null, open: false});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.remoteVideoFrame}>
          <RemoteVideo style={styles.remoteVideo} peer={this.state.peer} />
        </View>
        <View style={styles.localVideoFrame}>
          <LocalVideo style={styles.localVideo} peer={this.state.peer} />
        </View>
        <TouchableHighlight underlayColor='rgba(0,0,0,0)' onPress={this.onPressCall} style={styles.callButton}>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableHighlight>
      </View>
    );
  }

  onPressCall() {
    if (this.state.open) {
      this.state.peer.call(CALLEE_PEER_ID);
    }
  }

  onPeerOpen() {
    this.setState({open: true});
  }

  onPeerError() {
    this.dispose();
  }

  onPeerClose() {
    this.dispose();
  }

  onPeerCall() {
    if (this.state.open) {
      this.state.peer.answer();
    }
  }

  onMediaConnectionError() {
    this.dispose();
  }

  onMediaConnectionClose() {
    this.dispose();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localVideoFrame: {
    position: 'absolute',
    width: 100,
    height: 100 * 1.3333,
    bottom: 10,
    right: 10,
  },
  localVideo: {
    flex: 1,
  },
  remoteVideoFrame: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
  },
  remoteVideo: {
    flex: 1,
  },
  callButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#03a9f4',
  },
  callButtonText: {
    color: '#ffffff',
  }

});
