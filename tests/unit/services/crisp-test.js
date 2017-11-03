import { moduleFor, test, skip } from 'ember-qunit';

const Crisp = {
  pushes: [],
  push() {
    return this.pushes.push(...arguments);
  }
};

moduleFor('service:crisp', 'Unit | Service | crisp', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  beforeEach() {
    window.$crisp = Crisp;
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  assert.expect(1);

  let service = this.subject();
  assert.ok(service);
});

test('it returns crisp object as expected', function(assert) {
  assert.expect(1);

  let service = this.subject();
  assert.deepEqual(service.crisp(), Crisp);
});

test('it returns crisp status as expected', function(assert) {
  assert.expect(2);

  let service = this.subject();
  assert.equal(service.hasCrisp(), true);

  window.$crisp = undefined;
  assert.equal(service.hasCrisp(), false);
});

test('it calls help method as expected', function(assert) {
  assert.expect(1);

  window.$crisp.help = function() {
    assert.step('Help method is called');
  };

  let service = this.subject();
  service.help();
});

test('it calls safe method as expected', function(assert) {
  assert.expect(1);

  window.$crisp.safe = function() {
    assert.step('Safe method is called');
  };

  let service = this.subject();
  service.safe();
});

test('it opens chat as expected', function(assert) {
  assert.expect(3);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'chat:open');
  };

  let service = this.subject();
  assert.deepEqual(service.open(), service);
});

test('it closes chat as expected', function(assert) {
  assert.expect(3);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'chat:close');
  };

  let service = this.subject();
  assert.deepEqual(service.close(), service);
});

test('it toggles chat as expected', function(assert) {
  assert.expect(3);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'chat:toggle');
  };

  let service = this.subject();
  assert.deepEqual(service.toggle(), service);
});

test('it shows chat as expected', function(assert) {
  assert.expect(3);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'chat:show');
  };

  let service = this.subject();
  assert.deepEqual(service.show(), service);
});

test('it hides chat as expected', function(assert) {
  assert.expect(3);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'chat:hide');
  };

  let service = this.subject();
  assert.deepEqual(service.hide(), service);
});

test('it sets user:email as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'user:email');
    assert.equal(payload[2], 'email@example.com');
  };

  let service = this.subject();
  assert.deepEqual(service.setEmail('email@example.com'), service);
});

test('it sets user:phone as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'user:phone');
    assert.equal(payload[2], '+33612345789');
  };

  let service = this.subject();
  assert.deepEqual(service.setPhone('+33612345789'), service);
});

test('it sets user:nickname as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'user:nickname');
    assert.equal(payload[2], 'John Doe');
  };

  let service = this.subject();
  assert.deepEqual(service.setNickname('John Doe'), service);
});

test('it sets user:avatar as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'user:avatar');
    assert.equal(payload[2], 'https://www.example.com/avatar.jpg');
  };

  let service = this.subject();
  assert.deepEqual(service.setAvatar('https://www.example.com/avatar.jpg'), service);
});

test('it sets unique event as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'session:event');
    assert.deepEqual(payload[2], [[['event_1', 'data_1', 'green']]]);
  };

  let service = this.subject();
  assert.deepEqual(service.setEvent(['event_1', 'data_1', 'green']), service);
});

skip('it throws an error if an event color is invalid', function(assert) {
  assert.expect(1);

  let service = this.subject();
  assert.throws(service.setEvents([['event_1', 'data_1', 'green']]), 'WARNING: [Crisp service] - Invalid Crisp "push" call, Assertion occured after test had finished.');
});

test('it sets a simple data as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'session:data');
    assert.deepEqual(payload[2], [[['key', 'value']]]);
  };

  let service = this.subject();
  assert.deepEqual(service.setData('key', 'value'), service);
});

test('it sets data as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'session:data');
    assert.deepEqual(payload[2], [[['key1', 'value2'],['key1', 'value2']]]);
  };

  let service = this.subject();
  assert.deepEqual(service.setData([['key1', 'value2'],['key1', 'value2']]), service);
});

skip('it throws an error if an invalid value type is passed', function(assert) {
  assert.expect(1);

  let service = this.subject();
  assert.throws(service.setData('key', new Date), /value must be either a string, boolean or number/, 'Raised error message contains "value must be either a string, boolean or number"');
});

test('it sets segments as expected', function(assert) {
  assert.expect(8);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'session:segments');
    assert.deepEqual(payload[2], [['segment1', 'segment2', 'segment3']]);
  };

  let service = this.subject();
  assert.deepEqual(service.setSegments(['segment1', 'segment2', 'segment3']), service);
  assert.deepEqual(service.setSegments('segment1', 'segment2', 'segment3'), service);
});

