/*this file works on the server side and publishes the collections required for each client*/

if (Meteor.isServer) {
	Meteor.publish("users", function(){
	//publish only the email and username of each user.
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