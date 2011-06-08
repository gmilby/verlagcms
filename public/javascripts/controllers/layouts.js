Layouts = Sammy(function (app) {   
  
  var context = this;  
   
  this.use(Sammy.Title);  
  this.use(Sammy.JSON); 
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  
  // Helper Methods 
  // ---------------------------------------------
  this.helpers({  
    
    // Checks for loaded Layouts, renders the table, then executes the callback   
    loadLayouts: function(callback){  
      var application = this; 
      
      if(Layout.all().length == 0 ){
        Layout.load(function(){      
          if(callback){ callback.call(this); } 
        });
      } else {        
        if(callback){ callback.call(this); } 
      }
    },
    
    // Renders the Page tree
    renderIndex: function(){   
      var application = this;
       
      var layoutIndex = application.render('/templates/admin/templates/index.mustache', {
        layouts: Layout.find_all_by_class('Layout').map(function(item){ return item.attributes }), 
        partials: Layout.find_all_by_class('Partial').map(function(item){ return item.attributes }), 
        javascripts: Layout.find_all_by_class('Javascript').map(function(item){ return item.attributes }),
        stylesheets: Layout.find_all_by_class('Stylesheet').map(function(item){ return item.attributes }) 
      });
      layoutIndex.replace('#sidebar');
    },  
    
    renderLayout: function(layout){ 
      var application = this;     
      console.log((layout.attr('filter') == 'css') ? 'selected' : '')
      var editLayout = application.render('/templates/admin/templates/edit.mustache', { 
        layout: layout.asJSON(),
        filters: [
          { name: 'none', value: 'none', selected: ((layout.attr('filter') == 'css') ? 'selected="selected"' : '') }, 
          { name: 'Sass', value: 'sass', selected: ((layout.attr('filter') == 'sass') ? 'selected="selected"' : '') }, 
          { name: 'Scss', value: 'scss', selected: ((layout.attr('filter') == 'scss') ? 'selected="selected"' : '') }
        ]
      });    
      editLayout.replace('#editor').then(function(){
        // Because liquid templates use a syntax that is very similar to 
        // Mustache, this manually sets the content. A bit of a hack, but hey, sue me. 
        var editor_field = jQuery('#layout_content');
        editor_field.attr('value', layout.attr('content'));   
        var mode = editor_field.attr('class'); 
  
        CodeMirror.fromTextArea(document.getElementById('layout_content'), {
          mode: mode,
          lineNumbers: true
        });
        // Utilities.formObserver('#layout_content, #layout_name'); 
      });
    }
    
  });

  this.bind('run', function () { 
    context.refresh_templates = true; 
    context.refresh_pages = true;
    context.modal = false;  
  });

  // Layout Index
  // ---------------------------------------------  
  this.get('#/templates', function(request){  
    Galerie.close();
    context.refresh_templates = false; 
    context.refresh_pages = true;     
    
    jQuery('#editor').html(''); 
    request.loadLayouts(function(){
      request.renderIndex(Layout.all());  
    });            
  });
  
  this.get('#/templates/new/:klass', function(request){    
    
    this.loadLayouts(function(){    
      var displayContents = $('<div />').attr({'id': 'new-page-container', 'class': 'small-modal'});
 
      if ($('#modal').length == 0){ Galerie.open(displayContents); } 
      var newLayout = request.render('/templates/admin/templates/new.mustache', { klass: request.params['klass']}); 
      newLayout.replace('#new-page-container');       
      request.renderIndex(Layout.all()); 
    }); 
  }); 
  
  this.post('#/templates', function(request){
    var attributes = request.params['template'];  
      
    Layout.create(attributes, function(){
      request.redirect('#/templates');
    }); 
  });
  // 
  // Edit Layout
  // ---------------------------------------------
  this.get('#/templates/:id/edit', function(request){ 
    Galerie.close(); 
    context.refresh_pages = true;       
    this.loadLayouts(function(){  
      var layout = Layout.find(request.params['id']);   
      request.renderLayout(layout);   
      request.renderIndex(Layout.all()); 
    });
  });   
  
  // Update Layout
  // ---------------------------------------------
  this.put('#/templates/:id', function(request){  
    var layout = Layout.find(request.params['id']);  
      
    layout.attr(request.params['layout']);   
    layout.saveRemote({
      success: function(){  
        request.renderIndex();
        // request.redirect('#/layouts');
      }
    });  
  });
  // 
  // this.get('#/pages/:id/remove', function(request){   
  //   this.loadPages(function(){   
  //     var page_id = request.params['id'];
  //     var page = Page.find(page_id);         
  //     var displayContents = $('<div />').attr({'id': 'remove-page-container', 'class': 'small-modal'});   
  //     
  //     if($('#modal').length == 0){ Galerie.open(displayContents); } 
  //     
  //     if(context.refresh_templates){
  //       request.renderTree(Page.root()); 
  //     }
  //     
  //     var removePage = request.render('/templates/admin/pages/remove.mustache', { page: page.asJSON() });    
  //     removePage.replace('#remove-page-container');
  //   });  
  // }); 
  // 
  // this.del('/pages/:id', function(request){
  //   var page_id = request.params['id'];       
  //   var page = Page.find(page_id);               
  //     
  //   page.deleteRemote(function(){
  //     request.redirect('#/pages');
  //   }); 
  // });  
  // 
  
  // 
  // // Layout parts 
  // // --------------------------------------------- 
  // this.get('#/pages/:page_id/parts/new', function(request){   
  //   this.loadPages(function(){ 
  //     var page = Page.find(request.params['page_id']); 
  // 
  //     if($('#modal').length == 0){ Galerie.open(); }  
  // 
  //     var newPart = request.render('/templates/admin/parts/new.mustache', { page: page.asJSON() });    
  //     newPart.replace('#modal');   
  //     
  //     if(context.refresh_templates){ request.renderPage(page); }  
  //   });  
  // });  
  // 
  // this.post('/pages/:page_id/parts', function(request){
  //   this.loadPages(function(){ 
  //     var page_id = request.params['page_id'];    
  //     var attributes = request.params['part'];  
  //     Part.create(attributes, function(){
  //       request.redirect('#/pages/' + page_id + '/edit');
  //     });
  //   });
  // });  
  // 
  // this.get('/pages/:page_id/parts/:id/remove', function(request){   
  //   this.loadPages(function(){
  //     var page_id = request.params['page_id'];  
  //     var page = Page.find(page_id); 
  //     var part = page.parts().find(request.params['id']);     
  // 
  //     if($('#modal').length == 0){ Galerie.open(); } 
  // 
  //     var removePart = request.render('/templates/admin/parts/remove.mustache', { part: part.asJSON() });    
  //     removePart.replace('#modal');  
  //     if(context.refresh_templates){ request.renderPage(page); }
  //   });  
  // });
  // 
  // this.del('/pages/:page_id/parts/:id', function(request){
  //   var page_id = request.params['page_id'];    
  //   var page = Page.find(page_id);
  //   var part = page.parts().find(request.params['id']);  
  //     
  //   part.deleteRemote(page, function(){
  //     request.redirect('#/pages/' + page_id + '/edit');
  //   }); 
  // });    

});