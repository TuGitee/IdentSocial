import Vue from 'vue';

const originalMessage = Vue.prototype.$message;
const newMessage = function (optionsOrMessage) {
  let mergedOptions = {};
  let offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-area-inset-top"));
  if (typeof optionsOrMessage === 'string') {
    mergedOptions.content = optionsOrMessage;
    mergedOptions.offset = offset;
  } else {
    mergedOptions = {...optionsOrMessage, offset: offset };
  }
  return originalMessage(mergedOptions);
};

const createTypedMessage = (type) => {
  return function (optionsOrMessage) {
    let typedOptions = {};
    if (typeof optionsOrMessage === 'string') {
      typedOptions = { type, content: optionsOrMessage };
    } else {
      typedOptions = { type,...optionsOrMessage };
    }
    return newMessage(typedOptions);
  };
};

newMessage.info = createTypedMessage('info');
newMessage.success = createTypedMessage('success');
newMessage.warning = createTypedMessage('warning');
newMessage.error = createTypedMessage('error');

Vue.prototype.$message = newMessage;