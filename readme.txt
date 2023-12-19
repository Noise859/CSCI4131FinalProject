Welcome to the very creatively named "LMK!", the abbreviation for Let Me Know!
To run, you must first connect to the database. All connection information
is saved inside data.js, including my name, username, and password information.
It was not changed from the default. Then, execcute
node server
In a command line. That is all to run the server.
The website is broken into three distinct pages.

Feed - Main page containing all of the user's post, sorted newest to oldest by default.
 - Only 10 entries are shown per page
 - The sort can be changed be in order of likes, from most to least
 - Posts can be liked. Likes are not tracked, so a single user may like
   a post as much as they please. There is no way to dislike.

Create Post - A small form to upload a new post. 
  It is not a real form, instead it is a javascript POST request. 
  This is so that only logged in users can upload a post, as the post will not save 
  if the client didn't provide valid credentials. If the user is not logged 
  in and tries to post, it will redirect them to the login page.

Account - Your account page. This one is complicated
 - If you are not logged in, you will be redirected to do so.
   If you are on the login page but do not have an account, you have the option to create
   one on the bottom of the form. Both the login and create account forms are real
   HTML forms. If you log in or create a valid account, your information is stored 
   locally to remain logged in.
 - Login info for test account: Username: test   Password: test
 - Once logged in, the account tab brings you to your profile, where you can
   see the total amount of posts you have, and you can logout
 - Only your posts are shown on your account page. They are paginated, 10 to a page,
   sorted newest to oldest.
 - You can edit or delete only your own posts on this page. Credentials are 
   also sent along with deletions/edits so no one can edit your posts.

I think that's about it. The only page that isn't linked anywhere on the site
is the 404 page, otherwise everything else is pretty self explanatory.

