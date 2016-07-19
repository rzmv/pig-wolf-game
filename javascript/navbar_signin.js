$(function(){
  $(document).ready(function() {
    var db = new DB();
    db.onSignIn(function(userData) {
      console.log(userData);
      console.log(userData[0].displayName);
      $("#signInSN").hide();
      $("#signIn").hide();
      $("#userSettings").text(userData[0].displayName);
      $("#userSettings").show();
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
      alert("sdf");
      db.signOut();
      $("#userData").hide();
      $("#userSettings").hide();
      $("#signIn").show();
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