test('it sets text message as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'set');
    assert.equal(payload[1], 'message:text');
    assert.deepEqual(payload[2], ['text message content']);
  };

  let service = this.subject();
  assert.deepEqual(service.setText('text message content'), service);
});

test('it gets user:avatar as expected', function(assert) {
  assert.expect(3);

  window.$crisp.get = function() {
    assert.equal(arguments[0], 'user:avatar');
    assert.equal(arguments[1], undefined);
    return arguments[0];
  };

  let service = this.subject();
  assert.equal(service.getAvatar(), 'user:avatar');
});

test('it gets user:nickname as expected', function(assert) {
  assert.expect(3);

  window.$crisp.get = function() {
    assert.equal(arguments[0], 'user:nickname');
    assert.equal(arguments[1], undefined);
    return arguments[0];
  };

  let service = this.subject();
  assert.equal(service.getNickname(), 'user:nickname');
});

test('it gets user:phone as expected', function(assert) {
  assert.expect(3);

  window.$crisp.get = function() {
    assert.equal(arguments[0], 'user:phone');
    assert.equal(arguments[1], undefined);
    return arguments[0];
  };

  let service = this.subject();
  assert.equal(service.getPhone(), 'user:phone');
});

test('it gets user:email as expected', function(assert) {
  assert.expect(3);

  window.$crisp.get = function() {
    assert.equal(arguments[0], 'user:email');
    assert.equal(arguments[1], undefined);
    return arguments[0];
  };

  let service = this.subject();
  assert.equal(service.getEmail(), 'user:email');
});

test('it gets session:data as expected', function(assert) {
  assert.expect(3);

  window.$crisp.get = function() {
    assert.equal(arguments[0], 'session:data');
    assert.equal(arguments[1], 'key');
    return `${arguments[0]}:${arguments[1]}`;
  };

  let service = this.subject();
  assert.equal(service.getData('key'), 'session:data:key');
});

test('it gets chat:unread:count as expected', function(assert) {
  assert.expect(3);

  window.$crisp.get = function() {
    assert.equal(arguments[0], 'chat:unread:count');
    assert.equal(arguments[1], undefined);
    return 10;
  };

  let service = this.subject();
  assert.equal(service.getUnreadCount(), 10);
});

test('it gets session:identifier as expected', function(assert) {
  assert.expect(3);

  window.$crisp.get = function() {
    assert.equal(arguments[0], 'session:identifier');
    assert.equal(arguments[1], undefined);
    return null;
  };

  let service = this.subject();
  assert.equal(service.getIdentifier(), null);
});

test('it gets website:available state as expected', function(assert) {
  assert.expect(2);

  window.$crisp.is = function() {
    assert.equal(arguments[0], 'website:available');
    return true;
  };

  let service = this.subject();
  assert.equal(service.isAvailable(), true);
});

test('it gets session:ongoing state as expected', function(assert) {
  assert.expect(2);

  window.$crisp.is = function() {
    assert.equal(arguments[0], 'session:ongoing');
    return true;
  };

  let service = this.subject();
  assert.equal(service.isOngoing(), true);
});

test('it gets chat:large state as expected', function(assert) {
  assert.expect(2);

  window.$crisp.is = function() {
    assert.equal(arguments[0], 'chat:large');
    return true;
  };

  let service = this.subject();
  assert.equal(service.isLarge(), true);
});

test('it gets chat:small state as expected', function(assert) {
  assert.expect(2);

  window.$crisp.is = function() {
    assert.equal(arguments[0], 'chat:small');
    return true;
  };

  let service = this.subject();
  assert.equal(service.isSmall(), true);
});

test('it gets chat:visible state as expected', function(assert) {
  assert.expect(2);

  window.$crisp.is = function() {
    assert.equal(arguments[0], 'chat:visible');
    return true;
  };

  let service = this.subject();
  assert.equal(service.isVisible(), true);
});

test('it gets chat:closed state as expected', function(assert) {
  assert.expect(2);

  window.$crisp.is = function() {
    assert.equal(arguments[0], 'chat:closed');
    return true;
  };

  let service = this.subject();
  assert.equal(service.isClosed(), true);
});

test('it gets chat:opened state as expected', function(assert) {
  assert.expect(2);

  window.$crisp.is = function() {
    assert.equal(arguments[0], 'chat:opened');
    return true;
  };

  let service = this.subject();
  assert.equal(service.isOpened(), true);
});

test('it sets config as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'config');
    assert.equal(payload[1], 'position:reverse');
    assert.deepEqual(payload[2], true);
  };

  let service = this.subject();
  assert.deepEqual(service.config('position:reverse', true), service);
});

