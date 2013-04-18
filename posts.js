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
	votes: 0,
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
    },
    'click input.vote_up': function(event) {
	    if(Posts.findOne({_id: this._id}).owner != Meteor.userId()){     //if the post is not owned by the voter, then the voter can vote for it
 		Posts.update({_id: this._id},{$inc: {votes:1}});
	}
    }
  });

  Template.list.posts = Posts.find({}, {sort: {votes: -1}});

// alert("hello");
Meteor.startup(function () {
 $('#testajax').text("test 1 works");

	console.log('sstuff');
$('#test').click(function(){
	console.log("it works");
	$('#textajax').text("works");
	alert("before xhr");
	$.get('test.txt',function(data) {
		$('#testajax').html(data);
		alert('Load was performed.');
	});
 });
});



}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Posts.allow({ 
	//only users logged in and the owners of posts can insert or remove posts. Logged in users can update posts, for voting.
	insert: function(userId, post){
		return (userId && post.owner == userId);	
	},
	update: function(userId, post){
                return (userId);
        },
	remove: function(userId, post){
		return (userId && post.owner == userId);
	}
});



