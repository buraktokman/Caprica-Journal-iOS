import React, {PureComponent, Component} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {observer, inject} from 'mobx-react';

import {haptic} from '../src/vibrate';
import {textColor, trimString, LightenDarkenColor} from '../src/utils';
import BarSearchSort from './BarSearchSort';
import EntryNotFound from '../shared/EntryNotFound';
import NewEntryCategory from '../shared/NewEntryCategory';

@inject('store')
@observer
class NewEntrySelectCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      selected: this.props.selected,
    };
  }

  // -------- HANDLER -------------

  handlerSelected = (val) => {
    this.setState({selected: val});
  };
  handlerSearch = (text) => {
    this.setState({searchText: text});
  };
  onCategorySelect = (item) => {
    const vibration = this.props.store.settings.vibration;

    vibration && haptic('impactLight');
    this.props.handlerCategory(item);
    this.handlerSelected(item.name);
  };

  // ------- FLATLIST -------------

  renderHeader = () => (
    <BarSearchSort
      placeholder="Search Category"
      showSort={false}
      handlerSearch={this.handlerSearch}
      style={{marginTop: 11, marginBottom: 13}}
    />
  );

  renderItem = ({item, index}) => {
    const {selected} = this.props;
    var select = item.name === selected ? true : false;

    return (
      <NewEntryCategory
        category={item}
        selectedCategory={selected}
        select={select}
        onPress={() => this.onCategorySelect(item)}
      />
    );
  };

  renderEmpty = () => {
    return <EntryNotFound title="Sorry, I couldn't find this category" />;
  };

  // ------- LIFE -----------------

  componentDidMount() {
    // this.sortCategoriesByCount();
  }

  render() {
    const {categories, selected} = this.props;
    const {searchText} = this.state;

    // Filter by Search & Ignore 'Caprica' cat.
    let filteredCategories = categories.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchText.toLowerCase()) &&
        item.name !== 'Caprica'
      );
    });

    return (
      <View style={styles.container}>
        <FlatList
          // contentOffset={{y: 50}}
          style={styles.flatList}
          initialNumToRender={16}
          numColumns={2}
          keyExtractor={(item) => item.name}
          data={filteredCategories}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={this.renderEmpty}
          renderItem={({item, index}) => this.renderItem({item, index})}
        />
      </View>
    );
  }
}

export default NewEntrySelectCategory;

const styles = StyleSheet.create({
  container: {
    width: 300,
    // backgroundColor: 'pink'
  },
  flatList: {
    // width: '100%',
    // flexWrap: 'wrap',
  },
  categoryRow: {
    // backgroundColor: 'red',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 6,
    width: 140,
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
