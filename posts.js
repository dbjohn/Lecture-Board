/*
This file handles the client side javascript, collections and permissions.
*/

Lectures = new Meteor.Collection("lectures");
Posts = new Meteor.Collection("posts");
Comments = new Meteor.Collection("comments");

if (Meteor.isClient){
	Meteor.subscribe("users");
	Meteor.subscribe("lectures");
	Meteor.subscribe("posts");
	Meteor.subscribe("comments");

	Template.add_lecture_modal.events({
		//for adding a lecture from the modal window.
		'click .btn-primary': function(event, template){
			if(template.find('input[type="text"]').value != ''){
				var lecture_id = Lectures.insert({
					owner: Meteor.userId(),
					title: template.find('input[type="text"]').value,
					created_at: new Date().getTime()
				});
				$('#ac_modal').modal('hide');	//manually hide the modal window
				Session.set("selected_lecture", lecture_id);	//set the current lecture to the newly added one.
			}
		},
		'click .btn': function(event, template){	//when either button is clicked, clear the input textfield.
					$('input[type="text"]').val('');
		}
	});
	
	//set the currently selected lecture to the one selected in the nav-bar menu.
	Template.lectures_menu.events({
		'click a': function(event){
			Session.set("selected_lecture", this._id);
		}
	});
		
	//for adding a post/question
	Template.compose.events({
		'submit form': function (event) {
			var $body = $('#post-body');
			event.preventDefault();
			Posts.insert({
				lecture_id: Session.get('selected_lecture'),
				owner: Meteor.userId(),
				body: $body.val(),
				votes: 0,
				created_at: new Date().getTime()	//time stamp: this gets the date in milliseconds since the epoch. Works better than just Date() which IE seems to use differently to FF and Chrome
			});
			$body.val('');	//clear body after post
		}
	});

	Template.list.events({
		'click .post-remove': function(event) {
			Posts.remove(this._id);	
		},
		'click .vote_up': function(event) {
		//if the post is not owned by the voter, then the voter can vote for it. But users can't vote for their own posts.
			if(Posts.findOne({_id: this._id}).owner != Meteor.userId()){	
				Posts.update({_id: this._id},{$inc: {votes:1}});
			}
		},
		//this simply shows the add/cancel buttons for comments when the user clicks inside the comment text area.
		'click .comment-body': function(event) {
			//it is necessary to use e.target and reassign to $this. Because using $(this) will clash with meteor use of "this" as the current data context.		
			//http://stackoverflow.com/questions/11770613/using-jquery-this-in-meteor		
			var $this = $(event.target);
			$this.next().show();
		},
		'click .add_comment': function(event) {			
			var $this = $(event.target);
			var comment = $this.parent().prev();
			
			//When adding a comment, a reference is to the post is added to the comment, 
			//as opposed to the other way around. Gets by a problem where the posts rendering was triggered unnecessarily every time a comment was added.
			var comment_id = Comments.insert({
				post_id: this._id,	//reference to post it belongs to 
				owner: Meteor.userId(),
				text: comment.val(),    	
				created_at: new Date().getTime()
			});
			$this.parent().hide();	//hide the add/cancel buttons
			comment.val('');	//clear comment area
		},
		'click .cancel_comment': function(event) {
			var $this = $(event.target);
			var comment = $this.parent().prev();
			comment.val('');    
			$this.parent().hide();
		}
	});

	//get lectures
	Template.lectures_menu.lectures = Lectures.find({}, {sort: {created_at: 1}});
	
	//Get the currently selected lecture (via the nav-bar menu). This is stored in a session variable.
	//created as a function so that it will be rerun when the session variable ('selected_lecture') changes.	
	Template.page_main.current_lecture = function(options){
		if(Session.get('selected_lecture')){
			return Lectures.findOne(
				{_id:  Session.get('selected_lecture')}
			)
		}
		else{ //if none is selected, e.g when first logging in, then simply select anyone.
			return Lectures.findOne(
				{}
			)
		}
	};

	//get posts sorted by votes then by created_at time
	Template.list.posts = function(){
		return Posts.find(
			{lecture_id: Session.get('selected_lecture')}, 
			{sort: {votes: -1, created_at: 1}}
		)
	};
		
	
	//get comments belonging to a certain post 
	Template.comments_area.get_comments = function(post, options){
		return Comments.find(
			{post_id: post._id},
			{sort: {created_at: 1}}
		)
	};

	//helper to check if the a user is the owner of a post. Used to decide whether to display a remove icon on the post.
	Template.post_body.is_owner = function(data, options){
		if(data.owner == Meteor.userId()){
			return true;
		}
		else{
			return false;
		}
	};

	//hide the add comment button once the template is rendered for the first time.
	Template.list.rendered = function(){
		$('.comment_buttons').hide();	
	};

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

Comments.allow({ 
	//only users logged in and the owners of comments can insert,update or remove comments.
	insert: function(userId, comment){
		return (userId && comment.owner == userId);	
	},
	update: function(userId, comment){
		return (userId && comment.owner == userId);	
	},
	remove: function(userId, comment){
		return (userId && comment.owner == userId);
	}
});

Lectures.allow({ 
	//Only users logged in and the owners of lectures can insert, update or remove posts. 
	insert: function(userId, lecture){
		return (userId && lecture.owner == userId);	
	},
	update: function(userId, lecture){
		return (userId && lecture.owner == userId);	
	},
	remove: function(userId, lecture){
		return (userId && lecture.owner == userId);
	}
});