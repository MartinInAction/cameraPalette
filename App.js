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
  PanResponder,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Palette from 'react-native-palette-full';
import PaletteItem from './components/PaletteItem';
import ShareButton from './components/ShareButton';
import getColorNames from './libs/getColorNames';
import GetPixelColor from 'react-native-get-pixel-color';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let CAPTURE_INTERVAL;
export default class App extends React.PureComponent<{}> {
  cameraRef: ?Object;
  _panResponder = {};

  state = {
    imageSource: undefined,
    palette: [],
    liveModeActive: false,
    cameraButtonScale: new Animated.Value(1),
    selectedColor: undefined,
    colorPickerPlacement: new Animated.ValueXY({
      x: windowWidth / 2 - 20,
      y: windowHeight - 200,
    }),
    overrideColor: undefined,
  };

  constructor(props: Object) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e: Object, gs: Object) => true,
      onPanResponderMove: (e, gs) => {
        this.state.colorPickerPlacement.setValue({
          x: gs.moveX - 15,
          y: gs.moveY - 15,
        });
        this.getColorOfPixel(gs.moveX, gs.moveY).then((color) => {
          this.setState({overrideColor: color});
        });
      },
    });
  }

  render = () => {
    let showPreview = this.state.imageSource && !this.state.liveModeActive;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {showPreview ? this.renderPreview() : this.renderCamera()}
        {showPreview ? <ShareButton palette={this.state.palette} /> : <View />}
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
        {this.renderColorPicker()}
        <Pressable style={styles.xButton} hitSlop={20} onPress={this.reset}>
          <Image
            style={styles.xButtonImage}
            source={require('./assets/images/redoButton.png')}
          />
        </Pressable>
      </View>
    );
  };

  renderColorPicker = () => {
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[styles.box, this.state.colorPickerPlacement.getLayout()]}
      />
    );
  };

  renderCamera = () => {
    return (
      <RNCamera
        captureAudio={false}
        skipProcessing
        playSoundOnCapture={false}
        ref={this.setRef}
        aspect="fill"
        captureTarget="temp"
        orientation="portrait"
        ratio="1:1"
        camera2api={true}
        notAuthorizedView={<View />}
        pendingAuthorizationView={undefined}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}>
        {this.renderCameraButton()}
        {this.state.liveModeActive ? this.renderPalette() : <View />}
      </RNCamera>
    );
  };

  renderCameraButton = () => {
    // onLongPress={this.startLiveMode}
    return (
      <Pressable
        onPressOut={this.disableLiveMode}
        onPress={this.testImageFromURL}
        style={styles.cameraButton}>
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

  takePhotoAndGetPalette = (shouldSetImageSource?: boolean) => {
    if (!this.cameraRef) {
      return;
    }
    const options = {mute: true, quality: 1, mirrorImage: false};
    this.cameraRef
      .takePictureAsync(options)
      .then((data) => {
        !shouldSetImageSource
          ? undefined
          : this.setState({imageSource: data.uri});
        return this.getPalette(data.uri);
      })
      .catch(() => {});
  };

  startLiveMode = () => {
    this.setState({liveModeActive: true});
    CAPTURE_INTERVAL = setInterval(() => {
      return this.takePhotoAndGetPalette(false);
    }, 1000);
  };

  disableLiveMode = () => {
    this.setState({liveModeActive: false});
    clearInterval(CAPTURE_INTERVAL);
    CAPTURE_INTERVAL = undefined;
  };

  testImageFromURL = () => {
    let URI =
      'https://i.pinimg.com/originals/3b/9c/ed/3b9ced311ae23b3aa0ac5ee9819322dc.jpg';
    this.setState({
      imageSource: URI,
    });
    return this.getPalette(URI);
  };

  getPalette = (uri: string) => {
    GetPixelColor.setImage(uri).catch((error) => {
      console.log(error);
    });
    return Palette.getAllSwatchesFromUrl(uri).then((palette) => {
      palette = this.uniqueArray(palette, (x) => x.color);
      palette = palette.sort((a, b) => b.percentage - a.percentage);
      console.log(palette);
      let colors = palette.map((paletteItem) => paletteItem.color);
      getColorNames(colors)
        .then((colorNames) => {
          return palette.map((paletteItem, index) => ({
            ...paletteItem,
            prettyName: colorNames.colors[index].name,
          }));
        })
        .then((res) => this.setState({palette: res}));
    });
  };

  uniqueArray = (array, keyFn): Array<Object> => {
    let mySet = new Set();
    if (!array) {
      return [];
    }
    return array
      .reverse()
      .filter((x) => {
        let key = keyFn(x);
        if (!key) {
          return false;
        }
        let isNew = !mySet.has(key);
        if (isNew) {
          mySet.add(key);
        }
        return isNew;
      })
      .reverse();
  };

  renderPalette = () => {
    let {selectedColor, overrideColor} = this.state;
    return (
      <View style={styles.paletteContainer}>
        {this.state.palette.map((paletteItem: Object, index: number) => (
          <PaletteItem
            overrideColor={overrideColor}
            isSelected={paletteItem.color === selectedColor}
            setSelectedColor={this.setSelectedColor}
            fullPalette={this.state.palette}
            paletteItem={paletteItem}
            index={index}
            key={index}
          />
        ))}
      </View>
    );
  };

  getColorOfPixel = (x: number, y: number) => {
    return GetPixelColor.pickColorAt(x, y).catch((error) => {
      console.log(error);
    });
  };

  setSelectedColor = (color?: string) => {
    this.setState({selectedColor: color});
  };

  reset = () => {
    this.setState({palette: [], imageSource: undefined});
    this.setSelectedColor(undefined);
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
    borderRadius: 20,
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
  box: {
    position: 'absolute',
    height: 30,
    backgroundColor: 'white',
    opacity: 0.4,
    width: 30,
    borderRadius: 100 / 2,
  },
});
