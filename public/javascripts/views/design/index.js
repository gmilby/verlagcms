Verlag.View.DesignIndex = Backbone.View.extend({

  el: '#sidebar',

  tagName:  'div',

  // The DOM events specific to an item.
  events: {
    'click a': 'showTemplate'
  },

  initialize: function() {
    $(this.el).undelegate();
  },
  
  data: function(){
    return {
      templates: [{
        title: 'Layouts',
        models: Verlag.templates.find_by_klass('Layout').map(function(l){
          return l.toJSON()
        })
      },{
        title: 'Partials',
        models: Verlag.templates.find_by_klass('Partial').map(function(l){
          return l.toJSON()
        })
      },{
        title: 'Stylesheets',
        models: Verlag.templates.find_by_klass('Stylesheet').map(function(l){
          return l.toJSON()
        })
      },{
        title: 'Javascripts',
        models: Verlag.templates.find_by_klass('Javascript').map(function(l){
          return l.toJSON()
        })
      }]
    }
  },

  render: function() {
    var template = Verlag.compile_template('admin-templates-index');
    
    $(this.el).html(template.render(this.data())); 
  },
  
  showTemplate: function(e){
    e.preventDefault();
    var path = $(e.target).attr('href');
    Verlag.router.navigate(path, { trigger: true });
  }

});
