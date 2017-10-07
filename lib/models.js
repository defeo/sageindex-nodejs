const mongoose =  require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

/* The schema for a user */
exports.userSchema = new Schema({
    _id: String,
    password: String,
});
const User = exports.User = mongoose.model('User', exports.userSchema);

/*
  Utility function to get or create a user.

  `next(error, user)` is a callback function.

  - If the user exists and the password is correct, it passes it to
    `next`.

  - If the user does not exist and `create=true`, a user is created
    and passed to `next.`

  - Otherwise `user=null` is passed to next.
*/
exports.getOrCreateUser = (userid, pass, next, create=true) =>
    User.findById(userid).exec()
    .then((user) => {
        if (user && user.password == pass) {
	    return user;
        } else if (create) {
            return User.create({ _id: userid, password: pass });
        } else {
            return null;
        }
    })
    .then((user) => next(null, user))
    .catch((err) => next(err));

/* The schema for a document */
exports.docSchema = new Schema({
    url: String,
    title: String,
    description: String,
    extraction: String,
    thumbnail: Buffer,
});
const Doc = exports.Doc = mongoose.model('Doc', exports.docSchema);
