import '../scss/popup.scss';

import {overlayState, ChatState} from './modules.js';

var ycoPopup = ycoPopup || {};

ycoPopup = (function() {
  let _state = new ChatState();
  let _updateComponent = function(visibled) {
    if (visibled != undefined) {
      _disabled(visibled === overlayState.NONE);
    }
    document.getElementById('text_left').textContent = _state.left + 'px';
    document.getElementById('range_left').value = _state.left;

    document.getElementById('text_top').textContent = _state.top + 'px';
    document.getElementById('range_top').value = _state.top;
    
    document.getElementById('text_opacity').textContent = _state.opacity + 'px';
    document.getElementById('range_opacity').value = _state.opacity;
    
    if (visibled === overlayState.VISIBLE) {
      document.getElementById('btn_show').style.display = 'none';
      document.getElementById('btn_revart').style.display = 'block';
    } else if (visibled === overlayState.HIDDEN) {
      document.getElementById('btn_show').style.display = 'block';
      document.getElementById('btn_revart').style.display = 'none';
    }
  }
  let _disabled = function(disabled) {
    document.querySelectorAll('input[type=range],button')
      .forEach(function(elm){
        elm.disabled = disabled;
      });
  }
  let _initialize = function() {
    chrome.storage.local.get(_state.toData(), function(items){
      _state = ChatState.of(items);
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: 'visible'}, function(response){
        if (chrome.runtime.lastError) {
          console.log('error: ' + chrome.runtime.lastError.message);
          document.getElementById('message').style.display = 'block';
          return;
        }
        _updateComponent(response.visible);
        document.getElementById('content').style.display = 'block';
      });
    });
  }
  let _updateState = function(data) {
    _state = ChatState.of(data);
    _updateComponent();
    chrome.storage.local.set(_state.toData(), function(){});
  }
  let _styleValues = function() {
    return _state.toCssStyle();
  }
  return {
    initialize: _initialize,
    updateState: _updateState,
    updateComponent: _updateComponent,
    styleValues: _styleValues,
  }
}());

function callback() {
  ycoPopup.initialize();

  document.getElementById('btn_show').addEventListener('click', function(e) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var params = ycoPopup.styleValues();
      params.action = 'show';
      chrome.tabs.sendMessage(
        tabs[0].id,
        params,
        function(response) {
          ycoPopup.updateComponent(response.visible);
      }
      );
    });
  });

  document.getElementById('btn_revart').addEventListener('click', function(e) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(
        tabs[0].id,
        {action: 'hidden'},
        function(response) {
          ycoPopup.updateComponent(response.visible);
        }
      );
    });
  });

  document.querySelectorAll('#range_left,#range_top,#range_opacity')
    .forEach(function(range) {
      range.addEventListener('input', function(e) {
      var data = {
        left: document.getElementById('range_left').value * 1,
        top: document.getElementById('range_top').value * 1,
        opacity: document.getElementById('range_opacity').value * 1
      };
      ycoPopup.updateState(data);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        var params = ycoPopup.styleValues();
        params.action = 'update';
        chrome.tabs.sendMessage(
          tabs[0].id,
          params,
          function(response) {
            ycoPopup.updateComponent(response.visible);
          }
        );
      });
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', callback);
} else {
  callback();
}
