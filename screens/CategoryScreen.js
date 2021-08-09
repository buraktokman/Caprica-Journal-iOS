import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  View,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';

import Logo from '../res/ico/caprica-icon-white.svg';
import ActionSheetEntry from '../shared/ActionSheetEntry';
import BarSearchSort from '../shared/BarSearchSort';
import ScreenHeader from '../shared/ScreenHeader';
import ModalCategory from '../screens/ModalCategory';
import EntryNotFound from '../shared/EntryNotFound';
import {LightenDarkenColor, textColor} from '../src/utils';
import {globalStyles, colors} from '../src/styles';

@inject('store')
@observer
class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: props.route.params.entries, // [{ category: 'Diet', content: 'Avocado, egg-white omelette and coffee', date: new Date(), },],
      searchText: '',
      sortBy: ' count',
      showModal: false,
      showActionSheet: false,
      selectedEntry: '',
      id: props.route.params.id,
      name: props.route.params.category,
      color: props.route.params.color,
      icon: props.route.params.icon,
    };
    this.navigation = props.navigation;

    /* Get Params */
    // const {itemId, category, color} = route.params;
  }

  // ------ TOGGLE --------------------

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal});
  };
  showActionSheet = (val) => {
    console.log('category > showActionSheet > ' + val);
    this.setState({showActionSheet: val});
  };

  // ------ HANDLER --------------------

  handlerSearch = (text) => {
    this.setState({searchText: text});
  };
  handlerSort = () => {
    console.log(
      `handler > sort > ${this.state.sortBy === 'count' ? 'alpha' : 'count'}`,
    );
    this.setState({
      sortBy: this.state.sortBy === 'count' ? 'alpha' : 'count',
    });
  };
  handlerUpdateCategoryScreen = ({name, icon, color}) => {
    this.setState({
      name: name,
      icon: icon,
      color: color,
    });
  };
  onPressEntry = async (entry) => {
    console.log(
      `category > pressed entry > ${entry.category} @ ${JSON.stringify(
        entry.date,
      )}`,
    );
    await this.setState({selectedEntry: entry, showActionSheet: true});
  };

  // ------ LIFE -----------------------

  // Load
  async componentDidMount() {
    // Update Category Color, Icon & Name
    const {id} = this.state;
    const {categories} = this.props.store;

    // Find category from store
    const category = await categories.filter(function (category) {
      if (id === category.id) {
        return category;
      }
    })[0];
    this.setState({
      ...category,
    });
  }

  render() {
    const {
      // entries,
      id,
      name,
      color,
      icon,
      searchText,
      showModal,
      selectedEntry,
      showActionSheet,
    } = this.state;
    const {entries} = this.props.store;
    console.log('category > init > ' + name);

    // Filter Entries
    var filteredEntries = entries.filter(function (item) {
      if (
        item.content.toLowerCase().includes(searchText.toLowerCase()) &&
        name === item.category
      ) {
        // console.log(`timeline > filt. entry > ${JSON.stringify(item)}`);
        return item;
      }
    });

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <ActionSheetEntry
          selectedEntry={selectedEntry}
          show={showActionSheet}
          showActionSheet={this.showActionSheet}
        />
        <View style={styles.headerAndCategory}>
          <ScreenHeader
            title="Edit"
            color={color}
            goBack={() => this.navigation.goBack()}
            onEdit={() => id !== 'Caprica' && this.toggleModal()}
          />
          <View style={[styles.containerCategory]}>
            <View style={{height: 72}}>
              <LinearGradient
                colors={[color, color, LightenDarkenColor(color, -10)]}
                style={[styles.categoryBackground]}
              />
              {id === 'Caprica' ? (
                <View style={styles.iconCaprica}>
                  <SvgXml width="40" height="40" xml={Logo} />
                </View>
              ) : (
                <View style={styles.iconCategory}>
                  <Text style={{fontSize: 52}}>{icon}</Text>
                </View>
              )}
            </View>

            <View>
              <Text
                style={[
                  styles.textCategory,
                  {color: LightenDarkenColor(color, -10)},
                ]}>
                {name}
              </Text>
            </View>
          </View>
        </View>
        <BarSearchSort
          showSort={true}
          style={{marginTop: 23.5}}
          handlerSearch={this.handlerSearch}
          handlerSort={this.handlerSort}
        />
        <View style={styles.seperator} />
        <View style={styles.containerHistory}>
          {filteredEntries.length === 0 && (
            <EntryNotFound title="Sorry, I couldn't find any entry" />
          )}
          {filteredEntries.length !== 0 && (
            <Text style={styles.historyText}>
              History ({filteredEntries.length})
            </Text>
          )}

          <FlatList
            keyboardDismissMode="on-drag"
            style={styles.flatList}
            keyExtractor={(item) => item.id}
            data={filteredEntries}
            extraData={entries}
            renderItem={({item}) => {
              return (
                <RowEntry
                  data={item}
                  color={color}
                  onPress={this.onPressEntry}
                />
              );
            }}
          />
        </View>
        <Modal
          animationInTiming={100}
          isVisible={showModal}
          style={globalStyles.entryModal}>
          <ModalCategory
            navigation={this.navigation}
            category={{id, name, color, icon}}
            handlerEditCategory={this.props.route.params.handlerEditCategory}
            handlerUpdateCategoryScreen={this.handlerUpdateCategoryScreen}
            toggleModal={this.toggleModal}
          />
        </Modal>
      </View>
    );
  }
}

