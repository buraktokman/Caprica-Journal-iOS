import React, {Component} from 'react';
import {Alert} from 'react-native';
import {observer, inject} from 'mobx-react';
import ActionSheet from 'react-native-actionsheet';

import {shareEntry} from '../src/share';
import {trimString} from '../src/utils';

@inject('store')
@observer
class ActionSheetEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // ------ HANDLER ---------------------

  toggleActionSheet = () => {
    console.log('actionSheet > show up');
    this.ActionSheet.show();
  };

  handlerActionSheet = (index) => {
    const {selectedEntry, showActionSheet, toggleModal} = this.props;
    switch (index) {
      case 0:
        console.log(
          'actionSheet > edit > entry > ' + JSON.stringify(selectedEntry),
        );
        toggleModal();
        showActionSheet(false);
        break;
      case 1:
        console.log(
          'actionSheet > share > entry > ' + JSON.stringify(selectedEntry),
        );
        shareEntry(selectedEntry);
        showActionSheet(false);
        break;
      case 2:
        console.log(
          'actionSheet > remove > entry > ' + JSON.stringify(selectedEntry),
        );
        Alert.alert(
          'Caution',
          'Are you sure you want to delete?',
          [
            {
              text: 'Cancel',
              onPress: () => {
                console.log('entry remove canceled');
                showActionSheet(false);
              },
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                this.props.store.handlerDelEntry(selectedEntry);
                showActionSheet(false);
              },
              style: 'destructive',
            },
          ],
          {cancelable: false},
        );

        break;
      case 3:
        showActionSheet(false);
        break;
      default:
        break;
    }
  };

  // ------- LIFE -----------------

  componentDidMount() {}

  componentDidUpdate() {
    if (this.props.show) {
      this.toggleActionSheet();
    }
  }

  render() {
    // const {selectedEntry, showActionSheet, show} = this.props;
    const {selectedEntry} = this.props;
    var content = selectedEntry ? trimString(selectedEntry.content, 70) : '';

    return (
      <ActionSheet
        ref={(o) => (this.ActionSheet = o)}
        title={content}
        // message={'Select an action for selected entry'}
        options={['Edit', 'Share', 'Remove', 'Cancel']}
        destructiveButtonIndex={2}
        cancelButtonIndex={3}
        onPress={(index) => this.handlerActionSheet(index)}
        styles={styles}
      />
    );
  }
}

export default ActionSheetEntry;

const styles = {
  titleBox: {
    background: 'pink',
  },
  titleText: {
    fontSize: 16,
    color: '#000',
  },
};
