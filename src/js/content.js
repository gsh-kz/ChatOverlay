import '../scss/content.scss';
import jQuery from 'jquery';

const status = {
  VISIBLE: 1,
  HIDDEN: 0,
  NONE: -1
};

var ycoContent = ycoContent || {};

ycoContent = (function(){
  console.log('---- Chat Overlay loaded ----')

  const CHAT_SELECTOR = 'ytd-live-chat-frame#chat';
  const OVERLAY_CLASS = 'yco-overlay';

  let _convertStyle = function(request) {
    let state = {
      top: request.top + 'px',
      left: request.left + 'px',
      opacity: request.opacity,
    };
    return state;
  }
  let _visibled = function() {
    if ($(CHAT_SELECTOR) && $(CHAT_SELECTOR).length == 1) {
      return $(CHAT_SELECTOR).hasClass(OVERLAY_CLASS) === true ? status.VISIBLE : status.HIDDEN;
    }
    return status.NONE;
  }
  let _show = function(request) {
    if (_visibled() === status.HIDDEN) {
      $(CHAT_SELECTOR).addClass(OVERLAY_CLASS);
      _update(request);
    }
  }
  let _hide = function() {
    if (_visibled() === status.VISIBLE) {
      $(CHAT_SELECTOR).removeClass(OVERLAY_CLASS).css('opacity', '');
    }
  }
  let _update = function(request) {
    let state = _convertStyle(request);
    $(CHAT_SELECTOR).css(state);
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
    sendResponse({visible: status.VISIBLE});
  }
  if (action == 'hidden') {
    ycoContent.hide();
    sendResponse({visible: status.HIDDEN});
  }
});
