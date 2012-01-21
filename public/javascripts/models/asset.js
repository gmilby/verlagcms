var Asset = Model('asset', function() {
  this.persistence(Model.REST, "/admin/assets"), 
  
  // var invokeCallback = function (callbackName, instance) {
  //   if (instanceMethods[callbackName]) {
  //     instanceMethods[callbackName].call(instance);
  //   };
  // },
  
  this.include({
    
    // initialize: function(){
    //   this.attr('uuid', Asset.generate_uuid());
    // },
    
    load: function(callback){
      var self = this;
      var url = '/admin/assets/' + self.id()  + '.json';   
      
      jQuery.ajax({
        type: 'GET',
        url: url,
        // contentType: "application/json",
        dataType: "json",                   
        success: function(results) {    
          self.merge(results);    
          callback.call(this);    
        }
      });
    },
    
    // Returns the current asset as json, including the query and query_path
    toMustache: function(query){
      var asset = this; 
      var query_path = query ? '?' + decodeURIComponent(jQuery.param({'query': query})) : '';
      asset.merge({query_path: query_path, query: query}); 
      return asset.attr();
    },  
        
    // Returns the current asset as json, plus both neighbors, then preloads the images
    // Not sure if they should be preloaded here, rather after
    toMustacheWithNeighbors: function(query){
      var assets = Asset.all();
      var assetIndex = assets.indexOf(this);
      var assetAttr = this.toMustache(query);

      jQuery('<img />')[0].src = '/images/' + assetAttr.id + '/' + assetAttr.file_name;
      
      return {
        'asset': assetAttr
      }
    }
        
  }), 
  
  this.extend({
    
    find_all_by_folder_id: function(folder_id){
      return this.select(function(){
        return this.attr('folder_id') == folder_id
      });
    },
    
    // returns a json array of all assets, including the query and query_path
    toMustache: function(query) {
      var query_path = query ? '?' + decodeURIComponent(jQuery.param({'query': query})) : '';
      return this.map(function(asset){ 
          asset.merge({query_path: query_path, query: query}); 
          return asset.attr(); 
        });
    }, 
    
    asJSON: function(){
      return Asset.map(function(item){ return item.attr() });
    }, 
    
    tags: function(){
      tags = []
      Asset.map(function() {
        tags = tags.concat(this.attr("tags"));
      });                                     
      return tags;
    },

    searchRemote: function(query, callback) {
      var queryData = query != null ? decodeURIComponent(jQuery.param({'query': query})) : '';
      Asset.each(function(){ Asset.remove(this); });
      var url = '/search.json';
      jQuery.ajax({
        type: 'get',
        url: url,
        contentType: "application/json",
        dataType: "json",
        data: queryData,
        success: function(results) {
          jQuery.each(results, function(i, assetData) {
            var asset = new Asset({ id: assetData.id });
            asset.merge(assetData);
            Asset.add(asset);
          });
          callback.call(this);
        }
      });
    },

    searchAdmin: function(params, callback) {
      // var data = query != null ? decodeURIComponent(jQuery.param({'query': query})) : '';
      Asset.each(function(){ Asset.remove(this); });
      var url = '/admin/assets.json';
      jQuery.ajax({
        type: 'get',
        url: url,
        contentType: "application/json",
        dataType: "json",
        data: params,
        success: function(results) {
          $.each(results, function(i, assetData) {
            var asset = new Asset({ id: assetData.id });
            asset.merge(assetData);
            Asset.add(asset);
          });
          callback.call(this);
        }
      });
    }, 
    
    // Uploads a file using ajax to an existing asset
    upload: function(params, callback){
      
      var self = this,
        file = params['file'],
        url = '/admin/assets.json',
        xhr = new XMLHttpRequest(),
        uuid = self.generate_uuid(),
        query_params = JSON.stringify({ 'folder_id': params['folder_id'] });
  
      // Hack?
      Asset.callback = callback;
      
      xhr.upload.uuid = uuid;
      xhr.upload.filename = file.name;
      xhr.upload.addEventListener('loadstart', Asset.onloadstartHandler, false);
      xhr.upload.addEventListener('progress', Asset.onprogressHandler);
      xhr.upload.addEventListener('load', Asset.onloadHandler, false);
      xhr.addEventListener('readystatechange', Asset.onreadystatechangeHandler, false);  
      
      // xhr.setRequestHeader("X-Query-Params", {'format':'json'});
      xhr.open('POST', url, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.setRequestHeader("X-File-Name", file.name);
      xhr.setRequestHeader("X-Params", query_params);
      xhr.setRequestHeader("X-File-Upload", "true");
      xhr.send(file);   
      if(callback['before']){ callback['before'].call(this, {uuid: uuid, file_name: file.name}); } 
    },    
    
    onloadstartHandler: function(evt) {
      // var percent = AjaxUploader.processedFiles / AjaxUploader.totalFiles * 100;
    },

    onloadHandler: function(evt) { 
      // $('#ajax_uploader').attr('value', '');
    },

    onprogressHandler: function(evt) {
      var percent = Math.round(evt.loaded / evt.total * 100); 
      if(Asset.callback['progress']){ Asset.callback['progress'].call(this, evt.target.uuid, percent); }  
    },
    
    onreadystatechangeHandler: function(evt){
      var status = null;
      try { status = evt.target.status; }
      catch(e) { return; }
      
      // readyState 4 means that the request is finished
      if (status == '200' && evt.target.readyState == 4 && evt.target.responseText) {
        var response = JSON.parse(evt.target.responseText);
        response.uuid = evt.target.upload.uuid;

        if(Asset.callback['success']){ Asset.callback['success'].call(this, response); }   
      }
    },
    
    generate_uuid: function(){
      // http://www.ietf.org/rfc/rfc4122.txt
      var s = [];
      var hexDigits = "0123456789ABCDEF";
      for (var i = 0; i < 32; i++) { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
      s[12] = "4";                                       // bits 12-15 of the time_hi_and_version field to 0010
      s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      return s.join(''); 
    }

  });

});

