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
  Text,
  StatusBar,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImageColors from 'react-native-image-colors';

import colorSort from 'color-sorter';
import hexToRgba from 'hex-to-rgba';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class App extends React.PureComponent<{}> {
  state = {
    imageSource: undefined,
    palette: [],
  };
  render = () => {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {this.state.imageSource ? this.renderPreview() : this.renderCamera()}
        <Pressable style={styles.xButton} onPress={this.reset}>
          <Text style={styles.xButtonText}>X</Text>
        </Pressable>
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
        <Pressable onPress={this.testImageFromURL} style={styles.cameraButton}>
          <View style={styles.outerCameraButton}>
            <View style={styles.innerCameraButton} />
          </View>
        </Pressable>
      </RNCamera>
    );
  };

  generateColorsFromImage = () => {};

  testImageFromURL = () => {
    let URI = 'http://donapr.com/wp-content/uploads/2016/03/RRUe0Mo.png';
    this.setState({
      imageSource: URI,
    });
    return this.getPalette(URI).then((res) => {
      let {background, primary, secondary, detail} = res;
      let colors = [background, primary, secondary, detail];
      let sortedColors = colors.sort(colorSort.sortFn).reverse();
      this.setState({palette: sortedColors});
    });
  };

  getPalette = (uri: string, config?: Object) => {
    this.setState({imageSource: uri});
    return ImageColors.getColors(uri, config);
  };

  renderPalette = () => {
    return (
      <View style={styles.paletteContainer}>
        {this.state.palette.map((color: string, index: number) => {
          return (
            <View
              style={[styles.paletteItem, {backgroundColor: color}]}
              key={index}>
              <View style={styles.colorTextContainer}>
                <Text style={styles.colorText}>{color}</Text>
                <Text style={styles.colorText}>{hexToRgba(color)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  reset = () => {
    this.setState({imageSource: undefined});
  };
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
    backgroundColor: '#000',
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
    margin: 20,
    height: 100,
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
    top: 20,
    right: 20,
  },
  xButtonText: {
    color: '#fff',
  },
});
