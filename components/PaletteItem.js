/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Platform,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class PaletteItem extends React.PureComponent<{}> {
  state = {
    showName: false,
  };

  componentDidMount = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  render = () => {
    let {paletteItem} = this.props;
    return (
      <Pressable onPressIn={this.showName} onPressOut={this.hideName}>
        <View
          style={[
            styles.paletteItem,
            {
              ...this.getBorderRadius(),
              height: this.getHeight(),
              backgroundColor: paletteItem.color,
            },
          ]}>
          {this.state.showName ? (
            <Text style={styles.colorName}>{paletteItem.prettyName}</Text>
          ) : (
            <View />
          )}
        </View>
      </Pressable>
    );
  };

  getBorderRadius = () => {
    let {palette, index} = this.props;
    if (index === 0) {
      return {borderTopLeftRadius: 50, borderTopRightRadius: 50};
    }
    if (palette.length - 1 === index) {
      return {borderBottomLeftRadius: 50, borderBottomRightRadius: 50};
    }
  };

  getHeight = () => {
    let {paletteItem} = this.props;
    let val = 600 * paletteItem.percentage;
    return val > 40 ? val : 40;
  };

  showName = () => this.setState({showName: true});

  hideName = () => this.setState({showName: false});
}

const styles = StyleSheet.create({
  paletteItem: {
    marginLeft: 20,
    height: 50,
    width: 50,
    justifyContent: 'center',
  },
  colorName: {
    width: 200,
    left: 60,
    alignSelf: 'center',
    position: 'absolute',
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
});
