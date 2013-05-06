if (Meteor.isServer) {
	Meteor.publish("users", function(){
		return Meteor.users.find({}, {fields: {emails: 1, username: 1}});
	});

	Meteor.publish("lectures", function(){
		return Lectures.find({});
	});

	Meteor.publish("posts", function(){
		return Posts.find({});
	});

	Meteor.publish("comments", function(){
		return Comments.find({});
	});
};