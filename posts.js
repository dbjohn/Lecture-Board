
Lectures = new Meteor.Collection("lectures");
Posts = new Meteor.Collection("posts");
Comments = new Meteor.Collection("comments");

if (Meteor.isClient) {
  var MAX_CHARS = 140;

  Template.compose.events({
    'submit form': function (event) {
		if (!this.userId){
		  throw new Meteor.Error(403, "You must be logged in");//this is not working...
		}
		else{
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
		} 
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
	'click .comment-body': function(event) {
		
		//it is necessary to use e.target and reassign to $this. Because using $(this) will clash with meteor use of "this" as the current data context.		
		//http://stackoverflow.com/questions/11770613/using-jquery-this-in-meteor		
		 var $this = $(event.target);
		$this.next().show();
    },
	'click .add_comment': function(event) {
		// console.log("add comment?");
		 
		//it is necessary to use e.target and reassign to $this. Because using $(this) will clash with meteor use of "this" as the current data context.		
		//http://stackoverflow.com/questions/11770613/using-jquery-this-in-meteor		
		 
		  var $this = $(event.target);
		
		var comment = $this.parent().prev();
		
		//placing a reference to the post in the comment, as opposed to the other way around, gets by a problem where the posts rendering was triggered unnecessarily every time a comment was added.
	    var comment_id = Comments.insert({
			post_id: this._id,	//reference to post it belongs to 
			owner: Meteor.userId(),
			text: comment.val(),    	
			created_at: Date()
		});
		
		// Posts.update({_id: this._id},{$push: {comments: comment_id}});
		$this.parent().hide();
		comment.val('');

    },
	'click .cancel_comment': function(event) {
		// console.log("add comment?");
		 
		//it is necessary to use e.target and reassign to $this. Because using $(this) will clash with meteor use of "this" as the current data context.		
		//http://stackoverflow.com/questions/11770613/using-jquery-this-in-meteor		
		 
		  var $this = $(event.target);
		
		var comment = $this.parent().prev();
			comment.val('');    
		$this.parent().hide();
		

    }
  });

	Template.list.posts = Posts.find({}, {sort: {votes: -1}});
	
	Template.comments_area.get_comments = function(post, options){  
		return Comments.find(
			{
			  post_id: post._id
			},
			{sort: {created_at: 1}}
		)
	};


  Template.post_body.is_owner = function(data, options){
		if(data.owner == Meteor.userId()){
			console.log("hello");
			return true;
		}
		else{
		}
	};
 
	//hide the add comment button once the template is rendered for the first time.
	Template.list.rendered = function(){
		$('.comment_buttons').hide();	
	};
	
Meteor.startup(function () {

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
	/*need to allow non-owners to update so that they can increment votes. is there are more fine grained way...*/
	update: function(userId, post){
                return (userId);
        },
	remove: function(userId, post){
		return (userId && post.owner == userId);
	}
});



Comments.allow({ 
	//only users logged in and the owners of posts can insert or remove posts. Logged in users can update posts, for voting.
	insert: function(userId, comment){
		return (userId && comment.owner == userId);	
	},
	/*need to review update case if user is not owner of post*/
	update: function(userId, comment){
            return (userId && comment.owner == userId);	
        },
	remove: function(userId, comment){
		return (userId && comment.owner == userId);
	}
});

Lectures.allow({ //review this!
	//only users logged in and the owners of posts can insert or remove posts. Logged in users can update posts, for voting.
	insert: function(userId, lecture){
		return (userId && lecture.owner == userId);	
	},
	/*need to review update case if user is not owner of post*/
	update: function(userId, lecture){
            return (userId && lecture.owner == userId);	
        },
	remove: function(userId, lecture){
		return (userId && lecture.owner == userId);
	}
});
