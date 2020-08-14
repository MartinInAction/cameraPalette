/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Pressable,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Palette from 'react-native-palette-full';
import PaletteItem from './components/PaletteItem';
import ShareButton from './components/ShareButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class App extends React.PureComponent<{}> {
  cameraRef: ?Object;

  state = {
    imageSource: undefined,
    palette: [],
    cameraButtonScale: new Animated.Value(1),
  };

  render = () => {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.imageSource ? this.renderPreview() : this.renderCamera()}
        {this.state.imageSource ? (
          <ShareButton palette={this.state.palette} />
        ) : (
          <View />
        )}
      </View>
    );
  };

  renderPreview = () => {
    return (
      <View style={styles.previewContainer}>
        <Image
          style={styles.previewImage}
          source={{uri: this.state.imageSource}}
        />
        {this.renderPalette()}
        <Pressable style={styles.xButton} hitSlop={20} onPress={this.reset}>
          <Image
            style={styles.xButtonImage}
            source={require('./assets/images/redoButton.png')}
          />
        </Pressable>
      </View>
    );
  };

  renderCamera = () => {
    return (
      <RNCamera
        captureAudio={false}
        skipProcessing
        ref={this.setRef}
        aspect="fill"
        captureTarget="temp"
        orientation="portrait"
        ratio="1:1"
        notAuthorizedView={<View />}
        pendingAuthorizationView={undefined}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}>
        {this.renderCameraButton()}
      </RNCamera>
    );
  };

  renderCameraButton = () => {
    return (
      <Pressable onPress={this.testImageFromURL} style={styles.cameraButton}>
        <View style={styles.outerCameraButton}>
          <Animated.View
            style={[
              styles.innerCameraButton,
              {transform: [{scale: this.state.cameraButtonScale}]},
            ]}
          />
        </View>
      </Pressable>
    );
  };

  generateColorsFromImage = () => {
    if (!this.cameraRef) {
      return;
    }
    const options = {quality: 1, mirrorImage: false};
    this.cameraRef
      .takePictureAsync(options)
      .then((data) => {
        this.setState({imageSource: data.uri});
        return this.getPalette(data.uri);
      })
      .catch(() => {});
  };

  testImageFromURL = () => {
    let URI = 'http://donapr.com/wp-content/uploads/2016/03/RRUe0Mo.png';
    this.setState({
      imageSource: URI,
    });
    return this.getPalette(URI);
  };

  getPalette = (uri: string) => {
    return Palette.getAllSwatchesFromUrl(uri).then((palette) => {
      this.setState({palette});
    });
  };

  renderPalette = () => {
    return (
      <View style={styles.paletteContainer}>
        {this.state.palette.map((paletteItem: Object, index: number) => (
          <PaletteItem paletteItem={paletteItem} key={index} />
        ))}
      </View>
    );
  };

  reset = () => {
    this.setState({imageSource: undefined});
  };

  scaleCameraButtonIn = () => {
    let {cameraButtonScale} = this.state;
    Animated.timing(cameraButtonScale, {toValue: 0.8}).start();
  };

  scaleCameraButtonOut = () => {
    let {cameraButtonScale} = this.state;
    Animated.timing(cameraButtonScale, {toValue: 1}).start();
  };

  setRef = (cam: *) => (this.cameraRef = cam);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButton: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 20,
  },
  outerCameraButton: {
    borderRadius: 150 / 2,
    borderWidth: 5,
    borderColor: '#fff',
    height: 65,
    width: 65,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCameraButton: {
    borderRadius: 150 / 2,
    height: 50,
    width: 50,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
  },
  paletteContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  previewImage: {
    flex: 1,
    backgroundColor: '#000',
    resizeMode: 'contain',
    height: windowHeight,
    width: windowWidth,
  },
  paletteItem: {
    margin: 10,
    marginLeft: 20,
    height: 80,
    width: 100,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'flex-end',
  },
  colorTextContainer: {
    width: 120,
    left: -10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  colorText: {
    color: '#fff',
    fontSize: 10,
  },
  xButton: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 20,
  },
  xButtonImage: {
    height: 60,
    width: 60,
  },
  colorName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
});
