Posts = new Meteor.Collection("posts");
Comments = new Meteor.Collection("comments");

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
        comments: [1,2,3,4],
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
    'click .vote_up': function(event) {
			if(Posts.findOne({_id: this._id}).owner != Meteor.userId()){     //if the post is not owned by the voter, then the voter can vote for it. But users can't vote for their own posts.
			Posts.update({_id: this._id},{$inc: {votes:1}});
		}
    },
	'click .add_comment': function(event) {
		console.log("add comment?");
		$(this).next().show();
	//	Posts.update({_id: this._id},{$push: {comments: "Traz"});
    },
  });

  Template.list.posts = Posts.find({}, {sort: {votes: -1}});

  Template.list.is_owner = function(data, options){
	if(data.owner == Meteor.userId()){
		console.log("hello");
		return true;
	}
	else{
	}
};
 

Meteor.startup(function () {

	
	console.log('stuff');
	$('#test').click(function(){
		console.log("it works");
		$.get('example.pdf',function(pdfdata) {
		$('#testajax').html("<iframe width=800 height=500><body><object type='application/pdf'>" + pdfdata + "</object></body></iframe>");
	//	$('#testajax').html("<iframe  width=800 height=500>" + pdfdata + "</iframe>");

	//	$('#testajax').html("<object type='application/pdf'>" + pdfdata + "</object>");
		console.log('ajax completed');
		});
 	});
	
	
});

$('.new-comment').hide();

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
	/*need to review update case if user is not owner of post*/
	update: function(userId, post){
                return (userId);
        },
	remove: function(userId, post){
		return (userId && post.owner == userId);
	}
});



