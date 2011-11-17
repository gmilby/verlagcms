// Events
// --------------------------------------------- //
// TODO Organize all live events into a central spot 
// and bind them with sammy events

// Reloads iframe
jQuery('a.page-reload').live('click', function(){
  var id = jQuery(this).attr('href').split('/')[3];
  var page_frame = jQuery('iframe#page-iframe-' + id);
  // var src = pageFrame.attr('src');
  page_frame.attr('src', page_frame.attr('src'));
  Utilities.hideNotice();
});

// Temp? Hides notices when changing pages...
jQuery('div#sidebar a').live('click', function(){
  Utilities.hideNotice();
});

// Resizes Modals on window resize
jQuery(window).resize(function(){
  var container = jQuery('div#asset-editor'); 
  Utilities.loadModal(container);
});

// Inserts href into the open ACE editor
jQuery('a.insert-file').live('click', function(e){ 
  e.preventDefault();
  window.editor.insert($(this).attr('href')); 
});

// Triggers Asset info popups
jQuery('a.info-icon').live('click', function(e){
  e.preventDefault();
  current_asset_id = this.id.split('-')[2];
  Assets.trigger('show_info', { 'current_asset_id': current_asset_id });
});

// Removes modal-strips 
jQuery('a.close-modal-strip').live('click', function(e){
  e.preventDefault();
  jQuery('div.modal-strip').fadeOut('fast', function(){
    jQuery(this).remove();
  });
});

// Triggers Asset remove popups
jQuery('a.remove-icon').live('click', function(e){
  e.preventDefault();
  current_asset_id = this.id.split('-')[2];
  Assets.trigger('show_remove_dialog', { 'current_asset_id': current_asset_id });
});
// --------------------------------------------- //