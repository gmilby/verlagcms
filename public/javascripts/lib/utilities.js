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

var logger = {
  info: function(message){
    if(window.console){
      console.log(message);
    } 
  },
  
  debug: function(message){
    if(window.console){
      console.log(message);
    } 
  }
}

var Utilities = { 
  
  // Adds the # to each link for use with IE and other older browsers
  setNonHistoryLinks: function(){
   if (!Modernizr.history) {     
     jQuery('a').click(function(e){
       e.preventDefault();
       var el = this;
       var href = jQuery(el).attr('href');
       if(href && !href.match('http://') && !href.match(/^#/)){
         console.log('#' + href);
         document.location.hash = $(this).attr('#' + 'href');
       }
     });
     // var search_form = jQuery('form#search-form');
     // search_form.attr('action', '#' + search_form.attr('action'));
   }

  },
  
  // resizes and centers modals vertically. 
  // Horizontal centering is handled with CSS...
  loadModal: function(element, callback){
    var self = this;
    var container = jQuery(element);
    if(!container.length){ return }

    Loader.start();

    var img = container.find('img');
    if(img.length){
      setTimeout(function(){
        if(container.height() < 20){
          img.load(function(){
            self.resizeModal(img, container, callback);
          });
        } else {
          self.resizeModal(img, container, callback);
        }
      }, 13);
    } else {
      // if there is no image. This needs to move to a function
      var docWidth = jQuery(window).width();
      var docHeight = jQuery(window).height();
      
      container.css({
        'width': '640px',
        'height': '480px',
        'margin-top': (docHeight - 540)/2 + 'px'
      });
      Loader.stop();
      if(callback){ callback.call(this); }
    }

  },
  
  resizeModal: function(img, container, callback){
    var temp_img = img.clone(),
     width = temp_img[0].width,
     height = temp_img[0].height,
     ratio = width / height,
     docWidth = jQuery(window).width(),
     docHeight = jQuery(window).height(),
     margins = 40;
     
     
    if(container.height() > (docHeight - 40)){
      img
        .height(docHeight - 40)
        .width((docHeight - 40) * ratio);
      container
        .height(docHeight - 40)
        .width((docHeight - 40) * ratio);
    } 
    
    if(container.width() > (docWidth - 40)){
      img
        .height((docWidth - 40) / ratio)
        .width(docWidth - 40);
      container
        .height((docWidth - 40) / ratio)
        .width(docWidth - 40);
      container.css({
        'margin-top': (docHeight - ((docWidth - 40) / ratio))/2
      });
    } 
    if(container.width() < (docWidth - 40) && container.height() < (docHeight - 40)) {
      container.css({
        'width': (container.height() * ratio) + 'px',
        'margin-top': (docHeight - container.height())/2
      });
    }
    Loader.stop();
    if(callback){ callback.call(this); }
  },
  
  notice: function(message, options){
    var options = options || {};
    var notice = jQuery('.notice');
    var klass = options['class'] || 'message';
    
    notice
      .html(message) 
      .addClass(klass)
      .fadeIn('fast', function(){
        setTimeout(function(){
          if (!options['persist']){
            notice.fadeOut('slow');
          }
        }, 1800);
      });
  },  
  
  hideNotice: function(){
    jQuery('.notice').fadeOut('slow');    
  },
  
  setTimestamp: function(){
    var now = new Date();
    Verlag.timestamp = now.getTime();
  },
  
  keyboard_nav: function(){      
    jQuery('body').keydown(function(e){ 
      // logger.info(e.keyCode);  
      switch (e.keyCode) {    
        // Left Arrow
        case 37:
          $('a.previous').click();
          break;
        // Right Arrow
        case 39:
          $('a.next').click();
          break; 
      }
    });
  }, 
  
  // Adds the '#' tag to all links if the history object is not available   
  // Temp. The zombie tests are failing with the history object...
  check_browser_version: function(){
    //if (!Modernizr.history) {     
    //  jQuery('a').live('click', function(e){
    //    e.preventDefault();
    //    document.location.hash = $(this).attr('href');
    //  });
    //  var search_form = jQuery('form#search-form');
    //  search_form.attr('action', '#' + search_form.attr('action'));
    //}
  },
  
  formObserver: function(element){      
    // jQuery(element).keyup(function() {
    //   delay(function(){
    //     var form = jQuery(element).parents('form:first');
    //     form.submit();
    //   }, 800);
    // });
  },
  
  unique: function (a) {
    tmp = [];
    for(i=0;i<a.length;i++){
      if(!Utilities.contains(tmp, a[i])){
        tmp.length+=1;
        tmp[tmp.length-1]=a[i];
      }
    }
    return tmp;
  },

  contains: function(a, e) {
    for(j=0;j<a.length;j++)if(a[j]==e)return true;
    return false;
  }
  
} 

var Loader = {
  start: function(element){
    var element = jQuery('#loader');
    if(!element.length){ return }
    
    element.show();
    Loader.timer = setInterval(function(){
      var y = element.css('background-position-y').replace('px','');
      element.css({'background-position-y':  (y - 40) + 'px'});
    }, 67);
  },
  
  stop: function(element){
    var element = jQuery('#loader');
    if(!element.length){ return }
    element.hide();
    clearInterval(Loader.timer);
  }
}

Verlag.Updater = {
  
  update: function(){
    window.ninja = true;
    jQuery.ajax({
      url: '/admin/activity.json',
      type: 'POST',
      data: { 'updated': Verlag.timestamp },
      success: function(data){
        jQuery.each(data.models, function(i, item){
          var object = Page.find(item.id);
          object.merge(item);
          Utilities.setTimestamp();
        });
        window.ninja = false;
      }
    });
  }
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
