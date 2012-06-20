Verlag.View.Remove = Backbone.View.extend({

  el: 'body',
  tagName:  'div',

  // Cache the template function for a single item.
  // template: Hogan.compile($('#carousel_template').html()),

  // The DOM events specific to an item.
  events: {
    'click form.remove button': 'delete'
  },

  initialize: function(options) {
    this.model = options.model;
    this.collection = options.collection;
    $(this.el).undelegate();
    this.render();
  },

  render: function() {
    
    var template = Verlag.compile_template('admin-shared-remove'),
        data = { 
          model: this.model.toJSON()
        };

    $(template.render(data)).hide().appendTo(this.$el).fadeIn('fast');
  },
  
  delete: function(e){
    var self = this;
    
    e.preventDefault();
    this.model.destroy({
      success: function(){
        Verlag.router.navigate('/admin/' + self.collection, { trigger: true });
        Verlag.notify('removed');
        Verlag.closeModal();                         
      }
    });

  }
  
});
