import '../scss/content.scss';

import {overlayState} from './modules.js';

var ycoContent = ycoContent || {};

ycoContent = (function(){
  console.log('---- Chat Overlay loaded ----');
  const CHAT_SELECTOR = 'ytd-live-chat-frame#chat';
  const OVERLAY_CLASS = 'yco-overlay';

  let _styleValues = function(request) {
    let state = '';
    for (const [key, val] of Object.entries(request)) {
      if (`${key}` !== 'action') {
        state = state + `${key}:${val};`;
      }
    }
    return state;
  }
  let _chatElement = function() {
    return document.querySelector(CHAT_SELECTOR);
  }
  let _visibled = function() {
    const elm = _chatElement();
    if (elm) {
      return elm.classList.contains(OVERLAY_CLASS) === true ? overlayState.VISIBLE : overlayState.HIDDEN;
    }
    return overlayState.NONE;
  }
  let _show = function(request) {
    if (_visibled() === overlayState.HIDDEN) {
      _chatElement().classList.add(OVERLAY_CLASS);
      _update(request);
    }
  }
  let _hide = function() {
    if (_visibled() === overlayState.VISIBLE) {
      _chatElement().classList.remove(OVERLAY_CLASS);
      _chatElement().setAttribute("style", "opacity:''");
    }
  }
  let _update = function(request) {
    const values = _styleValues(request);
    _chatElement().setAttribute("style", values);
  }
  return {
    isVisibled: _visibled,
    show: _show,
    hide: _hide,
    update: _update
  }
}());

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  let action = request.action;
  if (action == "visible") {
    sendResponse({visible: ycoContent.isVisibled()});
  }
  if (action == "update") {
    ycoContent.update(request);
    sendResponse({visible: ycoContent.isVisibled()});
  }
  if (action == 'show') {
    ycoContent.show(request);
    sendResponse({visible: overlayState.VISIBLE});
  }
  if (action == 'hidden') {
    ycoContent.hide();
    sendResponse({visible: overlayState.HIDDEN});
  }
});
