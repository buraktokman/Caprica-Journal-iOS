/*
https://github.com/react-native-community/react-native-modal
https://github.com/arronhunt/react-native-emoji-selector
*/
import React, {Component} from 'react';
import {
  StyleSheet,
  Button,
  View,
  Alert,
  ScrollView,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';

import {randomStr} from '../src/utils';
import ColorPicker from '../shared/ColorPicker';
import ModalHeader from '../shared/ModalHeader';
import EntryTimeline from '../shared/EntryTimeline';
import {colors} from '../src/styles';

@inject('store')
@observer
class ModalCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'new_category',
      icon: '🛍',
      name: 'New Category',
      color: '#26AAFC',
      showColorPicker: false,
      showEmojiPicker: true,
      nameChanged: false,
    };
    this.navigation = props.navigation;
  }

  // ------- HANDLER BUTTON PRESS -

  handlerShowColorPicker = () => {
    Keyboard.dismiss();
    this.setState({showColorPicker: !this.state.showColorPicker});
    console.log('handler > colorPicker > ' + !this.state.showColorPicker);
  };
  handlerShowEmojiPicker = () => {
    Keyboard.dismiss();
    this.setState({showEmojiPicker: !this.state.showEmojiPicker});
    console.log('handler > emojiPicker > ' + !this.state.showEmojiPicker);
  };
  handlerChangeColor = (val) => {
    this.setState({color: val.toUpperCase()});
  };
  handlerChangeName = (val) => {
    console.log(`handler > change cat name > ${val}`);
    this.setState({
      name: val,
      nameChanged: true,
    });
  };
  handlerChangeIcon = (val) => {
    this.setState({icon: val});
  };
  handlerCreateID = (val) => {
    // Create ID
    var catID = val.replace(/[^a-zA-Z0-9]/g, '');
    // Assign random str as ID if cat. name full special char
    catID = catID.length === 0 ? randomStr(7) : catID;
    console.log(`handler > create cat ID > ${catID}`);
    this.setState({id: catID});
  };

  handlerDeleteCategory = () => {
    const {id, name, color, icon} = this.state;
    Alert.alert(
      'Caution',
      'Are you sure you want to delete?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('category remove canceled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Del Category
            this.props.store.handlerDelCategory(name);
            // Go Back
            this.navigation.navigate('Categories');
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };
  addCategory = async () => {
    const {name} = this.state;
    const {toggleModal, handlerAddCategory} = this.props;

    if (this.props.store.isCategoryNameAvailable(name)) {
      await this.handlerCreateID(name);
      handlerAddCategory(this.state);
      toggleModal();
    } else {
      Alert.alert(
        'Name must be unique',
        'Another category is using this name',
        [{text: 'OK', style: 'cancel'}],
      );
    }
  };
  editCategory = () => {
    const {id, color, icon, name, nameChanged} = this.state;
    const {
      toggleModal,
      // handlerEditCategory,
      handlerUpdateCategoryScreen,
    } = this.props;

    if (nameChanged && !this.props.store.isCategoryNameAvailable(name)) {
      Alert.alert(
        'Name must be unique',
        'Another category is using this name',
        [{text: 'OK', style: 'cancel'}],
      );
    } else {
      this.props.store.handlerEditCategory({id, color, name, icon});
      handlerUpdateCategoryScreen(this.state);
      toggleModal();
    }
  };

  // ------- LIFE -----------------

  componentDidMount() {
    if (this.props.category) {
      const {id, name, icon, color} = this.props.category;
      this.setState({
        id: id,
        name: name,
        icon: icon,
        color: color,
      });
    }
  }

  render() {
    const {
      // id,
      name,
      icon,
      color,
      showEmojiPicker,
      showColorPicker,
    } = this.state;
    const {
      toggleModal,
      handlerAddCategory,
      handlerEditCategory,
      // handlerUpdateCategoryScren,
    } = this.props;

    // Header Add or Save
    const headerProps = {
      ...(handlerAddCategory ? {handlerAdd: this.addCategory} : {}),
      ...(handlerEditCategory ? {handlerEdit: this.editCategory} : {}),
    };

    var entryTime = new Date();
    entryTime.setHours(entryTime.getHours() - 1);

    var bottomTime = new Date();
    bottomTime.setHours(bottomTime.getHours() - 8);

    return (
      <View style={[styles.container, styles.modal]}>
        <SafeAreaView />
        <ModalHeader
          {...headerProps}
          onCancel={() => toggleModal()}
          // handlerAdd={() => this.addCategory()}
          color={color}
        />
        <View style={styles.entry}>
          <EntryTimeline
            showTimeline={false}
            showBottomTime={true}
            showMenuArrow={true}
            index={0}
            category={this.state}
            entry={{
              category: name,
              content: 'Example text for timeline demonstration',
              date: entryTime,
            }}
            previousTime={bottomTime}
            // handlerEditEntry={this.handlerEditEntry}
            onPress={() => null}
          />
        </View>

        <ScrollView style={{height: '100%'}}>
          <View style={styles.row}>
            <Text style={{fontSize: 15.5, color: '#657786'}}>
              Adjust the category attributes as you desired
            </Text>
          </View>
          <View style={styles.row}>
            <Text>Icon</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.inputBox}
              onPress={() => {
                this.handlerShowEmojiPicker();
                this.handlerShowColorPicker();
              }}>
              <Text style={styles.iconText}>{icon}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text>Name</Text>
            <TextInput
              style={[styles.nameText, {color: color}, styles.inputBox]}
              placeholder={name}
              placeholderTextColor={color}
              onChangeText={(val) => this.handlerChangeName(val)}
            />
          </View>
          <View style={styles.row}>
            <Text>Color</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.handlerShowEmojiPicker();
                this.handlerShowColorPicker();
              }}
              style={[styles.inputBox, {backgroundColor: color}]}>
              <Text style={[styles.colorText]}>{color}</Text>
            </TouchableOpacity>
          </View>
          {showColorPicker && (
            <ColorPicker
              color={color}
              handlerChangeColor={this.handlerChangeColor}
              style={{marginTop: 10}}
            />
          )}
          {name !== 'New Category' && (
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.8}
              onPress={() => this.handlerDeleteCategory()}>
              <Text style={styles.deleteText}>Delete Category</Text>
            </TouchableOpacity>
          )}
          {showEmojiPicker && (
            <View style={styles.containerEmojiPicker}>
              <EmojiSelector
                // theme='#1DA1F2'
                showSectionTitles={false}
                // showSearchBar={false}
                // showTabs={false}
                columns={8}
                category={Categories.objects}
                onEmojiSelected={(emoji) => this.handlerChangeIcon(emoji)}
              />
            </View>
          )}
        </ScrollView>
        {/* <SafeAreaView /> */}
      </View>
    );
  }
}

export default ModalCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // opacity: 1.0,
  },
  containerEmojiPicker: {
    marginTop: 5,
    flex: 1,
    // height: 420,
    // borderBottomWidth: 0.5,
    // borderBottomColor: '#CCD5DD',
    // marginBottom: 17,
  },
  entry: {
    marginVertical: 23,
  },
  modal: {
    margin: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCD5DD',
    height: 51,
    paddingHorizontal: 17,
  },
  inputBox: {
    backgroundColor: '#E6EBEF',
    width: 144,
    height: 32,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15.5,
  },
  nameText: {
    // fontVariant: ['tabular-nums'],
    minWidth: 50,
    fontSize: 15.5,
    textAlign: 'center',
  },
  colorText: {
    color: 'white',
  },
  iconText: {
    position: 'absolute',
    fontSize: 34,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEEBEF', // 'pink'
    height: 51, //40,
    borderBottomWidth: 0.5,
    // borderBottomWidth: 0.5,
    borderColor: '#FFD7D7',
  },
  deleteText: {
    fontSize: 15,
    // fontWeight: '400',
    color: colors.red,
  },
});
