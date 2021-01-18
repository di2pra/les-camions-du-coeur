const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();


exports.deleteUser = functions.auth.user().onDelete((user) => {

  db.doc("utilisateurs/" + user.id).update({
    deleted: true
  });

});
