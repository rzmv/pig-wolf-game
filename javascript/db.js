var UsersResultID = "-1";
var Username = "";

class DB {
  constructor() {
    this.scoreboard = firebase.database();
  }

  auth() {
    let returnCode = "ok";
    firebase.auth().signInWithEmailAndPassword("pigandwolfgame@gmail.com", "123456yhnbvcxz").catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      returnCode = errorCode;
    }); 
    return returnCode;
  }

  genResultID() {
    return this.scoreboard.ref().child('scoreboard').push().key;
  }

  setData(username, score, id) {
    let userScore = {
      username: username,
      score   : score
    }; 
    this.scoreboard.ref("scoreboard/" + id).set(userScore);
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
}