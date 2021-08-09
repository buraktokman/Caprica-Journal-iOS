import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  PickerIOSComponent,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {observer, inject} from 'mobx-react';
// import {BlurView} from 'expo-blur';

import TimelineHeader from '../shared/TimelineHeader';
import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';

@inject('store')
@observer
class BarCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'all',
      entries: [],
      categories: [],
      // categories: this.props.categories, // [{name: 'All', color: colors.blue}]
    };
  }

  // ------- HANDLER --------------

  handlerSelected = (item) => {
    const vibration = this.props.store.settings.vibration;
    // Vibrate
    vibration && haptic('impactLight');
    // Filter of Props
    this.props.handlerFilterByCategory(item.name);
    // Set
    this.setState({selected: item.name});
  };

  // ------ UTIL ------–-----------

  sortCategoriesByCount = () => {
    const {categories, entries} = this.props;
    // Get entry count of category
    for (let i = 0; i < categories.length; i++) {
      const entryCount = entries.filter(function (itemEntry) {
        return (
          itemEntry.category === categories[i].name
          // && itemEntry.date.toDateString() === new Date().toDateString()
        );
      }).length;
      categories[i].count = entryCount;
    }
    // Sort by entry count
    // console.log(`bar categories > handler > sort by > count`);
    this.setState({
      sortBy: 'count',
      categories: categories.slice().sort((a, b) => b.count - a.count),
    });
  };
  // // Filter Categories + by Date
  //   var filteredEntries = entries.filter(function (item) {
  //     if (
  //       item.content.toLowerCase().includes(searchText.toLowerCase()) &&
  //       (filter === 'All' || filter === item.category) &&
  //       item.date.toDateString() === selectedDate.toDateString()
  //     ) {
  //       return item;
  //     }
  //   });

  // ------- LIFE -----------------

  async componentDidMount() {
    await this.setState({
      categories: this.props.categories,
      entries: this.props.entries,
      selected: this.props.selected,
    });
    // Order Categories
    this.sortCategoriesByCount();
  }
  async componentWillReceiveProps() {
    // console.log('bar categories > new props received');
    // this.state.entries.map((item) => {
    //   console.log(item);
    // });
    await this.setState({
      categories: this.props.categories,
      entries: this.props.entries,
      selected: this.props.selected,
    });
    // Order Categories
    this.sortCategoriesByCount();
  }

  // shouldComponentUpdate(nextProps) {
  //   // Update category bar if new props received
  //   if (this.props.entries !== nextProps.entries) {
  //     this.setState({
  //       categories: this.props.categories,
  //       entries: this.props.entries,
  //       selected: this.props.selected,
  //     });
  //     // Order Categories
  //     this.sortCategoriesByCount();
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    var {selected, style, showCaprica} = this.props;
    var {categories, entries} = this.state;
    const vibration = this.props.store.settings.vibration;

    // entries.map((item) => {
    //   console.log(item);
    // });
    const all = {name: 'All', color: colors.blue};
    categories = [all, ...categories];

    return (
      <View style={[styles.container, style]}>
        <FlatList
          horizontal
          style={styles.flatList}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => String(index) /*item.id*/}
          data={categories}
          extraData={this.state.categories}
          ListHeaderComponent={() => {
            return showCaprica ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this.handlerSelected(all);
                }}>
                <TimelineHeader title="Caprica" style={{marginRight: 9.75}} />
              </TouchableOpacity>
            ) : null;
          }}
          ListFooterComponent={() => {
            return <View style={{width: 20}} />;
          }}
          renderItem={({item, index}) => {
            // Check if category selected
            const select = item.name === selected ? true : false;
            return (
              <BarCategory
                category={item}
                selected={select}
                onPress={(val) => this.handlerSelected(val)}
              />
            );
          }}
        />
      </View>
    );
  }
}

export default BarCategories;

class BarCategory extends Component {
  constructor(props) {
    super(props);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.selected !== nextProps.selected) {
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    const {category, selected, onPress} = this.props;

    // Select Tab Color
    const selectedStyle = selected
      ? {
          borderBottomColor: category.color,
          borderBottomWidth: 2,
        }
      : {};
    // Show Active Tab
    const tabColor = selected ? {color: category.color} : {};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          onPress(category);
        }}
        style={[styles.tab, selectedStyle]}>
        <Text style={[styles.tabText, tabColor]}>{category.name}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    width: '100%',
    // borderBottomWidth: 0.5,
    // borderBottomColor: '#BBC6CE',
    backgroundColor: 'white',
    // opacity: 0.7,
    // backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  tabText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#657786',
    // letterSpacing: -0.26,
  },
  tab: {
    // width: 50,
    // marginHorizontal: 16,
    marginRight: 13.25,
    // paddingRight: 0.75,
    paddingVertical: 10,
  },
  flatList: {
    // backgroundColor: 'pink',
    // width: '100%',
    position: 'absolute',
    bottom: 0,
    // zIndex: 1,
    paddingLeft: 24, // 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#BBC6CE',
  },
});
