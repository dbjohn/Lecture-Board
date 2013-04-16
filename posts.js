Posts = new Meteor.Collection("posts");

if (Meteor.isClient) {
  var MAX_CHARS = 140;

  Template.compose.events({
    'submit form': function (event) {
      var $body = $('#post-body');
      event.preventDefault();

      Posts.insert({
        owner: Meteor.userId(),
	body: $body.val(),
        created_at: Date()
      });
      $body.val('');
      $('#remaining').html(MAX_CHARS);
    },

    'keyup #post-body': function() {
      $('#remaining').html(MAX_CHARS - $('#post-body').val().length);
    }
  });

  Template.list.events({
    'click .post-remove': function(event) {
      Posts.remove(this._id);
    }
  });

  Template.list.posts = Posts.find({}, {sort: {created_at: -1}});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Posts.allow({ 
	insert: function(userId, post){
		return (userId && post.owner == userId);	
	},
	remove: function(userId, post){
		return post.owner == userId;
	}
});

