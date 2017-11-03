/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-crisp',
  contentFor: function (type, config) {
    if (type === 'head-footer') {
      if (!config.crisp || !config.crisp.WEBSITE_ID) {
        return '';
      }
      return `<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="${config.crisp.WEBSITE_ID}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>`;
    }
  }
};
