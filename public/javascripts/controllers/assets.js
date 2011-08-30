Assets = Sammy(function (app) {
  
  var application = this; 
  
  this.debug = false;
  this.disable_push_state = true;
    
  // this.use(Sammy.Title);  
  this.use(Sammy.JSON); 
  this.use(Sammy.Mustache); 
  this.use(Sammy.NestedParams);  
  
  this.swap = function(content) {
    jQuery('#editor').html(content); 
  }
  
  // Helper Methods 
  // ---------------------------------------------  
  this.helpers({  

    // Checks for loaded assets, then executes the callback   
    loadAssets: function(params, callback){  
      if(Asset.all().length == 0 ){
        Asset.searchAdmin(params, function(){      
          if(callback){ callback.call(this); } 
        });
      } else {        
        if(callback){ callback.call(this); } 
      }
    },
    
    // Sends each file to the server in turn, instead of all at once...
    send_files: function(files, params, callback){
      var application = this;
      var counter = 0;
      for(var i = 0; i < files.length; i++) {   
        // var uuid = Asset.generate_uuid();
        
        var file = files[i];
        var name = file.name

        Asset.create(file, {
          progress: function(upload, percent){
            console.log(upload.filename + ': ' + percent)
          },
          success: function(){  
            // Total Progress bar goes here
            counter = counter + 1;
            console.log(counter)
            // logger.info('asset ' + (counter / files.length * 100) + '%');
            // jQuery('.progress').text((counter / files.length * 100) + '%');

            if(counter == files.length){
              // This needs to be fixed, as it sends another request to the server that isn't really needed...
              // I could simply fix the ordering or something...
              Asset.searchAdmin(params, function(){ 
                if(callback){ callback.call(this); }  
              });
            }
          }
        });     
      }
    }
  });

  this.bind('run', function () {
    application.modal = false; 
    application.first_run = true;  
  }); 
  
  // Asset Index
  // ---------------------------------------------
  this.get('#/assets', function(request){ 
    var query = request.params['query'];
    var params = query ? { 'query': query } : {};   
    params['limit'] = request.params['limit'] || 48;
    params['page'] = request.params['page'] || 1;
    
    Galerie.close();
    if(!application.modal){
      Asset.searchAdmin(params, function(){  
        var assetIndex = request.render('/templates/admin/assets/index.mustache', Asset.toMustache(query));
        assetIndex.replace('#editor').then(function(){
          jQuery('#ajax_uploader').attr('multiple','multiple'); 
        });
      });
    }
    application.modal = false; 
    application.first_run = false;
  }); 
  
  // New Assets
  // ---------------------------------------------
  this.get('#/assets/new', function(request){ 
    var newAsset = request.render('/templates/admin/assets/new.mustache');
    newAsset.replace('#editor').then(function(){
      jQuery('#ajax_uploader').attr('multiple','multiple'); 
    });
    application.first_run = false;
  });
  
  // Create Asset
  // ---------------------------------------------  
  this.post('/admin/assets', function(request){   
    var application = this;
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
      var assetIndex = application.render('/templates/admin/assets/index.mustache', Asset.toMustache(params['query']));
      assetIndex.replace('#editor').then(function(){
        jQuery('#ajax_uploader').attr('multiple','multiple'); 
      });
    });

    return false; 
  });

  // Edit Asset 
  // ---------------------------------------------  
  this.get('#/assets/:id/edit', function(request){
    var query = request.params['query'] ? request.params['query'] : null; 
    var params = query ? { 'query': request.params['query']} : {};   
    
    this.loadAssets(params, function(){
      var asset = Asset.find(request.params['id']); 
      var editAsset = request.render('/templates/admin/assets/edit.mustache', asset.toMustacheWithNeighbors(query));
      editAsset.replace('#editor').then(function(results){  
        setTimeout(function(){
          $('img.fade-in').fadeIn('slow'); 
        }, 100);
        Utilities.formObserver('.image-info input[type=text], .image-info textarea'); 
      });                                                                           
    }); 
    // sets a flag so the the search results are not reloaded   
    application.modal = false;  
  });
  
  // Update Asset
  // ---------------------------------------------  
  this.put('#/assets/:id', function(req){
    var application = this;
    var asset = Asset.find(req.params['id']);     
  
    asset.attr(req.params['asset']);
    asset.save(function(success){   
      if(success){
        Utilities.notice('Successfully saved asset');   
      }
    });
  });    
  
  // Remove Asset
  // ---------------------------------------------  
  this.get('#/assets/:id/remove', function(request){   
    var query = request.params['query'] ? request.params['query'] : null; 
    var params = query ? { 'query': request.params['query']} : null;                             

    Galerie.close();
    Galerie.open(jQuery('<div />').attr({'id': 'remove-asset-container', 'class': 'wide-modal'})); 
    
    this.loadAssets(params, function(){ 
      var asset = Asset.find(request.params['id']);  
      
      var removeAsset = request.render('/templates/admin/assets/remove.mustache', { asset: asset.toMustache(query) }); 
      removeAsset.replace('#remove-asset-container'); 
 
      if(application.first_run){
        var assetIndex = request.render('/templates/admin/assets/index.mustache', Asset.toMustache(query));
        assetIndex.replace('#editor'); 
      }
    }); 
  });
  
  // Delete Asset
  // ---------------------------------------------  
  this.del('#/assets/:id', function(request){
    var application = this;    
    var query = request.params['query'] ? request.params['query'] : null; 
    var query_path = query ? '?' + decodeURIComponent(jQuery.param({'query': query})) : '';  
    var asset = Asset.find(request.params['id']);  
       
    asset.destroy(function(success){   
      if(success){ 
        Galerie.close(); 
        Utilities.notice('Successfully saved asset'); 
        request.redirect('#/assets' + query_path);    
      }
    });
  });    

});