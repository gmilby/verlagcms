var Parts = Sammy(function (app) {   
  
  var context = this;  
  
  // Helper Methods 
  // ---------------------------------------------
  app.helpers({  
    // Render Part
    render_part: function(part, page, template){
      var application = this;  
      var edit_part = application.load(jQuery('script#admin-' + template + '-edit')).interpolate({ 
        part: part.asJSON(),
        page: page.asJSON(),
        assets: Asset.asJSON()
      }, 'mustache');
      edit_part.appendTo(jQuery('body')).then(function(){
        var modal_editor = jQuery('.modal-editor');
        
        // Just needed for positioning of editor
        // Can be removed if a unified editor is added
        var iframe_content = $('iframe').contents();  
        var part_editor = iframe_content.find('#editor-' + part.id());
        modal_editor.fadeIn('fast').css({
          'top' : part_editor.offset().top - iframe_content.find('body').scrollTop() + 'px',
          'left':  part_editor.offset().left + 400 + 'px'
        });
        
        // Triggers Sanskrit editor
        application.trigger('sanskrit', modal_editor);
        
        // For image parts only. Otherwise ignored
        application.set_asset_links(part, page);
        jQuery('#ajax_uploader')
          .attr('multiple','multiple')
          .change(function(e){
            var form = jQuery(this).parents('form:first');
            jQuery('.progress').slideDown('slow',function(){
              form.submit();
            });
          });
        application.trigger('page-index');
        context.modal = true;
      });
    },
    
    // Sets add asset links
    set_asset_links: function(part, page){
      jQuery('#search-results-container li.asset').each(function(i, el){
        var link = jQuery(el).find('a');
        var asset_id = jQuery(el).attr('id').split('-')[1];
        link.click(function(e){
          e.preventDefault();
          // Updates part
          var parts = page.attr('parts'); 
          var length = parts.length;
          for (var i=0, l=length; i<l; ++i ){
            var p = parts[i];
            if(part.id() == p.id){
              p.asset_id = asset_id;
              part.attr('asset_id', asset_id);
              part.save();
            }
          }
          page.save(function(success){
            jQuery('.modal-editor').remove();
            // TODO Change to sammy method
            context.modal = false;
            document.location.hash = '#' + page.attr('admin_path');
          });
        });
      });
    }
    
  });  
  
  // Initialize Sanskrit Editor
  // ---------------------------------------------
  app.bind('sanskrit', function(e, element){
    if(!element.length){ return true }
    var textareas = element.find('textarea.sanskrit');
    textareas.each(function(i, t){
      var editor = new Sanskrit(t, {
        toolbar: {
          // onEm: function(){
          //   alert('image goes here!') 
          // },
          actions: {
            'strong': 'B', 
            'em': 'I', 
            'ins': 'ins', 
            'del': 'del', 
            'link': 'link', 
            'unlink': 'unlink'
          }  
        },
      }); 
      editor.addStyle('body { font-family: "Helvetica Neue", Arial, helvetica; color: #333; font-size:16px; }');
    });
  });
    
  
  // Edit Parts
  // ---------------------------------------------
  this.get('/admin/pages/:page_id/parts/:id/edit', function(request){ 
    jQuery('.modal-editor').remove();
    var iframe = $('iframe');
    var template = 'parts';
    var page = Page.find(request.params['page_id']);
    var part = page.parts().find(request.params['id']);
    var timestamp = jQuery('#page-updated_at').attr('value');
    
    // Checks to see if part is current...
    if(iframe.length){
      if(timestamp != page.attr('updated_at')){
        var preview = jQuery('.preview iframe');
        preview.hide().attr('src', preview.attr('src'));
        preview.load(function(){
          preview.fadeIn('fast');
          request.render_part(part, page, template);
        });
      }else{
        request.render_part(part, page, template);
      }
    }else{
      request.renderPagePreview(page, function(){
        request.render_part(part, page, template);
      }); 
    }

    // context.modal = true;
  });
  
  // Edit Image Parts
  // ---------------------------------------------
  this.get('#/pages/:page_id/image_parts/:id/edit', function(request){   
    var page = Page.find(request.params['page_id']);
    var part = page.parts().find(request.params['id']);
    var template = 'image_parts';
    var iframe = $('iframe');
    
    Asset.searchAdmin({ 'limit': '8' }, function(){ 
      if(iframe.length){
        request.render_part(part, page, template);
      }else{
        request.renderPagePreview(page, function(){
          request.render_part(part, page, template);
        }); 
      }
    });  
    // context.modal = true; 
  });
  
  // Add Image Page Parts
  // ---------------------------------------------
  this.get('/admin/pages/:page_id/parts/:id/results', function(request){ 
   

    var page = Page.find(request.params['page_id']);
    var part = Part.find(request.params['id']);
    var query = request.params['query'] ? request.params['query'] : null; 
    var params = query ? { 'query': query } : {};
    
    Asset.searchAdmin(params, function(){    
      var searchResults = request.load(jQuery('#admin-pages-search_results')).interpolate(Asset.toMustache(), 'mustache');       
      // var searchResults = request.render('/templates/admin/pages/search_results.mustache', Asset.toMustache());    
      searchResults.replace('#search-results-container').then(function(){
        request.set_asset_links(part, page);
      });
    });

  });
  
  // Update Parts
  // ---------------------------------------------
  this.put('#/pages/:page_id/parts/:id', function(request){
    
    var page = Page.find(request.params['page_id']);
    var part = page.parts().find(request.params['id']);
    
    // Updates part
    var parts = page.attr('parts'); 
    var length = parts.length;
    for (var i=0, l=length; i<l; ++i ){
      var part = parts[i];
      if(request.params['id'] == part.id){
        // This needs to be more generalized
        var content = request.params['part']['content'];
        part.content = content;
        var p = Part.find(part.id);
        p.attr('content', content);
        p.save();
      }
    }
    
    // The page needs to be saved, as parts are embedded. Not sure if this is a good idea
    page.save(function(success, result){
      if(success){
        context.modal = false;     
        // Utilities.notice('Successfully saved page');
        var now = new Date();
        // window.current = now.getTime();
        request.redirect(page.attr('admin_path'));
      } 
    });
  });
  
  // Upload Assets to Part (Create)
  // ---------------------------------------------  
  this.post('#/pages/:page_id/image_parts/:id/assets', function(request){  
    var application = this; 
    var page = Page.find(request.params['page_id']);
    var part = page.parts().find(request.params['id']);
    
    var fileInput = document.getElementById('ajax_uploader');
    var files = fileInput.files; 
    var query = request.params['query'] ? request.params['query'] : null;
    var uploadForm = jQuery('form#new_asset');
    var params = query ? { 'query': query } : {}; 
    params['limit'] = request.params['limit'] || 48;
    params['page'] = request.params['page'] || 1;
    //  fileInput = uploadForm.find('input[type=file]'),
    //  files = fileInput.attr('files');
    
    this.send_files(files, params, function(){
      var searchResults = request.load(jQuery('#admin-pages-search_results')).interpolate(Asset.toMustache(), 'mustache');
      // var searchResults = request.render('/templates/admin/pages/search_results.mustache', Asset.toMustache());    
      searchResults.replace('#search-results-container').then(function(){
        jQuery('#ajax_uploader').attr('files', null); 
        jQuery('.progress').slideUp('slow', function(){
          jQuery(this).html('');
        });
        application.set_asset_links(part, page);
      });
    });

  });

});