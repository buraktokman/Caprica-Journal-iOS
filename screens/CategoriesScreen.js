import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {SwipeListView} from 'react-native-swipe-list-view';

import Logo from '../res/ico/caprica-icon-white.svg';
import ModalCategory from './ModalCategory';
import TitleScreen from '../shared/TitleScreen';
import BarSearchSort from '../shared/BarSearchSort';
import ButtonNew from '../shared/ButtonNew';
import {globalStyles, colors} from '../src/styles';
import {LightenDarkenColor, trimString, ordinal_suffix_of} from '../src/utils';

@inject('store')
@observer
class CategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'count', // 'alpha
      searchText: '',
      showModal: false,
    };
    this.navigation = props.navigation;
  }

  // ------ HANDLER ---------------------

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal});
  };
  handlerSearch = (text) => {
    this.setState({searchText: text});
  };
  handlerSort = async () => {
    if (this.state.sortBy === 'count') {
      this.sortCategoriesByAlpha();
    } else {
      this.sortCategoriesByCount();
    }
  };

  // ------ SORT ---------------------

  sortCategoriesByAlpha = () => {
    console.log(`handler > sort by > alpha`);
    this.setState({sortBy: 'alpha'});
    this.props.store.sortCategoriesByAlpha();
  };

  sortCategoriesByCount = () => {
    console.log(`handler > sort by > count`);
    this.setState({sortBy: 'count'});
    this.props.store.sortCategoriesByCount();
  };

  // ------- FLATLIST -------------
  renderHeader = () => (
    <BarSearchSort
      showSort={true}
      style={{marginTop: 19, marginBottom: 23.5}}
      handlerSearch={this.handlerSearch}
      handlerSort={this.handlerSort}
    />
  );

  renderItem = ({item, index}) => {
    const {searchText, sortBy} = this.state;
    const {entries} = this.props.store;

    // Show only searched categories
    if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
      // Get entry count of category
      const entryCount = entries.filter(function (itemEntry) {
        return itemEntry.category === item.id;
      }).length;
      // Get Entries of this category
      const categoryEntries = entries.filter(function (itemEntry) {
        if (itemEntry.category === item.id) {
          return itemEntry;
        }
      });

      // Index Number
      const indexTemp = sortBy === 'count' ? index : -1; //entries.length - index - 2;

      // Show Category Component
      return (
        <CategoryRow
          index={indexTemp}
          categoryData={item}
          categoryEntries={categoryEntries}
          entryCount={entryCount}
          navigation={this.navigation}
          handlerEditCategory={this.props.store.handlerEditCategory}
          handlerDelCategory={this.props.store.handlerDelCategory}
        />
      );
    }
  };

  // ------- LIFE -----------------

  componentDidMount() {
    // Sort Categories
    this.sortCategoriesByCount();
  }

  render() {
    const {sortBy, showModal} = this.state;
    const {categories} = this.props.store;

    console.log(`categories > initiated`);
    // categories.map((item) => {
    //   console.log(`categories > cat > ${JSON.stringify(item)}`);
    // });

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <TitleScreen title="All Categories" />
        <View style={styles.flatList}>
          <FlatList
            keyboardDismissMode="on-drag"
            keyExtractor={(item) => item.id}
            initialNumToRender={16}
            extraData={this.props.store.categories}
            data={categories}
            ListHeaderComponent={this.renderHeader}
            renderItem={({item, index}) => this.renderItem({item, index})}
          />
        </View>
        <ButtonNew type="category" toggleModal={this.toggleModal} />
        <Modal
          isVisible={showModal}
          style={globalStyles.entryModal}
          animationInTiming={100}
          // hideModalContentWhileAnimating={true}
        >
          <ModalCategory
            handlerAddCategory={this.props.store.handlerAddCategory}
            toggleModal={this.toggleModal}
          />
        </Modal>
      </View>
    );
  }
}

class CategoryRow extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {id, name, color, icon} = this.props.categoryData;
    const {handlerEditCategory, categoryEntries, index} = this.props;
    // Trim Str
    const categoryName = trimString(name, 18);
    // Weight
    const fontWeight =
      index === 0 ? '700' : index === 1 ? '600' : index === 2 ? '500' : '400';
    // Gradient Colors
    const gradientColors = [
      LightenDarkenColor(color, -5),
      color,
      color,
      color,
      LightenDarkenColor(color, -8),
    ];
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          this.props.navigation.navigate('Category', {
            id: id,
            category: name,
            color: color,
            icon: icon,
            entries: categoryEntries,
            handlerEditCategory: handlerEditCategory,
          })
        }
        style={styles.categoryRow}>
        <LinearGradient colors={gradientColors} style={[styles.categoryBadge]}>
          {id === 'Caprica' ? (
            <SvgXml width="32" height="32" xml={Logo} />
          ) : (
            <Text style={styles.categoryBadgeIcon}>{icon}</Text>
          )}
        </LinearGradient>
        <View style={styles.columnRight}>
          <View style={styles.columnName}>
            <Text
              style={[
                styles.categoryTitle,
                {color: LightenDarkenColor(color, -10)},
              ]}>
              {categoryName}
            </Text>
            <Text style={styles.categoryDot}>{index !== -1 ? '•' : null}</Text>
            <Text style={[styles.categoryPlace, {fontWeight: fontWeight}]}>
              {index !== -1 ? ordinal_suffix_of(index + 1) : null}
            </Text>
          </View>
          <View style={styles.columnItemCount}>
            <Text style={styles.categoryItemCount}>
              {this.props.entryCount}
            </Text>
          </View>
          <View style={styles.goCategory}>
            <Ionicons name={'ios-arrow-forward'} size={16} color="#AAB8C2" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'flex-start',
  },
  flatList: {
    // marginTop: 33.5,
    flex: 1,
  },
  columnRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    height: '105%',
    borderColor: '#CCD5DD',
    borderBottomWidth: 0.5,
  },
  columnName: {
    // backgroundColor: 'pink',
    textAlignVertical: 'bottom',
    flexDirection: 'row',
    height: 20,
  },
  columnItemCount: {
    flex: 1,
    alignItems: 'flex-end',
  },
  categoryRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    // height: 60,
    paddingLeft: 15,
    paddingBottom: 6,
  },
  categoryTitle: {
    fontSize: 15.5,
    fontWeight: '500',
    color: colors.black,
    letterSpacing: -0.26,
  },
  categoryDot: {
    textAlign: 'justify',
    lineHeight: 20.5,
    fontSize: 10,
    fontWeight: '500',
    color: '#657786',
    marginHorizontal: 6,
  },
  categoryBadge: {
    backgroundColor: 'black',
    height: 42,
    width: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadgeIcon: {
    fontSize: 32,
  },
  categoryPlace: {
    textAlign: 'justify',
    lineHeight: 20.5,
    fontSize: 13,
    fontWeight: '500',
    color: '#657786',
    letterSpacing: -0.26,
  },
  categoryItemCount: {
    fontSize: 13.5,
    color: colors.black,
    marginRight: 11.5,
    letterSpacing: -0.37,
  },
  goCategory: {
    marginRight: 9.5,
  },
  goCategoryText: {
    color: '#AAB8C2',
  },
});
