import Service from '@ember/service';
import { warn } from '@ember/debug';
import { typeOf } from '@ember/utils';

const EVENT_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'grey', 'black'];

export default Service.extend({
  init() {
    this._super(...arguments);
    const isFastBoot = typeof FastBoot !== 'undefined';
    if (!this.hasCrisp() && (this.config && this.config.environment !== 'test') && !isFastBoot) {
      warn('[Crisp service] - Crisp is not loaded yet', false, {id: 'ember-crisp-not-loaded'});
    }
  },

  crisp: () => window.$crisp,
  hasCrisp: () => !!window.$crisp,
  _callPush(payload) {
    try {
      window.$crisp.push(payload);
    } catch (e) {
      warn(`[Crisp service] - Invalid Crisp "push" call, ${e.message}`, false, {id: 'ember-crisp-push-call-error'});
    }
  },
  _callSet(namespace, value) {
    return this.hasCrisp() && this._callPush(['set', namespace, [value]]);
  },
  _callDo(namespace, args) {
    return this.hasCrisp() && this._callPush(['do', namespace, args]);
  },
  _callOn(namespace, callback) {
    return this.hasCrisp() && this._callPush(['on', namespace, callback]);
  },
  _callOff(namespace) {
    return this.hasCrisp() && this._callPush(['off', namespace]);
  },
  _callConfig(namespace, value) {
    return this.hasCrisp() && this._callPush(['config', namespace, value]);
  },
  _callGet(namespace, key) {
    try {
      return window.$crisp.get(namespace, key);
    } catch (e) {
      warn(`[Crisp service] - Invalid Crisp "get" call, ${e.message}`, false, {id: 'ember-crisp-get-call-error'});
    }
  },
  _callIs(namespace) {
    try {
      return window.$crisp.is(namespace);
    } catch (e) {
      warn(`[Crisp service] - Invalid Crisp "is" call, ${e.message}`, false, {id: 'ember-crisp-is-call-error'});
    }
  },
  _callHelp: () => !!window.$crisp && window.$crisp.help(),
  _callSafe: () => !!window.$crisp && window.$crisp.safe(),

  // Interactions
  open() {
    return this._callDo('chat:open'), this;
  },
  close() {
    return this._callDo('chat:close'), this;
  },
  toggle() {
    return this._callDo('chat:toggle'), this;
  },
  show() {
    return this._callDo('chat:show'), this;
  },
  hide() {
    return this._callDo('chat:hide'), this;
  },

  // Messaging
  sendMessage(type, content) {
    return this._callDo('message:send', [type, content]), this;
  },
  sendTextMessage(message) {
    return this.sendMessage('text', message);
  },
  sendFileMessage(url, type, name) {
    return this.sendMessage('file', {url, name, type});
  },
  sendAnimationMessage(url, type) {
    return this.sendMessage('animation', {url, type});
  },
  sendAudioMessage(url, type, duration) {
    return this.sendMessage('audio', {duration, url, type});
  },
  showMessage(type, content) {
    return this._callDo('message:show', [type, content]), this;
  },
  showTextMessage(message) {
    return this.showMessage('text', message);
  },
  showAnimationMessage(url, type) {
    return this.showMessage('animation', {url, type});
  },
  showPickerMessage(id, text, choices) {
    choices.forEach((choice) => {
      if(typeOf(choice) !== 'object' || !choice.hasOwnProperty('value') || !choice.hasOwnProperty('label')) {
        warn('[Crisp service] - Picker choice must be an object with two keys, value & label.', false, {id: 'ember-crisp-invalid-picker-choice-definition'});
      }
    })
    return this.showMessage('picker', {id, text, choices});
  },
  showFieldMessage(id, text, explain) {
    return this.showMessage('field', {id, text, explain});
  },
  markAsRead() {
    return this._callDo('message:read'), this;
  },

  reset(reload) {
    return this._callDo('session:reset', [reload]), this;
  },

  // triggers & Listeners
  run(identifier) {
    return this._callDo('trigger:run', [identifier]), this;
  },
  on(namespace, callback) {
    return this._callOn(namespace, callback), this;
  },

  // System
  config(namespace, value) {
    return this._callConfig(namespace, value), this;
  },
  help() {
    return this._callHelp();
  },
  safe() {
    return this._callSafe();
  },

  // States
  isOpened() {
    return this._callIs('chat:opened');
  },
  isClosed() {
    return this._callIs('chat:closed');
  },
  isVisible() {
    return this._callIs('chat:visible');
  },
  isSmall() {
    return this._callIs('chat:small');
  },
  isLarge() {
    return this._callIs('chat:large');
  },
  isOngoing() {
    return this._callIs('session:ongoing');
  },
  isAvailable() {
    return this._callIs('website:available');
  },

  // Getters
  getIdentifier() {
    return this._callGet('session:identifier');
  },
  getUnreadCount() {
    return this._callGet('chat:unread:count');
  },
  getData(key) {
    return this._callGet('session:data', key);
  },
  getEmail() {
    return this._callGet('user:email');
  },
  getPhone() {
    return this._callGet('user:phone');
  },
  getNickname() {
    return this._callGet('user:nickname');
  },
  getAvatar() {
    return this._callGet('user:avatar');
  },

  // Setters
  setText(message) {
    return this._callSet('message:text', message), this;
  },
  setSegments(segments) {
    let arraySegments = arguments.length > 1 ? [...arguments] : segments;
    return this._callSet('session:segments', arraySegments), this;
  },
  setData(values) {
    let arrayValues = [];

    if (arguments.length === 2) {
      arrayValues.push([arguments[0], arguments[1]]);
    } else {
      if(typeOf(values) === 'object') {
        const keys = Object.keys(values);
        keys.forEach((key) => arrayValues.push([key, values[key]]));
      } else {
        arrayValues = values;
      }
    }

    arrayValues.forEach((data) => {
      if(['string', 'boolean', 'number'].indexOf(typeOf(data[1])) < 0) {
        warn(`[Crisp service] - ${data[0]} value must be either a string, boolean or number`, false, {id: 'ember-crisp-invalid-data-format'});
      }
    });

    return this._callSet('session:data', arrayValues), this;
  },
  setEvent(data) {
    return this.setEvents([data]);
  },
  setEvents(events) {
    events.forEach((event) => {
      if(event[2] && EVENT_COLORS.indexOf(event[2]) < 0) {
        warn(`[Crisp service] - Invalid color provided "${event[2]}" for event "${event[0]}" : color must be either ${EVENT_COLORS.join(',')}`, false, {id: 'ember-crisp-invalid-event-color'});
      }
    });
    return this._callSet('session:event', events), this;
  },
  setEmail(email) {
    return this._callSet('user:email', email), this;
  },
  setPhone(phone) {
    return this._callSet('user:phone', phone), this;
  },
  setNickname(nickname) {
    return this._callSet('user:nickname', nickname), this;
  },
  setAvatar(avatar) {
    return this._callSet('user:avatar', avatar), this;
  }
});
