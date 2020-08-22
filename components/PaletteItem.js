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

type Props = {
  setSelectedColor: (color?: string) => *,
  isSelected: boolean,
  paletteItem: Object,
  palette: string,
  overrideColor?: string,
  fullPalette: Array<Object>,
};

type State = {
  paletteItem: Object,
};
export default class PaletteItem extends React.PureComponent<Props, State> {
  componentDidMount = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      paletteItem: props.paletteItem,
    };
  }

  render = () => {
    let {overrideColor} = this.props;
    let {paletteItem} = this.state;
    return (
      <Pressable onPress={this.toggleColor}>
        <View
          style={[
            styles.paletteItem,
            this.props.isSelected ? styles.selected : undefined,
            {
              ...this.getBorderRadius(),
              height: this.getHeight(),
              backgroundColor:
                this.props.isSelected && overrideColor
                  ? overrideColor
                  : paletteItem.color,
            },
          ]}>
          {this.props.isSelected ? (
            <Text style={styles.colorName}>{paletteItem.prettyName}</Text>
          ) : (
            <View />
          )}
        </View>
      </Pressable>
    );
  };

  getBorderRadius = () => {
    let {fullPalette, index} = this.props;
    if (index === 0) {
      return {borderTopLeftRadius: 50, borderTopRightRadius: 50};
    }
    if (fullPalette.length - 1 === index) {
      return {borderBottomLeftRadius: 50, borderBottomRightRadius: 50};
    }
  };

  getHeight = () => {
    let {paletteItem} = this.props;
    let val = 600 * paletteItem.percentage;
    return val > 40 ? val : 40;
  };

  toggleColor = () => {
    let {isSelected, paletteItem, setSelectedColor, overrideColor} = this.props;
    if (isSelected) {
      paletteItem = {...paletteItem, color: overrideColor};
      this.setState({paletteItem});
      return setSelectedColor(undefined);
    }
    setSelectedColor(paletteItem.color);
  };
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
  selected: {
    borderWidth: 4,
    borderColor: 'black',
  },
});
