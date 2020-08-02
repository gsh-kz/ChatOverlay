import '../scss/popup.scss';
import jQuery from 'jquery';
import 'bootstrap';

const status = {
  VISIBLE: 1,
  HIDDEN: 0,
  NONE: -1
};

var ycoPopup = ycoPopup || {};

ycoPopup = (function() {
  let _state = {
    left: 10,
    top: 100,
    opacity: 0.4,
    visible: false
  };
  let _visible = function(visibled) {
    _state.visible = visibled;
  }
  let _updateComponent = function(visibled) {
    if (visibled != undefined) {
      _visible(visibled);
      _disabled(visibled === status.NONE);
    }
    $('#text_left').text(_state.left + 'px');
    $('#range_left').val(_state.left);

    $('#text_top').text(_state.top + 'px');
    $('#range_top').val(_state.top);
    
    $('#text_opacity').text(_state.opacity);
    $('#range_opacity').val(_state.opacity);
    
    if (_state.visible === status.VISIBLE) {
      $('#btn_show').hide();
      $('#btn_revart').show();
    } else if (_state.visible === status.HIDDEN) {
      $('#btn_show').show();
      $('#btn_revart').hide();
    }
  }
  let _disabled = function(disabled) {
    $('#range_left').prop('disabled', disabled);
    $('#range_top').prop('disabled', disabled);
    $('#range_opacity').prop('disabled', disabled);
    $('#btn_show').prop('disabled', disabled);
    $('#btn_revart').prop('disabled', disabled);
    $('#btn_reset').prop('disabled', disabled);
  }
  let _initialize = function() {
    chrome.storage.local.get(_state, function(items){
      $.extend(_state, items);
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: 'visible'}, function(response){
        if (chrome.runtime.lastError) {
          console.log('error: ' + chrome.runtime.lastError.message);
          $('#message').show();
          return;
        }
        _updateComponent(response.visible);
        $('#content').show();
      });
    });
  }
  let _updateState = function(data) {
    $.extend(_state, data);
    _updateComponent();
    chrome.storage.local.set(_state, function(){});
  }
  return {
    initialize: _initialize,
    updateState: _updateState,
    updateComponent: _updateComponent,
    state: _state,
  }
}());

$(function() {
  ycoPopup.initialize();

  $('#btn_show').on('click', function(e) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var params = $.extend({}, ycoPopup.state, {action: 'show'});
      chrome.tabs.sendMessage(
        tabs[0].id,
        params,
        function(response) {
          ycoPopup.updateComponent(response.visible);
      }
      );
    });
  });
  $('#btn_revart').on('click', function(e) {
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
  $('#range_left,#range_top,#range_opacity').on('input', function(e) {
    var data = {
      top: $('#range_top').val() * 1,
      left: $('#range_left').val() * 1,
      opacity: $('#range_opacity').val() * 1
    };
    ycoPopup.updateState(data);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var params = $.extend({}, ycoPopup.state, {action: 'update'});
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
