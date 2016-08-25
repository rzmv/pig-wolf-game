'use strict';

$(function(){
  $(document).ready(function() {
    var db = new DB();
    db.onSignIn(function(userData) {
      console.log(userData);
      console.log(userData["displayName"]);

      Username = userData["displayName"];
      Uid      = userData["uid"];

      $("#signInSN").hide();
      $("#signIn").hide();
      $("#userSettings").text(Username);
      $("#userSettings").show();

      db.getUsersScore(Uid, function(score) {
        TopUserScore = score;
        if (TopUserScore === -1) {
          TopUserScore = 0;
          $("#topScore").text(TopUserScore);
          db.setData(Username, TopUserScore, Uid);
        }
      });
    });

    $("#userSettings").click(function () {
      if ($("#userData").css("display") === "none") {
        $("#userData").show("slow");
      } else {
        $("#userData").hide("slow");
      }
    });

    $("#signIn").click(function () {
      if ($("#signInSN").css("display") === "none") {
        $("#signInSN").show("slow");
      } else {
        $("#signInSN").hide("slow");
      }
    });

    $("#signOut").click(function() {
      db.signOut();
      $("#userData").hide();
      $("#userSettings").hide();
      $("#signIn").show();
      Username = "";
      TopUserScore = -1;
      Uid = '-1';
    })

    $("#gmail").click(function () {
      db.gmailSignIn();
    });

    $("#ghub").click(function () {
      db.githubSignIn();
    });
  });
  
  $(document).mousedown(function (e){
    if (!$("#signInSN").is(e.target) && !$("#signIn").is(e.target) && $("#signInSN").has(e.target).length === 0) {
      $("#signInSN").hide("slow");
    }
    if (!$("#userData").is(e.target) && !$("#userData").is(e.target) && $("#userData").has(e.target).length === 0) {
      $("#userData").hide("slow");
    }
  });
});