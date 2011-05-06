$(document).ready(function () {

  App.run();
  // AjaxUploader.initialize('#ajax_uploader');
  $('#ajax_uploader').attr('multiple','multiple');
  $('.js-only').show();  
  
  // TODO move this to the utilities file
  jQuery('body').keydown(function(e){    
    switch (e.keyCode) {
      case 37:
        $('a.previous').click();
        break;
      case 39:
        $('a.next').click();
        break; 
      case 87:
        $('a.cancel').click();
        break; 
    }
  });
                    
  // Adds the '#' tag to all links if the history object is not available
  if (!Modernizr.history) { 
    jQuery('a').live('click', function(e){
      e.preventDefault();
      document.location.hash = $(this).attr('href');
    });  
    // Temp. The zombie tests are failing with the history object...  
    var search_form = jQuery('form#search-form');   
    search_form.attr('action', '#' + search_form.attr('action'));   
  }            

});

App = Sammy(function (app) {

  this.use(Sammy.Title);
  // 
  // Helper Methods
  this.helpers({
  
  });

  this.bind('run', function () {
    // alert('hey');
    app.modal = false;
  });
  
  this.get('/search', function (req) {
    Galerie.close();
    var query = req.params['query'] ? req.params['query'].replace(/ /g, '+') : null;
    if(!app.modal){
      Asset.searchRemote(query, function(){
        var assetList = new AssetListView(Asset.toMustache(query));
        assetList.render();
      });
    }
    app.modal = false;
  });
  
  this.get('/search/:id', function(req){         
    var query = req.params['query'] ? req.params['query'] : null;  
    var displayContents = $('<div />').attr('id', 'asset-display-container');
    if($('#modal').length == 0){
      Galerie.open(displayContents);
    }

    var asset = Asset.find(req.params['id']); 
    // Checks the local storage for the asset and renders it
    // If no asset it found, calls the search api and gets it
    if(asset){
      var assetDisplay = new AssetDisplayView(asset.toMustacheWithNeighbors(query));
      assetDisplay.render();   
    }else{
      Asset.searchRemote(query, function(){      
        var asset = Asset.find(req.params['id']);              
        var assetDisplay = new AssetDisplayView(asset.toMustacheWithNeighbors(query));
        assetDisplay.render();
        var assetList = new AssetListView(Asset.toMustache(query));
        assetList.render();
      });
    }
    // sets a flag so the the search results are not reloaded
    app.modal = true;

  });
  
  // this.get('/:page', function (req) {
  //   var page = req.params['page'];
  //   $('h1').text('Page ' + page);
  //   $('#search-query').attr('value', '');
  //   // req.setTitle('Page: ' + page);
  //   $('#asset-list-container').html('');
  //   $('#asset-display-container').html();
  // });
  
  app.get('/', function (req) {
    // $('h1').text('Start Page');
  });

});
