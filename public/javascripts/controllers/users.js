var Users = Sammy(function (app) {
  
  var context = this; 
  
  // Helper Methods 
  // ---------------------------------------------  
  this.helpers({  
    // Checks for loaded pages, renders the tree, then executes the callback   
    loadUsers: function(callback){  
      var application = this; 
      
      if(User.all().length == 0 ){
        User.load(function(){  
          if(callback){ callback.call(this); }     
        });
      } else {        
        if(callback){ callback.call(this); } 
      }
    },
    
    renderUserIndex: function(callback){  
      var application = this;    
      var userIndex = application.load(jQuery('script#admin-users-index')).interpolate(User.toMustache(), 'mustache');
      userIndex.replace('#editor').then(function(){
        if(callback){ callback.call(this); }  
      });
    }
  });
    
  // User Index
  // ---------------------------------------------
  this.get('/admin/users', function(request){  
    jQuery('#editor').html('<h1 class="section">Users</div>'); 

    request.loadUsers(function(){  
      request.renderUserIndex();
    });
  }); 
  
  // New User 
  // --------------------------------------------- 
  this.get('/admin/users/new', function(request){   
    request.loadUsers(function(){    
      if (!jQuery('#modal').length){ Galerie.open(); }  
      var new_user = request.load(jQuery('script#admin-users-new')).interpolate({}, 'mustache');
      new_user.replace('#modal');  
      request.renderUserIndex();
    });
  }); 
  
  // Create User
  // ---------------------------------------------  
  this.post('/admin/users', function(request){
    var attributes = request.params['user'];  
    var user = new User(request.params['user']);
    
    user.save(function(success, results){   
      var response = JSON.parse(results.responseText);   
      if(response.errors){
        alert(JSON.stringify(response));  
      }else{  
        request.redirect('/admin/users'); 
      }
    });
  });
  
  // Edit Users
  // ---------------------------------------------
  this.get('/admin/users/:id/edit', function(request){ 
    request.loadUsers(function(){  
      user = User.find(request.params['id']); 
      var users_list = jQuery('#users');
      if(!users_list.length){
        request.renderUserIndex(function(){
          jQuery('.user-form').html('');
          var editUser = request.load(jQuery('script#admin-users-edit')).interpolate({ user: user.asJSON() }, 'mustache');
          editUser.replace('#user-form-' + user.id());
        });
      } else {
        jQuery('.user-form').html('');
        var editUser = request.load(jQuery('script#admin-users-edit')).interpolate({ user: user.asJSON() }, 'mustache');
        editUser.replace('#user-form-' + user.id());
      } 
    });
  });
  
  // Update Users
  // ---------------------------------------------
  this.put('/admin/users/:id', function(request){ 
    var user = User.find(request.params['id'])

    user.attr(request.params['user']);   
    user.save(function(success, results){   
      var response = JSON.parse(results.responseText);   
      if(response.errors){
        alert(JSON.stringify(response));  
      }else{  
        request.redirect('/admin/users'); 
      }
    });
  });
  
  
 
  
});