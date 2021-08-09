/*
https://rnfirebase.io/firestore/usage
*/
// import firebase from 'react-native-firebase';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import {randomStr} from '../utils';

// Identify Device
var UUID;
try {
  UUID = DeviceInfo.getUniqueId();
} catch (error) {
  UUID = randomStr(8);
}

// -------- FIRESTORE DB --------

//
// -------- ENTRIES --------
//

// ADD
export function fireAddEntry(entry, addComplete) {
  // addComplete is CALLBACK. Will be run after function done
  console.log('API > firebase > addEntry > ' + JSON.stringify(entry));

  // Add Creation Time & UUID
  // entry.createdAt = firestore.FieldValue.serverTimestamp();
  entry.uuid = UUID;

  firestore()
    .collection('entries')
    // .add({
    //   name: food.name,
    //   color: food.color,
    //   createdAt: firestore.FieldValue.serverTimestamp(),
    // })
    .add(entry)
    .then((snapshot) => snapshot.get())
    .then((entryData) => addComplete(entryData.data()))
    .catch((error) => console.log(error));
}

// GET
export async function fireGetEntries(entriesReceived) {
  console.log('API > firebase > getEntries');
  var entryList = [];

  //   firestore()
  //     .collection('Foods')
  //     .onSnapshot((querySnapshot) => {
  //       console.log(querySnapshot);
  //     });

  var snapshot = await firestore()
    .collection('entries')
    .orderBy('createdAt', 'desc')
    .get();
  // .catch((error) => console.log(error));

  snapshot.forEach((doc) => {
    // console.log(doc);
    const entryItem = doc._data;
    entryItem.id = doc.id;

    entryList.push(entryItem);
  });

  // Give it to callback
  entriesReceived(entryList);
  // fireGetEntries(entriesReceived);
}

// UPDATE
export function fireUpdateEntry(entry, updateComplete) {
  console.log('API > firebase > updateEntry');
  console.log('entry > ' + entry);

  entry.updatedAt = firestore.FieldValue.serverTimestamp();

  firestore()
    .collection('Entries')
    .doc(entry.id) // Document ID
    .set(entry) // Overrides entire object
    // .update()    // Updates single key
    .then(() => updateComplete(entry))
    .catch((error) => console.log(error));
}

// DEL
export function fireDeleteEntry(entry, delComplete) {
  console.log('API > firebase > delete > ' + entry.id);

  firestore()
    .collection('entries')
    .doc(entry.id) // Document ID
    .delete()
    .then(() => delComplete())
    .catch((error) => console.log(error));
}

//
// -------- CATEGORIES --------
//

// ADD
export function fireAddCategory(category, addComplete) {
  // addComplete is CALLBACK. Will be run after function done
  console.log('API > firebase > addCategory > ' + JSON.stringify(category));

  // Add Creation Time & UUID
  category.createdAt = firestore.FieldValue.serverTimestamp();
  category.uuid = UUID;

  firestore()
    .collection('categories')
    // .add({
    //   name: food.name,
    //   color: food.color,
    //   createdAt: firestore.FieldValue.serverTimestamp(),
    // })
    .add(category)
    .then((snapshot) => snapshot.get())
    .then((categoryData) => addComplete(categoryData.data()))
    .catch((error) => console.log(error));
}

//
// -------- SETTINGS --------
//

//
//  INCOMPLETE
//
