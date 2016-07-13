class DB {
  constructor() {
    let config = {
      apiKey: "AIzaSyBAjZ13FHcaqIGVjrbTDTZb1JV5crYKtt4",
      authDomain: "pigwolftable.firebaseapp.com",
      databaseURL: "https://pigwolftable.firebaseio.com",
      storageBucket: "pigwolftable.appspot.com",
    };
    firebase.initializeApp(config);
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

  setData(username, score) {
    let userScore = {
      username: username,
      score   : score
    }; 
    this.scoreboard.ref("scoreboard/" + this.genResultID()).set(userScore);
  }

  //return [<score, username>]
  getLeaderBoard(count, callback) {
    this.scoreboard.ref('scoreboard/').orderByChild('score').limitToLast(count).once('value', function(value) {
      let result = Object.values(value.val()).reverse();
      callback(result);
    });
  }
}