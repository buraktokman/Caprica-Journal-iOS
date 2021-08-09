import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  View,
  FlatList,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';

import ActionSheetEntry from '../shared/ActionSheetEntry';
import EntryNow from '../shared/EntryNow';
import SubscriptionExpired from '../shared/SubscriptionExpired';
import EntryNotFound from '../shared/EntryNotFound';
import EntryTimeline from '../shared/EntryTimeline';
import EntryDate from '../shared/EntryDate';
import BarCategories from '../shared/BarCategories';
import ButtonNew from '../shared/ButtonNew';
import BarSearchSort from '../shared/BarSearchSort';
import ModalEntry from './ModalEntry';

import {restoreSubscribe} from '../src/subscribe';
import {time_diff_hours, isSameDay, isOnline} from '../src/utils';
import {globalStyles} from '../src/styles';

@inject('store')
@observer
class TimelineScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredEntries: [],
      sortBy: 'newest', // 'alpha
      searchText: '',
      filter: 'All',
      newEntry: false,
      selectedEntry: null,
      selectedCategory: null,
      showModal: false,
      showActionSheet: false,
      entries: [],
      isSubscriptionActive: true,
    };
    this.navigation = props.navigation;
  }

  // ------ HANDLER ---------------------

  toggleModal = () => {
    // Toggle Modal if User Subscribed
    if (this.state.isSubscriptionActive) {
      // Toggle
      this.setState({showModal: !this.state.showModal});
      // Reset SelectedEntry
      !this.state.showModal && this._resetSelected();
    } else {
      this.props.navigation.navigate('Intro', {
        screen: 'Subscribe',
        params: {
          title: 'Renew annually. Get %20 OFF!',
          btnText: 'Renew',
        },
      });
    }
    //
    //  INCORRECT - FILTER IF ENTRY CREATED
    //
    this._filter();
  };
  toggleSubActive = (val) => {
    this.setState({isSubscriptionActive: val});
  };

  showActionSheet = (val) => {
    console.log('timeline > showActionSheet > ' + val);
    this.setState({showActionSheet: val});
    //
    //  INCORRECT - FILTER IF ENTRY CREATED
    //
    this._filter();
  };

  handlerNow = (val) => {
    this.setState({newEntry: !val});
  };

  sortEntriesByDate = async () => {
    const {entries, sortBy} = this.state;
    console.log('timeline > sort > ' + sortBy);
    if (sortBy === 'newest') {
      await this.setState({
        sortBy: 'oldest',
        entries: entries.sort((a, b) => b.date - a.date),
      });
    } else {
      await this.setState({
        sortBy: 'newest',
        entries: entries.sort((a, b) => a.date - b.date),
      });
    }
  };

  handlerSearch = async (text) => {
    console.log('handler > search > ' + text);
    await this.setState({searchText: text});
    // Render
    this._filter();
  };

  handlerFilterByCategory = async (val) => {
    console.log('handler > filterByCategory > ' + val);
    await this.setState({filter: val});
    // Render
    this._filter();
  };

  _filter = () => {
    const {filter, searchText} = this.state;
    const {entries} = this.props.store;

    console.log(
      'handler > filter entries > cat: ' + filter + '  search: ' + searchText,
    );
    // Filter Categories
    this.setState({
      filteredEntries: entries.filter(function (item) {
        if (
          item.content.toLowerCase().includes(searchText.toLowerCase()) &&
          (filter === 'All' || filter === item.category)
        ) {
          // console.log(`timeline > filt. entry > ${JSON.stringify(item)}`);
          return item;
        }
      }),
    });
  };

  onPressEntry = async (entry, category) => {
    console.log(
      `timeline > pressed entry > ${entry.category} @ ${JSON.stringify(
        entry.date,
      )}`,
    );
    await this.setState({
      selectedEntry: entry,
      selectedCategory: category,
    });
    this.showActionSheet(true);
  };

  _resetSelected = () => {
    // Reset Selected Entry & Cat
    this.setState({
      selectedEntry: null,
      selectedCategory: null,
    });
  };

  // ------- FLATLIST -----------------

  renderHeader = () => {
    const {filter, newEntry, filteredEntries} = this.state;

    if (filteredEntries.length !== 0) {
      return (
        <Fragment>
          <BarSearchSort
            // showSort={false}
            style={{marginBottom: 8, marginTop: 16}}
            handlerSearch={this.handlerSearch}
            handlerSort={this.sortEntriesByDate}
          />
          {(filter === 'All' ||
            filteredEntries[0].date.getDay() === new Date().getDay()) && (
            <EntryDate date={new Date()} />
          )}
          {!newEntry && filter === 'All' && (
            <EntryNow
              showTimeline={true}
              showBottomTime={true}
              index={0}
              category={{
                name: 'Now',
                color: '#343148', // #FF5A61
                icon: '🎗',
              }}
              entry={{
                content: "What're you up to?",
                category: 'Now',
                date: new Date(),
              }}
              previousTime={filteredEntries[0].date}
              onPress={this.toggleModal}
            />
          )}
          {filteredEntries[0].date.getDay() !== new Date().getDay() && (
            <EntryDate date={filteredEntries[0].date} />
          )}
        </Fragment>
      );
    } else {
      return (
        <BarSearchSort
          style={{marginBottom: 8, marginTop: 16}}
          handlerSearch={this.handlerSearch}
          handlerSort={this.sortEntriesByDate}
        />
      );
    }
  };

  renderEmpty = () => {
    return <EntryNotFound />;
  };

  renderItem = ({item, index}) => {
    const {categories} = this.props.store;
    const {filteredEntries} = this.state;
    // console.log('FLAT > ' + JSON.stringify(item));
    // if(filteredEntries.length === 0) {
    //   return null
    // }

    // Find category of the entry
    const category = categories.filter(function (category) {
      if (item.category === category.id) {
        return category;
      }
    })[0];
    // Index Number
    // const indexTemp = sortBy === 'count' ? index : -1; //entries.length - index - 2;

    // Time diff since last entry
    var previousTime =
      index + 1 < filteredEntries.length ? filteredEntries[index + 1].date : 0;

    // Config
    var showTimeAgo =
      time_diff_hours(new Date(), item.date) > 24 ? true : false;
    const showTimeline = index + 1 >= filteredEntries.length ? false : true;
    const showBottomTime = index + 1 >= filteredEntries.length ? false : true;

    return (
      <Fragment>
        <EntryTimeline
          showTimeline={showTimeline}
          showBottomTime={showBottomTime}
          showTimeAgo={!showTimeAgo}
          showMenuArrow={true}
          // lastEntryOfTheDay={false}
          category={category}
          entry={item}
          previousTime={previousTime}
          onPress={() => this.onPressEntry(item, category)}
        />
        {index + 1 < filteredEntries.length &&
          !isSameDay(item.date, filteredEntries[index + 1].date) && (
            <EntryDate
              date={filteredEntries[index + 1].date}
              showTimeAgo={showTimeAgo}
            />
          )}
      </Fragment>
    );
  };

  // ------- LIFE -----------------

  async componentDidMount() {
    // this.setState({entries: this.props.store.entries});
    this.sortEntriesByDate();

    // Filter entries by Text & Category
    this._filter();

    // Check if user Online then Subscribed
    // NetInfo.fetch().then(async (state) => {
    //   console.log(
    //     `netinfo > network ${state.isConnected} | internet ${state.isInternetReachable}`,
    //   );
    //   if (state.isConnected) {
    //     const sub = await restoreSubscribe();
    //     console.log(`timeline > show subscribe banner > ${!sub}`);
    //     this.toggleSubActive(sub);
    //   }
    // });
  }

  render() {
    console.log('timeline > initiated');
    const {
      filteredEntries,
      filter,
      // sortB,
      selectedEntry,
      selectedCategory,
      showModal,
      showActionSheet,
      isSubscriptionActive,
    } = this.state;
    const {categories, entries} = this.props.store;

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <View style={{flexDirection: 'row'}}>
          <BarCategories
            showCaprica={true}
            selected={filter}
            entries={entries}
            categories={categories}
            handlerFilterByCategory={this.handlerFilterByCategory}
          />
        </View>
        <ActionSheetEntry
          selectedEntry={selectedEntry}
          toggleModal={this.toggleModal}
          show={showActionSheet}
          showActionSheet={this.showActionSheet}
        />
        {!isSubscriptionActive && (
          <SubscriptionExpired navigation={this.props.navigation} />
        )}
        <View style={styles.flatList}>
          <FlatList
            keyboardDismissMode
            contentOffset={{y: 56}}
            // contentInset={{top: 72}}
            indicatorStyle="black" // 'default', 'black', 'white'
            keyExtractor={(item, index) => String(index) /*item.id*/}
            data={filteredEntries}
            extraData={this.state}
            ListHeaderComponent={this.renderHeader}
            ListEmptyComponent={this.renderEmpty}
            renderItem={({item, index}) => this.renderItem({item, index})}
          />
        </View>

        <ButtonNew type="entry" toggleModal={() => this.toggleModal()} />
        <Modal
          // animated={false}
          // animationInTiming={300}
          // backdropTransitionInTiming={200}
          hideModalContentWhileAnimating={true}
          isVisible={showModal}
          style={globalStyles.entryModal}>
          <ModalEntry
            // style={styles.entryModal}
            selectedEntry={selectedEntry}
            selectedCategory={selectedCategory}
            handlerNow={this.handlerNow}
            toggleModal={this.toggleModal}
          />
        </Modal>
      </View>
    );
  }
}

export default TimelineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatList: {
    flex: 1,
    // height: '100%',
    // position: 'absolute',
    // top: 0,
    // zIndex: -1,
  },
});
