Pages = Sammy(function (app) {   
  
  var context = this;  
   
  this.debug = false;
  this.disable_push_state = true;
  
  // this.use(Sammy.Title);  
  this.use(Sammy.JSON); 
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams); 
  
  
  // Helper Methods 
  // ---------------------------------------------
  app.helpers({  
    // Render Part
    render_part: function(part, page, template){
      var application = this;   
      var edit_part = application.render('/templates/admin/' + template + '/edit.mustache', { 
        part: part.asJSON(),
        page: page.asJSON(),
        assets: Asset.asJSON()
      }); 
      edit_part.appendTo(jQuery('body')).then(function(){
        var modal_editor = jQuery('.modal-editor');
        var iframe_content = $('iframe').contents();  
        var part_editor = iframe_content.find('#editor-' + part.id());
        modal_editor.fadeIn('fast').css({
          'top' : part_editor.offset().top - iframe_content.find('body').scrollTop() + 'px',
          'left':  part_editor.offset().left + 400 + 'px'
        });
        application.set_asset_links(part, page);
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
            // Change to sammy method
            context.modal = false;
            document.location.hash = '#/pages/' + page.id();
          });
        });
      });
    }
    
  });  
  
  // Edit Parts
  // ---------------------------------------------
  this.get('#/pages/:page_id/parts/:id/edit', function(request){ 
    var application = this;
    jQuery('.modal-editor').remove();
    
    this.loadPages(function(){     
      var page = Page.find(request.params['page_id']);
      var part = page.parts().find(request.params['id']);
      var iframe = $('iframe');
      var template = 'parts';
      
      if(iframe.length){
        application.render_part(part, page, template);
      }else{
        request.renderPagePreview(page, function(){
          application.render_part(part, page, template);
        }); 
      }
    }); 
    // context.modal = true;
  });
  
  // Edit Image Parts
  // ---------------------------------------------
  this.get('#/pages/:page_id/image_parts/:id/edit', function(request){ 
    var application = this;
    jQuery('.modal-editor').remove(); 
    
    this.loadPages(function(){     
      var page = Page.find(request.params['page_id']);
      var part = page.parts().find(request.params['id']);
      var template = 'image_parts';
      var iframe = $('iframe');
      
      Asset.searchAdmin({ 'limit': '12' }, function(){ 
        if(iframe.length){
          application.render_part(part, page, template);
        }else{
          request.renderPagePreview(page, function(){
            application.render_part(part, page, template);
          }); 
        }
      });  
    }); 
    // context.modal = true; 
  });
  
  // Add Image Page Parts
  // ---------------------------------------------
  this.get('/pages/:page_id/parts/:id/results', function(request){ 
    var application = this;
    this.loadPages(function(){
      var page = Page.find(request.params['page_id']);
      var part = Part.find(request.params['id']);
      var query = request.params['query'] ? request.params['query'] : null; 
      var params = query ? { 'query': query } : {};

      Asset.searchAdmin(params, function(){           
        var searchResults = request.render('/templates/admin/pages/search_results.mustache', Asset.toMustache());    
        searchResults.replace('#search-results-container').then(function(){
          
          application.set_asset_links(part, page);
        });
      });
    });
  });
  
  // Update Parts
  // ---------------------------------------------
  this.put('#/pages/:page_id/parts/:id', function(request){
    var id = request.params['id'];  
    var page_id =  request.params['page_id'];
    var page = Page.find(page_id);
    var part = page.parts().find(id);
    
    logger.info(request.params['part']);
    
    // Updates part
    var parts = page.attr('parts'); 
    var length = parts.length;
    for (var i=0, l=length; i<l; ++i ){
      var part = parts[i];
      if(id == part.id){
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
        request.redirect('#/pages/' + page_id);
      } 
    });
    
  });

});