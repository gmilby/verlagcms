var Galerie = {
  open: function(html, callback){
    $('body').append('<div id="overlay"></div>').append('<div id="modal_wrapper"><div id="modal"></div></div>');

    var modalWindow = $('#modal');
    modalWindow.html(html);

    var modalWrapper = $('#modal_wrapper');
    var docHeight =  $(window).height();
    var modalHeight =  modalWindow.height() + 42;
    var topMargin = (docHeight - modalHeight) / 2;

    $('#overlay').css({
      'height': docHeight
    }).hide().fadeIn('fast');

    modalWrapper.hide().fadeIn('fast').css({
      'top': topMargin
    });
    if(callback){ callback.call(this); }
  },

  close: function(){
    // if($('#modal_wrapper').visible()){
    //   alert('you can see me')
    // }
    $('#modal_wrapper').fadeOut('fast', function(){
      $(this).remove();
      $('#overlay').fadeOut('fast', function(){
        $(this).remove();
      });
    });
  }
} 

var Utilities = { 
  
  notice: function(message){
    var notice = jQuery('.notice');
    notice.text(message); 
    notice.slideDown('fast');
    setTimeout(function(){
      notice.slideUp('fast')
    }, '2000'); 
  },       
  
  keyboard_nav: function(){
    jQuery('body').keydown(function(e){    
      switch (e.keyCode) {
        // Left Arrow
        case 37:
          $('a.previous').click();
          break;
        // Right Arrow
        case 39:
          $('a.next').click();
          break; 
        // 'W' key
        // case 87:
        //   $('a.cancel').click();
        //   break; 
      }
    });
  }, 
  
  // Adds the '#' tag to all links if the history object is not available   
  // Temp. The zombie tests are failing with the history object...
  check_browser_version: function(){
    if (!Modernizr.history) {     
      jQuery('a').live('click', function(e){
        e.preventDefault();
        document.location.hash = $(this).attr('href');
      });
      var search_form = jQuery('form#search-form');
      search_form.attr('action', '#' + search_form.attr('action'));
    }
  },
  
  formObserver: function(element){      
    jQuery(element).keyup(function() {
      delay(function(){
        var form = jQuery(element).parents('form:first');
        form.submit();
      }, 800);
    });
  }  
  
} 

var iFramer = {       
  initialize: function(element){   
    var trigger = jQuery(element);  
    var self = this;
    if(!trigger) return;
    trigger.load(function(){   
      var iFrameContent = $(this).contents();  
      var flags = iFrameContent.find('a.verlag-editor') ;
      // change to plugin ?
      self.setEditFlags(flags);     
      flags.click(function(){  
        window.top.trigger = $(this);
        window.top.location.hash = $(this).attr('href');  
        return false;
      });
    }); 
  },
  
  setEditFlags: function(element){  
    element.css({
      'position': 'relative',  
      'display':  'block',
      'height':   '0',
      'width':    '0',
      'text-decoration': 'none'    
    }).find('span').css({
      'display': 'block',
      'position': 'absolute', 
      'top': '-24px',
      'left': '12px',
      'padding': '4px 8px', 
      'width': '100px',
      'background': 'rgba(255, 255, 0, 0.7)'
    });
  }
} 

var TabControl = {
  initialize: function(element){
    var tabs = jQuery(element);  
    if(!tabs) return;
    var self = this; 
    tabs.each(function(i, tab){
      $(tab).hide();
    }); 
    tabs.first().show();   
    self.tabControl(jQuery('.tab-control'));
  },
  
  tabControl: function(element){  
    element.click(function(){  
      var partId = $(this).find('label').attr('for').split('-')[1];
      var tabId = 'tab-' + partId;   
      console.log(tabId)
      
      jQuery('.tab').hide(); 
      jQuery('#' + tabId).show();
    })
  }
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