function RowEntry({data, color, onPress}) {
  const {content, date} = data;
  const dateHour = `${(date.getHours() < 10 ? '0' : '') + date.getHours()}:${
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  }`;
  const dateYear = `${moment(date).format('MMM D, YYYY')}`;

  return (
    <TouchableOpacity
      style={styles.rowEntry}
      activeOpacity={0.8}
      onPress={() => onPress(data)}>
      <View style={styles.rowColumnLeft}>
        <LinearGradient
          colors={[color, color, LightenDarkenColor(color, -5)]}
          style={[styles.hour, {backgroundColor: color}]}>
          <Text style={[styles.hourText, {color: textColor(color)}]}>
            {dateHour}
          </Text>
        </LinearGradient>
      </View>
      <View style={styles.rowColumnRight}>
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: 16.52,
            // backgroundColor: 'pink',
          }}>
          {/* <Text style={[styles.menuArrow, {textAlign: 'right'}]}>M</Text> */}
          <Ionicons name={'ios-arrow-down'} size={16} color="#AAB8C2" />
        </View>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.dateYear}>
          <Text style={styles.dateYearText}>{dateYear}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerAndCategory: {
    height: 105,
  },
  height: 120,
  containerCategory: {
    alignSelf: 'center',
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  seperator: {
    borderTopColor: '#CCD5DD',
    borderTopWidth: 0.5,
    marginTop: 13.03,
  },
  containerHistory: {
    backgroundColor: '#FCFCFC',
    paddingLeft: 11,
    paddingTop: 11,
  },
  historyText: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#657786',
    letterSpacing: -0.26,
  },
  flatList: {
    height: '100%',
    // marginTop: 33.5
    // flex: 1,
  },
  hour: {
    marginTop: 10,
    borderRadius: 10.5,
    width: 52,
    height: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourText: {
    fontSize: 15,
  },
  categoryBackground: {
    backgroundColor: 'blue',
    height: 52,
    width: 69.33,
    borderRadius: 8,
  },
  textCategory: {
    fontWeight: '500',
    fontSize: 17,
  },
  iconCategory: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    // backgroundColor:'pink',
  },
  iconCaprica: {
    alignSelf: 'center',
    position: 'absolute',
    top: 6,
    // backgroundColor:'pink',
  },

  // ENTRY
  rowEntry: {
    flexDirection: 'row',
    marginTop: 10,
    // backgroundColor: 'red',
    // minHeight: 50,
  },
  rowColumnLeft: {},
  rowColumnRight: {
    marginLeft: 13,
    borderColor: '#CCD5DD',
    borderBottomWidth: 0.5,
    width: '84%',
  },
  menuArrow: {
    color: '#657786',
  },
  content: {
    marginTop: 10,
    color: colors.black,
    fontSize: 15,
    letterSpacing: -0.26,
    marginRight: 16.52,
  },
  dateYear: {
    marginBottom: 5,
    marginTop: 5,
    marginRight: 16.52,
    // backgroundColor: 'red',
    // position: 'absolute',
    // bottom: 0,
    // right: 16.52,
    // justifyContent:'flex-end',
    // backgroundColor: 'pink'
  },
  dateYearText: {
    fontSize: 13.5,
    color: '#657786',
    textAlign: 'right',
  },
});
