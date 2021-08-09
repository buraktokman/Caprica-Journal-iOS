/*
https://github.com/react-native-community/react-native-modal
https://github.com/arronhunt/react-native-emoji-selector
*/
import React, {PureComponent, Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {observer, inject} from 'mobx-react';

import ModalHeader from '../shared/ModalHeader';
import NewEntryQuickText from '../shared/NewEntryQuickText';
import NewEntryCategory from '../shared/NewEntryCategory';
import NewEntrySelectCategory from '../shared/NewEntrySelectCategory';
import {colors} from '../src/styles';

@inject('store')
@observer
class ModalEntry extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      category: {id: 'Party', name: 'Party', color: '#F00A48', icon: '🍸'},
      content: '',
      date: new Date(),
      modalLoaded: false,
    };
  }

  // ------- HANDLER ----------–---

  handlerDate = (val) => {
    console.log('modalEntry > handler > date > ' + JSON.stringify(val));
    this.setState({date: val});
  };
  handlerContent = (val) => {
    console.log('modalEntry > handler > content > ' + JSON.stringify(val));
    this.setState({content: val});
  };
  handlerCategory = (val) => {
    console.log('modalEntry > handler > category > ' + JSON.stringify(val));
    this.setState({category: val});
  };
  setModalLoaded = (val) => {
    this.setState({modalLoaded: val});
  };
  handlerAdd = async () => {
    const {handlerAddEntry} = this.props.store;
    const {handlerNow, toggleModal} = this.props;
    // Add ... If blank entry
    this.state.content === '' && (await this.handlerContent('...'));
    const {category, content, date} = this.state;
    const entry = {
      content,
      date,
      category: category.id,
    };

    handlerAddEntry(entry);
    handlerNow();
    toggleModal();
  };
  handlerEdit = async () => {
    const {handlerEditEntry} = this.props.store;
    const {toggleModal} = this.props;
    // Add ... If blank entry
    this.state.content === '' && (await this.handlerContent('...'));
    const {category, content, date} = this.state;
    const entry = {
      content,
      date,
      dateEdit: new Date(),
      category: category.id,
    };

    handlerEditEntry(entry);
    toggleModal();
  };

  // ------- LIFE -----------------

  componentDidMount() {
    // Sort Categories by count
    // await this.props.store.sortCategoriesByCount();
    // Assign
    const {entries, categories} = this.props.store;
    this.setState({
      entries: entries,
      categories: categories,
      category: categories[0],
    });

    // Edit Entry if provided
    if (this.props.selectedEntry) {
      var {content, date, category} = this.props.selectedEntry;
      var category = this.props.selectedCategory;
      this.handlerDate(date);
      this.handlerContent(content);
      this.handlerCategory(category);
    }

    // Focus to text input
    //
    //  INCOMPLETE - FINT ANOTHER WAY TO SPEED UP MODAL OPENING!
    //
    setTimeout(() => {
      // Show categories
      this.setModalLoaded(true);
    }, 300);
  }

  // shouldComponentUpdate(nextProps) {
  //   if (this.props.showCategories !== nextProps.showCategories) {
  //     // console.log('category > selected > ' + this.props.category.name);
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    const {category, content, modalLoaded} = this.state;
    const {entries, categories} = this.props.store;
    const {toggleModal, selectedEntry} = this.props;

    // Header Add or Save
    const headerProps = {
      ...(!selectedEntry ? {handlerAdd: this.handlerAdd} : {}),
      ...(selectedEntry ? {handlerEdit: this.handlerEdit} : {}),
    };

    return (
      <View style={[styles.container, styles.modal]}>
        <SafeAreaView />
        <ModalHeader
          {...headerProps}
          onCancel={() => toggleModal()}
          // handlerAdd={() => this.handlerAdd()}
          // handlerEdit={() => this.handlerEdit()}
          color={colors.blue}>
          <NewEntryCategory
            category={category}
            select={false}
            updateComponent={true}
            onPress={() => null}
            style={{
              height: 30,
              minWidth: 100,
              marginLeft: 0,
              marginBottom: 0,
              paddingHorizontal: 8,
            }}
          />
        </ModalHeader>

        <View style={styles.containerTextInput}>
          <TextInput
            style={styles.textInput}
            autoFocus={true}
            multiline
            value={content}
            placeholder="What're you up to?"
            placeholderTextColor="#657786"
            onChangeText={this.handlerContent}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardDismissMode
          // bounces={false}
          // decelerationRate={0.1}
          style={styles.categoryAndQuick}>
          {modalLoaded ? (
            <NewEntrySelectCategory
              selected={category.name}
              categories={categories}
              entries={entries}
              handlerCategory={this.handlerCategory}
            />
          ) : (
            <ActivityIndicator style={{width: 300}} />
          )}

          <View
            style={{
              borderLeftWidth: 0.5,
              borderColor: '#CCD5DD',
              height: '100%',
              flex: 1,
            }}
          />
          <View
            style={{
              marginTop: 85,
              width: 5,
              height: 63,
              backgroundColor: '#CCD5DD',
              borderRadius: 1.5,
              zIndex: 1,
              position: 'absolute',
              top: 0,
              left: 298,
            }}
          />
          <NewEntryQuickText
            entries={entries}
            categories={categories}
            handlerContent={this.handlerContent}
            handlerCategory={this.handlerCategory}
          />
        </ScrollView>
      </View>
    );
  }
}

export default ModalEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerTextInput: {
    // backgroundColor: '#F1F1F1F1',
    marginTop: 23,
    height: 80,
  },
  categoryAndQuick: {
    borderTopColor: '#CCD5DD',
    borderTopWidth: 0.5,
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#FCFCFC',
  },
  textInput: {
    // backgroundColor: 'red',
    marginHorizontal: 17,
    // marginTop: 23,
    height: 80,
    fontSize: 15.5,
    letterSpacing: -0.26,
    color: colors.black,
  },
});
