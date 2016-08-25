'use strict';

var Username = "";
var TopUserScore = -1;
var Uid = "-1";

class DB {
  constructor() {
    this.scoreboard = firebase.database();
  }

  genResultID() {
    return this.scoreboard.ref().child('scoreboard').push().key;
  }

  setData(username, score, uid) {
    let userScore = {
      username: username,
      score   : score
    }; 
    this.scoreboard.ref("scoreboard/" + uid).set(userScore);
  }

  getUsersScore(uid, callback) {
    this.scoreboard.ref('scoreboard/' + uid + '/score').once('value', function(value){
      let answer = value.val() === null ? -1 : value.val();
      callback(answer);
    });
  }

  //return [<score, username>]
  getLeaderBoard(count, callback) {
    this.scoreboard.ref('scoreboard/').orderByChild('score').limitToLast(count).once('value', function(value) {
      let data = value.val(); 
      let result = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          result.push(data[key]);
        }
      }
      result.sort(function(l, r) {
        return r.score - l.score; //larger
      });
      callback(result);
    });
  }

  gmailSignIn() {
    if (!firebase.auth().currentUser) {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      firebase.auth().signInWithRedirect(provider);
    }
  }

  githubSignIn() {
    if (!firebase.auth().currentUser) {
      var provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('repo');
      firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log("signG:" + user);
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
        } else {
          alert(error);
        }
      });
    }
  }

  onSignIn(callback) {
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        var token = result.credential.accessToken;
      }
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
      } else {
        console.error("!!!" + error);
      }
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let userData = [];

        userData["displayName"] = user.displayName;
        userData["uid"]         = user.uid;
        /*userData.push({"email" : user.email});

        userData.push({"refreshToken" : user.refreshToken});
        userData.push({"providerData" : user.providerData});*/

        callback(userData);
      } else {
        //user is signed out
      }
    });
  }

  signOut() {
    firebase.auth().signOut();
  }
}