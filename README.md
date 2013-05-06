Assignment 1 – Rich Web Application Technologies 2012/2013
Student Number: C04392400
Student Name: John Brennan
Github repo: https://github.com/c04392400/RWAT_Assignment_1

Assignment completed as an individual not as team.

This project titled ‘Lecture Board’ is a Q&A/chat style web application suitable for use in lectures/classrooms which allows users to make anonymous posts and questions which other users can view, comment on and vote up. The posts/questions are ordered by their votes, with the posts with most votes being pushed to the top.

It uses Meteor JS web application framework available at www.meteor.com
In addition it uses MongoDB for persistence storage of details for lectures, posts and comments.
Twitter Bootstrap CSS library is used for styling the website.

Meteor JS must first be installed on the system before running. Once installed navigate to the root directory and enter ‘meteor’ at the command line. This will run the meteor server and application which can be accessed in a web browser at: server-ipaddress:3000, e.g. http://localhost:3000/

Once accessed in the browser, the user must create an account or log in with an existing account through the log in widget on the top right of the page.
The application is accessible through multiple browsers simultaneously and keeps all data in sync in real-time between the different users logged using web sockets and XHR-based communications.

Users can add and select lectures by the buttons in the top nav-bar panel. Switching lectures changes the posts displayed to those that belong to that lecture.

Users can only vote for posts that they do not own and cannot vote for their own posts. In addition users can only vote once for a post. Users can only delete their own posts – a remove ‘trash-bin’ symbol is shown only for a user’s own posts.
