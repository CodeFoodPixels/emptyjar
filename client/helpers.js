export const throttle = (callback, time) => {
  let timeout;
  let args;

  return function() {
    args = arguments;

    if (!timeout) {
      timeout = setTimeout(() => {
        callback.apply(this, args);
        timeout = undefined;
        args = undefined;
      }, time);
    }
  };
};

export const dateYMD = date => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};
