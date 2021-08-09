import React, {Component, PureComponent} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import {textColor, trimString, LightenDarkenColor} from '../src/utils';

export default class Category extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.select ||
      this.props.category.name === nextProps.selectedCategory ||
      this.props.updateComponent
    ) {
      return true;
    }
    // if (this.state.count !== nextState.count) {
    //   return true;
    // }
    return false;
  }

  render() {
    const {category, select, style, onPress} = this.props;
    var {name, icon, color} = category;

    // console.log(name + ' --> ' + select)

    // Selected - BackgroundColor
    var bgColor = select ? color : 'white';
    // Selected - Name Color
    var colorCategoryName = select
      ? textColor(color)
      : LightenDarkenColor(color, -10);
    // Selected - Name Weight
    var textWeight = select ? {fontWeight: '400'} : {};
    // Trim Str
    var categoryName = trimString(name, 10);
    var gradientColorsBadge = [
      LightenDarkenColor(bgColor, 5),
      bgColor,
      // bgColor,
      // bgColor,
      LightenDarkenColor(bgColor, -5),
    ];
    var gradientColorsRow = [
      LightenDarkenColor(color, 5),
      color,
      color,
      color,
      LightenDarkenColor(color, -5),
    ];

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress()}>
        <LinearGradient
          style={[styles.categoryRow, style]}
          colors={gradientColorsBadge}>
          <LinearGradient
            colors={gradientColorsRow}
            style={[styles.categoryIcon, {backgroundColor: color}]}>
            <Text style={styles.iconText}>{icon}</Text>
          </LinearGradient>
          <View style={styles.categoryName}>
            <Text
              style={[
                styles.categoryNameText,
                {color: colorCategoryName},
                textWeight,
              ]}>
              {categoryName}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 8,
    minWidth: 140,
    borderRadius: 8,
  },
  categoryIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 23.5,
  },
  categoryName: {
    marginLeft: 6,
  },
  categoryNameText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.36,
  },
});
