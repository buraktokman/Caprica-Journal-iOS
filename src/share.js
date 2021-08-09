import {Platform} from 'react-native';
import Share from 'react-native-share';
import moment from 'moment';
import {APP_URL} from '../AppData.json';

//
//  INCOMPLETE
//
export function shareEntries({entries, category, date}) {
  console.log('share > shareEntries');

  const title = category; // Awesome Contents';
  // const message = content; // 'Please check this out.';
  // const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';

  // Construct Message
  const message = `${content}\n\n${category} @ ${moment(date).format(
    'MMMM Do, h:mm',
  )}\nvia Caprica for iOS\n\n`;

  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing text.
          placeholderItem: {
            type: 'text',
            content: message,
          },
          item: {
            default: {
              type: 'text',
              content: message,
            },
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: message,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message,
    },
  });

  Share.open(options);
}

export function shareEntry({content, category, date}) {
  console.log('share > shareEntry');

  const title = category; // Awesome Contents';
  // const message = content; // 'Please check this out.';
  // const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';

  // Construct Message
  const message = `${content}\n\n${category} @ ${moment(date).format(
    'MMMM Do, h:mm',
  )}\nvia Caprica for iOS\n${APP_URL}\n\n`;

  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing text.
          placeholderItem: {
            type: 'text',
            content: message,
          },
          item: {
            default: {
              type: 'text',
              content: message,
            },
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: message,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message,
      // message: `${message} ${url}`,
    },
  });

  Share.open(options);
  // const shareOptions = {
  //   title: 'Share via',
  //   message: 'some message',
  //   url: 'some share url',
  //   social: Share.Social.WHATSAPP,
  //   whatsAppNumber: '9199999999', // country code + phone number
  //   filename: 'test', // only for base64 file in Android
  // };
  // Share.shareSingle(shareOptions);
}

export function shareApp(url) {
  console.log('share > app > ' + url);
  // const title = category;

  // Construct Message
  const title = 'Caprica';
  const message = url;

  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing text.
          placeholderItem: {
            type: 'text',
            content: message,
          },
          item: {
            default: {
              type: 'text',
              content: message,
            },
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: message,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message,
      // message: `${message} ${url}`,
    },
  });

  Share.open(options);
  // const shareOptions = {
  //   title: 'Share via',
  //   message: 'some message',
  //   url: 'some share url',
  //   social: Share.Social.WHATSAPP,
  //   whatsAppNumber: '9199999999', // country code + phone number
  //   filename: 'test', // only for base64 file in Android
  // };
  // Share.shareSingle(shareOptions);
}
