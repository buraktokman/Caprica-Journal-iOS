/*
https://github.com/wix/react-native-calendars

MarkedDates Fix
https://github.com/wix/react-native-calendars/issues/543
*/
import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import {CalendarList} from 'react-native-calendars';

import ActionSheetEntry from '../shared/ActionSheetEntry';
import EntryTimeline from '../shared/EntryTimeline';
import EntryDate from '../shared/EntryDate';
import EntryNotFound from '../shared/EntryNotFound';
import BarSearchSort from '../shared/BarSearchSort';
import BarCategories from '../shared/BarCategories';
import {haptic} from '../src/vibrate';
import {colors} from '../src/styles';
import {isSameDay, formatDate} from '../src/utils';

@inject('store')
@observer
class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'newest', // 'alpha
      searchText: '',
      selectedDate: new Date(),
      selectedEntry: '',
      showActionSheet: false,
      showCalendar: false,
      markedDates: {},
      minDate: new Date(),
      maxDate: new Date(),
      filter: 'All',
      entries: [],
    };
    this.navigation = props.navigation;
  }

  // ------ TOGGLE ---------------------

  showActionSheet = (val) => {
    console.log('calendar > showActionSheet > ' + val);
    this.setState({showActionSheet: val});
  };

  // ------ HANDLER ---------------------

  handlerSearch = (text) => {
    console.log('handler > search > ' + text);
    this.setState({searchText: text});
  };
  handlerSort = async () => {
    this.sortEntriesByDate();
  };

  handlerFilter = (val) => {
    console.log('handler > filter > ' + val);
    this.setState({filter: val});
  };
  onPressEntry = async (entry) => {
    console.log(
      `calendar > pressed entry > ${entry.category} @ ${JSON.stringify(
        entry.date,
      )}`,
    );
    await this.setState({selectedEntry: entry, showActionSheet: true});
  };

  handlerSelectDate = (val) => {
    console.log('selectedDate > ' + new Date(val));
    this.setState({selectedDate: new Date(val)});
  };
  handlerMinDate = (val) => {
    this.setState({minDate: val});
  };
  handlerMaxDate = (val) => {
    this.setState({maxDate: val});
  };
  handlerOnChangeDate = (day) => {
    // Vibrate
    this.props.store.settings.vibration && haptic('impactLight');
    // Reset Filter
    this.handlerFilter('All');
    // Set day
    this.handlerSelectDate(day.timestamp);
    // Re-mark Dates
    this.markDates();
  };
  handlerShowCalendar = (val) => {
    console.log('handler > show calendar > ' + val);
    this.setState({showCalendar: val});
  };

  // ------ UTIL ---------------------

  markDates = () => {
    const {selectedDate} = this.state;
    const {categories} = this.props.store;
    const entries = [...this.props.store.entries];

    var now = new Date();
    // Iterate over Days
    // CAUTION - For loop increasing day of the last entry. SOLUTION USED -> new Date(entry)
    for (
      var d = new Date(entries[entries.length - 1].date);
      d <= now;
      d.setDate(d.getDate() + 1)
    ) {
      const dateFormatted = formatDate(new Date(d));
      // Entries of the Day
      var entryCount = 0;
      var entriesOfDay = [];

      for (var i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (formatDate(entry.date) === dateFormatted) {
          //   `ENTRY FOUND mark > ${dateFormatted} ------
          // console.log(
          //   `FOUND ${dateFormatted} \t${this.formatDate(entries[i].date)} - ${
          //     entries[i].content
          //   }`,
          // );
          // Find category of the entry
          const category = categories.filter(function (category) {
            if (entry.category === category.id) {
              return category;
            }
          });
          entriesOfDay.push({
            key: entry.date, //category[0].name,
            color: category[0].color,
            // selectedDotColor: '#FF5A61',
          });
          // Exit after 5 category
          if (entryCount >= 5) {
            break;
          }
          entryCount = entryCount + 1;
        }
      }

      // Disable Day if has no entry
      var mark = {
        selected: false, // this.formatDate(selectedDate) === dateFormatted,
        marked: true,
        selectedColor: '#01ADF5', // #1DA1F2
        disabled: entriesOfDay.length ? false : true,
        disableTouchEvent: false,
        dots: entriesOfDay,
      };
      this.setState({
        markedDates: {
          ...this.state.markedDates,
          [dateFormatted]: mark,
        },
      });
    }
    // this.handlerShowCalendar(true);
  };
  calendarDatesBetween = () => {
    const entries = this.props.store.entries.slice();
    try {
      this.setState({
        minDate: formatDate(entries[entries.length - 1].date),
      });
    } catch (error) {}
    try {
      this.setState({
        maxDate: formatDate(entries[0].date),
      });
    } catch (error) {}
  };

  // ------ SORT ---------------------

  sortEntriesByDate = () => {
    console.log('calendar > sort > ' + sortBy);
    const {sortBy} = this.state;
    const entries = this.props.store.entries.slice();
    this.setState({
      sortBy: 'newest',
      entries: entries.sort((a, b) => b.date - a.date),
      // selectedDate: entries[0].date,
    });

    // this.setState({entries: this.props.store.entries.slice()});

    // this.state.entries.map((item) => {
    //   console.log(item);
    // });

    // this.props.store.entries.map((item) => {
    //   console.log(item);
    // });
    // if (sortBy === 'newest') {
    //   await this.setState({
    //     sortBy: 'oldest',
    //     entries: entries.sort((a, b) => b.date - a.date),
    //   });
    // } else {
    //   await this.setState({
    //     sortBy: 'newest',
    //     entries: entries.sort((a, b) => a.date - b.date),
    //   });
    // }
  };

  // ------- FLATLIST -------------

  renderHeader = (selectedDayEntries) => {
    // const {selectedDayEntries} = this.state;

    if (selectedDayEntries.length !== 0) {
      return (
        <Fragment>
          {/* <BarSearchSort
            showSort={false}
            style={{marginTop: 13.5}}
            handlerSearch={this.handlerSearch}
            handlerSort={this.handlerSort}
          /> */}
          <EntryDate
            date={selectedDayEntries[0].date}
            style={{backgroundColor: '#FCFCFC'}}
          />
        </Fragment>
      );
    } else {
      return <Fragment />;
    }
  };
  renderItem = ({item, index, filteredEntries}) => {
    const {sortBy} = this.state;
    const {categories} = this.props.store;

    // Show only searched categories
    // Find category of the entry
    const category = categories.filter(function (category) {
      if (item.category === category.id) {
        return category;
      }
    })[0];
    // Index Number
    const indexTemp = sortBy === 'count' ? index : -1; //entries.length - index - 2;
    // Time diff since last entry
    try {
      var previousTime = filteredEntries[index + 1].date; // item.date - entries[index + 1].date;
    } catch (error) {
      var previousTime = 0;
    }
    // Config
    const showTimeline = index + 1 >= filteredEntries.length ? false : true;
    const showBottomTime = index + 1 >= filteredEntries.length ? false : true;

    // Show Entry & Date
    return (
      <Fragment>
        <EntryTimeline
          showTimeline={showTimeline}
          showBottomTime={showBottomTime}
          showTimeAgo={false}
          showMenuArrow={true}
          index={indexTemp}
          category={category}
          entry={item}
          previousTime={previousTime}
          onPress={this.onPressEntry}
        />
      </Fragment>
    );
  };
  renderEmpty = () => <EntryNotFound />;

  // ------- LIFE -----------------

  async componentDidMount() {
    // Sort
    await this.sortEntriesByDate();
    // Grey blank dates
    this.calendarDatesBetween();
    // Mark Dates with Entries
    this.markDates();
    // Show Calendar
    this.handlerShowCalendar(true);
  }
  // shouldComponentUpdate() {
  //   return true;
  // }

  async componentWillReceiveProps() {
    console.log('CALENDAR > new props received');
    // this.state.entries.map((item) => {
    //   console.log(item);
    // });
    await this.setState({
      categories: this.props.store.categories,
      entries: this.props.store.entries,
    });
  }

  render() {
    const {
      selectedEntry,
      showActionSheet,
      searchText,
      filter,
      sortBy,
      selectedDate,
      markedDates,
      showCalendar,
      minDate,
      maxDate,
    } = this.state;
    const {entries, categories} = this.props.store;
    console.log('calendar > initiated > ' + formatDate(selectedDate));

    if (!showCalendar) {
      return <ActivityIndicator />;
    } else {
      // Filter Categories + by Date
      var filteredEntries = entries.filter(function (item) {
        if (
          item.content.toLowerCase().includes(searchText.toLowerCase()) &&
          (filter === 'All' || filter === item.category) &&
          item.date.toDateString() === selectedDate.toDateString()
        ) {
          return item;
        }
      });
      // Filter Selected Day's Entries
      var selectedDayEntries = entries.filter(function (item) {
        if (item.date.toDateString() === selectedDate.toDateString()) {
          // console.log(item);
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
          <CalendarList
            // Param
            hideArrows={false}
            hideExtraDays={true}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              console.log('calendar > selected day', day.dateString);
              this.handlerOnChangeDate(day);
            }}
            onDayLongPress={(day) => {
              console.log('calendar > selected day', day.dateString);
              this.handlerOnChangeDate(day);
            }}
            // Init
            current={formatDate(selectedDate)}
            // Collection of dates that have to be marked. Default = {}
            markedDates={{
              ...markedDates,
              [formatDate(selectedDate)]: {
                // selectedColor: 'red',
                selected: true,
                marked: true,
                dots: [{color: 'white', key: 'default'}],
              },
            }}
            markingType={'multi-dot'}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={minDate}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={maxDate}
            // Callback which gets executed when visible months change in scroll view. Default = undefined
            // onVisibleMonthsChange={(months) => {
            //   console.log('now these months are visible', months);
            // }}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={12}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={0}
            // Enable or disable scrolling of calendar list
            scrollEnabled={true}
            // Enable or disable vertical scroll indicator. Default = false
            showScrollIndicator={true}
            // Enable horizontal scrolling, default = false
            horizontal={true}
            // Enable paging on horizontal, default = false
            pagingEnabled={true}
            // Style
            style={styles.calendar}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              //arrowColor: 'orange',
              //monthTextColor: 'blue',
              //textDayFontFamily: 'monospace',
              //textMonthFontFamily: 'monospace',
              //textDayHeaderFontFamily: 'monospace',
              textMonthFontWeight: '500',
              // textDayFontSize: 16,
              textMonthFontSize: 16,
              // textDayHeaderFontSize: 16,
            }}
          />
          <BarCategories
            style={styles.categoryBar}
            selected={filter}
            entries={selectedDayEntries}
            categories={categories}
            handlerFilterByCategory={this.handlerFilter}
            handlerNow={this.handlerNow}
          />
          <View style={styles.flatList}>
            <FlatList
              keyboardDismissMode
              // contentOffset={{y: 56}}
              keyExtractor={(item) => item.id}
              data={filteredEntries}
              extraData={this.state}
              ListHeaderComponent={this.renderHeader(selectedDayEntries)}
              ListEmptyComponent={this.renderEmpty}
              renderItem={({item, index}) =>
                this.renderItem({item, index, filteredEntries})
              }
            />
          </View>
        </View>
      );
    }
  }
}

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatList: {
    backgroundColor: '#FCFCFC',
    flex: 1,
    height: '100%',
    // position: 'absolute',
    // top: 0,
    zIndex: -1,
  },
  categoryBar: {
    borderTopColor: '#CCD5DD',
    borderTopWidth: 0.5,
  },
  calendar: {
    height: 304,
    borderBottomColor: '#CCD5DD',
    borderBottomWidth: 0.5,
  },
});
