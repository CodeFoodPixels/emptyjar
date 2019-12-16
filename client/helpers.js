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
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date
    .getUTCDate()
    .toString()
    .padStart(2, "0")}`;
};
