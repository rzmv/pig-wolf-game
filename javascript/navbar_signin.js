$(function(){
  $(document).ready(function() {
    $("#signIn").click(function () {
      if ($("#signInSN").css("display") === "none") {
        $("#signInSN").show("slow");
      } else {
        $("#signInSN").hide("slow");
      }
    });

    $("#gmail").click(function () {

    }); 

    $("#ghub").click(function () {

    });
  });
  
  $(document).mousedown(function (e){ 
    if (!$("#signInSN").is(e.target) && !$("#signIn").is(e.target) && $("#signInSN").has(e.target).length === 0) { 
      $("#signInSN").hide("slow"); 
    }
  });
});