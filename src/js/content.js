import '../scss/content.scss';
import jQuery from 'jquery';

var ycoContent = ycoContent || {};

ycoContent = (function(){
  console.log('---- Chat Overlay loaded ----')
  $('body').attr('yco-visibled', false);

  var TARGET = 'ytd-live-chat-frame#chat';

  var _convertStyle = function(request) {
    var state = {
      top: request.top + 'px',
      left: request.left + 'px',
      opacity: request.opacity,
    };
    return state;
  }
  var _visibled = function() {
    return $('body').attr('yco-visibled') === 'true';
  }
  var _show = function(request) {
    if (!_visibled()) {
      $('body').attr('yco-visibled', true);
      $(TARGET).addClass('yco-overlay');
      _update(request);
    }
  }
  var _hide = function() {
    if (_visibled()) {
      $('body').attr('yco-visibled', false);
      $(TARGET).removeClass('yco-overlay').css('opacity', '');
    }
  }
  var _update = function(request) {
    var state = _convertStyle(request);
    $(TARGET).css(state);
  }
  return {
    isVisibled: _visibled,
    show: _show,
    hide: _hide,
    update: _update
  }
}());

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  var action = request.action;
  if (action == "visible") {
    sendResponse({visible: ycoContent.isVisibled()});
  }
  if (action == "update") {
    ycoContent.update(request);
    sendResponse({visible: ycoContent.isVisibled()});
  }
  if (action == 'show') {
    ycoContent.show(request);
    sendResponse({visible: true});
  }
  if (action == 'hidden') {
    ycoContent.hide();
    sendResponse({visible: false});
  }
});