test('it runs triggers as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'trigger:run');
    assert.deepEqual(payload[2], ['growth-hack-1']);
  };

  let service = this.subject();
  assert.deepEqual(service.run('growth-hack-1'), service);
});

test('it inits listeners as expected', function(assert) {
  assert.expect(4);

  const callback = () => 'loaded';

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'on');
    assert.equal(payload[1], 'session:loaded');
    assert.deepEqual(payload[2], callback);
  };

  let service = this.subject();
  assert.deepEqual(service.on('session:loaded', callback), service);
});

test('it launchs session reset as expected', function(assert) {
  assert.expect(4);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'session:reset');
    assert.deepEqual(payload[2], [false]);
  };

  let service = this.subject();
  assert.deepEqual(service.reset(false), service);
});

test('it marks messages as read as expected', function(assert) {
  assert.expect(3);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:read');
  };

  let service = this.subject();
  assert.deepEqual(service.markAsRead(), service);
});

test('it sends text message as expected', function(assert) {
  assert.expect(5);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:send');
    assert.equal(payload[2][0], 'text');
    assert.equal(payload[2][1], 'text message content');
  };

  let service = this.subject();
  assert.deepEqual(service.sendTextMessage('text message content'), service);
});

test('it sends file message as expected', function(assert) {
  assert.expect(5);

  const fileData = {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Europa-moon.jpg/600px-Europa-moon.jpg',
    type: 'image/jpg',
    name: 'Europa.jpg'
  }

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:send');
    assert.equal(payload[2][0], 'file');
    assert.deepEqual(payload[2][1], fileData);
  };

  let service = this.subject();
  assert.deepEqual(service.sendFileMessage(fileData.url, fileData.type, fileData.name), service);
});

test('it sends animation message as expected', function(assert) {
  assert.expect(5);

  const fileData = {
    url: 'https://media.giphy.com/media/3oz8xPjPPvOwrGjip2/giphy.gif',
    type: 'image/gif'
  }

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:send');
    assert.equal(payload[2][0], 'animation');
    assert.deepEqual(payload[2][1], fileData);
  };

  let service = this.subject();
  assert.deepEqual(service.sendAnimationMessage(fileData.url, fileData.type), service);
});

test('it sends audio message as expected', function(assert) {
  assert.expect(5);

  const fileData = {
    url: 'https://storage.crisp.chat/users/upload/operator/aa0b64dd-9fb4-4db9-80d6-5a49eb84087b/d70935e1-c79e-4199-9568-944541657b78.webm',
    type: 'audio/webm',
    duration: 40
  }

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:send');
    assert.equal(payload[2][0], 'audio');
    assert.deepEqual(payload[2][1], fileData);
  };

  let service = this.subject();
  assert.deepEqual(service.sendAudioMessage(fileData.url, fileData.type, fileData.duration), service);
});

test('it shows text message as expected', function(assert) {
  assert.expect(5);

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:show');
    assert.equal(payload[2][0], 'text');
    assert.equal(payload[2][1], 'text message content');
  };

  let service = this.subject();
  assert.deepEqual(service.showTextMessage('text message content'), service);
});

test('it send animation message as expected', function(assert) {
  assert.expect(5);

  const fileData = {
    url: 'https://media.giphy.com/media/3oz8xPjPPvOwrGjip2/giphy.gif',
    type: 'image/gif'
  }

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:show');
    assert.equal(payload[2][0], 'animation');
    assert.deepEqual(payload[2][1], fileData);
  };

  let service = this.subject();
  assert.deepEqual(service.showAnimationMessage(fileData.url, fileData.type), service);
});

test('it shows picker message as expected', function(assert) {
  assert.expect(5);

  const pickerData = {
    id: 'call-date',
    text: 'Pick your date!',
    choices: [{
      value: '1',
      label: 'Today, 1:00PM.',
      selected: false
    }, {
      value: '2',
      label: 'Tomorrow, 3:45PM.',
      selected: false
    }]
  }

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:show');
    assert.equal(payload[2][0], 'picker');
    assert.deepEqual(payload[2][1], pickerData);
  };

  let service = this.subject();
  assert.deepEqual(service.showPickerMessage(pickerData.id, pickerData.text, pickerData.choices), service);
});

test('it send field message as expected', function(assert) {
  assert.expect(5);

  const fieldData = {
    id: 'name-field',
    text: 'What is your name?',
    explain: 'Enter your name...'
  }

  window.$crisp.push = function(payload) {
    assert.equal(payload[0], 'do');
    assert.equal(payload[1], 'message:show');
    assert.equal(payload[2][0], 'field');
    assert.deepEqual(payload[2][1], fieldData);
  };

  let service = this.subject();
  assert.deepEqual(service.showFieldMessage(fieldData.id, fieldData.text, fieldData.explain), service);
});
