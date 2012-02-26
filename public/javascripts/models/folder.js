Verlag.Model.Folder = Backbone.Model.extend({
  
  // Makes nice rails style json urls 
  url: function() {
    return '/admin/folders/' + this.id + '.json';
  },
  
  initialize: function() {
    
  },
  
  fetch_assets: function(callback){
    var self = this;
    $.ajax({
      url: '/admin/folders/' + self.id + '/assets.json',
      success: function(response){
        self.assets = new Verlag.Collection.Assets(response);
        if(callback){
          callback.call(this, response);
        }
      }
    });
  }
  
});
