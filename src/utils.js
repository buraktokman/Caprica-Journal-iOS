import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

export function getAppVersion() {
  return DeviceInfo.getVersion();
}

export async function isOnline() {
  await NetInfo.fetch().then(async (state) => {
    console.log(
      `utils > netinfo > network ${state.isConnected} | internet ${state.isInternetReachable}`,
    );
    return state.isConnected;
  });
}

export function LightenDarkenColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

export function textColor(hexcolor) {
  const hex = hexcolor.replace(/#/, '');
  // const r = parseInt(hex.substr(0, 2), 16);
  // const g = parseInt(hex.substr(2, 2), 16);
  // const b = parseInt(hex.substr(4, 2), 16);

  // return [0.299 * r, 0.587 * g, 0.114 * b].reduce((a, b) => a + b) / 255;

  var r = parseInt(hex.substr(0, 2), 16);
  var g = parseInt(hex.substr(2, 2), 16);
  var b = parseInt(hex.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 143 ? 'black' : 'white'; // default 128
}

export function trimString(name, n) {
  try {
    return name.length > n ? name.substr(0, n - 1) + '...' : name;
  } catch (error) {
    return 'Please provide a string';
  }
}

// Add 1st, 2nd, 3rd ....
export function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + 'st';
  }
  if (j == 2 && k != 12) {
    return i + 'nd';
  }
  if (j == 3 && k != 13) {
    return i + 'rd';
  }
  return i + 'th';
}

// Entry Row BottomTime Difference
export function timeDifference(newest, oldest) {
  var ms = moment(newest).diff(moment(oldest));
  var d = moment.duration(ms);
  const bottomTime = {
    months: d.months(),
    weeks: d.weeks(),
    days: d.days(),
    hours: d.hours(),
    mins: d.minutes(),
    secs: d.seconds(),
  };
  var timeDiffSecs = (newest - oldest) / 1000;
  return timeDiffSecs < 60
    ? `${bottomTime.secs} sec`
    : timeDiffSecs < 60 * 60
    ? `${bottomTime.mins} mins`
    : timeDiffSecs < 60 * 60 * 24 && bottomTime.mins === 0
    ? `${bottomTime.hours} hrs`
    : timeDiffSecs < 60 * 60 * 24
    ? `${bottomTime.hours}h, ${bottomTime.mins}mins`
    : timeDiffSecs < 60 * 60 * 24 * 7 &&
      bottomTime.hours === 0 &&
      bottomTime.mins === 0
    ? `${bottomTime.days}d`
    : timeDiffSecs < 60 * 60 * 24 * 7 && bottomTime.hours === 0
    ? `${bottomTime.days}d, ${bottomTime.mins}m`
    : timeDiffSecs < 60 * 60 * 24 * 7
    ? `${bottomTime.days}d, ${bottomTime.hours}h` // , ${bottomTime.mins}m
    : timeDiffSecs < 60 * 60 * 24 * 30
    ? `${bottomTime.weeks}w, ${bottomTime.days}d` // , ${bottomTime.hours}h, ${bottomTime.mins}m
    : `${bottomTime.weeks}w`;
  //`${bottomTime.weeks}m, ${bottomTime.weeks}w, ${bottomTime.days}d, ${bottomTime.hours}h, ${bottomTime.mins}mins`;
}

// Entry Time Ago
export function timeAgo(entryTime) {
  var ms = moment(new Date()).diff(moment(entryTime));
  var d = moment.duration(ms);
  const bottomTime = {
    months: d.months(),
    weeks: d.weeks(),
    days: d.days(),
    hours: d.hours(),
    mins: d.minutes(),
    secs: d.seconds(),
  };
  var timeDiffSecs = (new Date() - entryTime) / 1000;
  return timeDiffSecs < 60
    ? `${bottomTime.secs}s`
    : timeDiffSecs < 60 * 60
    ? `${bottomTime.mins}m`
    : timeDiffSecs < 60 * 60 * 24
    ? `${bottomTime.hours}h`
    : timeDiffSecs < 60 * 60 * 24 * 7 && bottomTime.hours === 0
    ? `${bottomTime.days}d, ${bottomTime.mins}m`
    : timeDiffSecs < 60 * 60 * 24 * 7
    ? `${bottomTime.days}d, ${bottomTime.hours}h` // , ${bottomTime.mins}m
    : timeDiffSecs < 60 * 60 * 24 * 30
    ? `${bottomTime.weeks}w, ${bottomTime.days}d` // , ${bottomTime.hours}h, ${bottomTime.mins}m
    : `${bottomTime.weeks}w`;
  //`${bottomTime.weeks}m, ${bottomTime.weeks}w, ${bottomTime.days}d, ${bottomTime.hours}h, ${bottomTime.mins}mins`;
}

export function time_diff_hours(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

// export function time_diff_days(dt2, dt1) {
//   var diff = (dt2.getTime() - dt1.getTime()) / (1000 * 3600 * 24);
//   // diff /= 60 * 60;
//   return Math.abs(Math.round(diff));
// }

export function formatDate(date) {
  return `${moment(date).format('YYYY-MM-DD')}`;
}

export function isSameDay(date, otherDate) {
  return date.toDateString() === otherDate.toDateString();
}

// Random String
export function randomStr(n) {
  return Math.random().toString(36).substring(n);
}
