Verlag.Model.Asset = Backbone.Model.extend({
    
  url: function() {
    return '/admin/assets/' + this.id + '.json';
  },

  initialize: function() {
    
  },
  
  admin_path: function(){
    return '/admin/assets/' + this.folder_id + '/assets/' + this.id 
  },
    
  generate_uuid: function(){
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
    s[12] = "4";                                       // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    return s.join(''); 
  },
  
  isImage: function(){
    return this.get('file_type') && this.get('file_type').match(/image/);
  },
  
  imagePath: function(){
    '/images/' + this.id + '/' + this.get('file_name') + '?w=240&amp;h=180&amp;c=t&amp;g=North';
  },
  
  adminPath: function(){
    var type = this.get('_type') ? this.get('_type').toLowerCase() + 's/'  : '';
    var path = '/admin/' + type + this.id;
    return path;
  }
  
  
});
