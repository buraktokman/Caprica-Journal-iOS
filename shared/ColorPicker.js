import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  SlidersColorPicker,
  HueGradient,
  SaturationGradient,
  LightnessGradient,
  HueSlider,
  SaturationSlider,
  LightnessSlider,
} from 'react-native-color';
import tinycolor from 'tinycolor2';

export default class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: tinycolor(this.props.color).toHsl(), //tinycolor('#70c1b3').toHsl(),
    };
  }

  // ------------ HANDLER --------------

  updateHue = (h) => {
    this.setState({color: {...this.state.color, h}});
    this.props.handlerChangeColor(tinycolor(this.state.color).toHexString());
  };
  updateSaturation = (s) => {
    this.setState({color: {...this.state.color, s}});
    this.props.handlerChangeColor(tinycolor(this.state.color).toHexString());
  };
  updateLightness = (l) => {
    this.setState({color: {...this.state.color, l}});
    this.props.handlerChangeColor(tinycolor(this.state.color).toHexString());
  };

  // ------------ HANDLER --------------

  componentDidMount() {
    this.setState({color: tinycolor(this.props.color).toHsl()});
    // this.props.handlerChangeColor(tinycolor(this.props.color).toHexString());
  }

  render() {
    const {style} = this.props;
    const overlayTextColor = tinycolor(this.state.color).isDark()
      ? '#FAFAFA'
      : '#222';
    return (
      <View style={[styles.container, style]}>
        <ScrollView contentContainerStyle={styles.content}>
          <HueSlider
            style={styles.sliderRow}
            gradientSteps={40}
            value={this.state.color.h}
            onValueChange={this.updateHue}
          />
          <LightnessSlider
            style={styles.sliderRow}
            gradientSteps={20}
            value={this.state.color.l}
            color={this.state.color}
            onValueChange={this.updateLightness}
          />
          <SaturationSlider
            style={styles.sliderRow}
            gradientSteps={20}
            value={this.state.color.s}
            color={this.state.color}
            onValueChange={this.updateSaturation}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  sliderRow: {
    alignSelf: 'stretch',
    marginLeft: 12,
    marginTop: 12,
  },
});
