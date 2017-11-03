# ember-cli-crisp

[Crisp](https://crisp.chat/en/) integration for Ember.

## Installation

```bash
ember install ember-cli-crisp
```

## Configuration

Place this in your `config/environment.js`:

```javascript
ENV['crisp'] = {
  WEBSITE_ID: 'YOUR_WEBSITE_ID_HERE'
};
```

You can get your website ID here by getting your chatbox code here : https://app.crisp.chat/settings/websites/

The code should look like:

```
<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="e6063492-9620-4c95-b9a2-939f552a9d6e";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
```

Here, `e6063492-9620-4c95-b9a2-939f552a9d6e` is the website ID.

## Usage

The addon creates a service named `crisp` that you can use like so:

For example in your `controllers/application.js`:

```javascript
import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  crisp: inject(),

  actions: {
    openCrispChat() {
      this.get('crisp').open();
    }
  }
});

```

## Advanced Usage

You can show unread message count in your template :

For example in your `controllers/application.js`:

```javascript
// ...
import { later } from '@ember/runloop';

export default Controller.extend({
  crisp: inject(),
  crispNotificationCount: 0,

  // ...

  init() {
    this._super(...arguments);

    const controller = this;
    const crisp = this.get('crisp');

    crisp.on(
      'session:loaded',
      () => later(() => controller.set('crispNotificationCount',
      crisp.getUnreadCount()), 100));
    crisp.on(
      'message:received',
      () => controller.set('crispNotificationCount', crisp.getUnreadCount())
    );
    crisp.on(
      'chat:initiated',
      () => controller.set('crispNotificationCount', crisp.getUnreadCount())
    );
    crisp.on(
      'chat:opened',
      () => later(() => controller.set('crispNotificationCount',
      crisp.getUnreadCount()), 1000));
  },

  // ...

});

```
Template `templates/application.hbs`:

```html

<a href="#" {{action 'openCrispChat'}}>Live support {{#if crispNotificationCount}}<span class="badge">{{crispNotificationCount}}</span>{{/if}}</a>

<button class="btn btn-primary" type="button" {{action 'openCrispChat'}}>
  Messages {{#if crispNotificationCount}}<span class="badge">{{crispNotificationCount}}</span>{{/if}}
</button>

```

## The defined methods are:

### Interactions
 * open()
 * close()
 * toggle()
 * show()
 * hide()

### Messaging
 * sendTextMessage(message)
 * sendFileMessage(url, type, name)
 * sendAnimationMessage(url, type)
 * sendAudioMessage(url, type, duration)
 * showTextMessage(message)
 * showAnimationMessage(url, type)
 * showPickerMessage(id, text, choices)
 * showFieldMessage(id, text, explain)
 * markAsRead()
 * reset(reload)

### Triggers & Listeners
 * run(identifier)
 * on(namespace, callback)

### System
 * config(namespace, value)
 * help()
 * safe()

### States
 * isOpened()
 * isClosed()
 * isVisible()
 * isSmall()
 * isLarge()
 * isOngoing()
 * isAvailable()

### Getters
 * getIdentifier()
 * getUnreadCount()
 * getData(key)
 * getEmail()
 * getPhone()
 * getNickname()
 * getAvatar()

### Setters
 * setText(message)
 * setSegments(segments)
 * setData(values)
 * setEvent(data)
 * setEvents(events)
 * setEmail(email)
 * setPhone(phone)
 * setNickname(nickname)
 * setAvatar(avatar)

[see more details in the official documentation.](https://help.crisp.chat/answer/which-crisp-events-are-available/)
