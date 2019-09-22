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
