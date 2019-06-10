
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDRMbft0VrvZ81zLTzM3BvuJ3z4uTWf9HQ",
    authDomain: "yukie-76f54.firebaseapp.com",
    databaseURL: "https://yukie-76f54.firebaseio.com",
    projectId: "yukie-76f54",
    storageBucket: "yukie-76f54.appspot.com",
    messagingSenderId: "152968178176",
    appId: "1:152968178176:web:e9aedda2a9f0bff0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
// * Code this app to calculate when the next train will arrive; this should be relative to the current time.

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values (empty values to be manipulated by user)
var trainName = "";
var dest = "";
var trainTime = "";
var freq = 0;

// Capture Button Click
$("#submit").on("click", function(){ //submit button on click function

    event.preventDefault();

    console.log("it worked")
    
    // Takes the user input values
    trainName = $("#trainName").val().trim();
    dest = $("#dest").val().trim();
    trainTime = $("#trainTime").val().trim();
    freq = $("#freq").val().trim();

    database.ref().push({ //pushing user input values into firebase database
      // property: value (user in put value)
        trainName: trainName,
        dest: dest,
        trainTime: trainTime,
        freq: freq,

        dateAdded: firebase.database.ServerValue.TIMESTAMP //when the user submits their info
        
    });

});

// Firebase watcher + initial loader HINT: .on("value")

database.ref().on("child_added", function(snapshot) { // "child_added" is a firebase event that is typically used to retrieve a list of items from the database.

  // Log everything that's coming out of snapshot
  console.log(snapshot.val());
  console.log(snapshot.val().trainName);
  console.log(snapshot.val().dest);
  console.log(snapshot.val().trainTime);
  console.log(snapshot.val().freq);
  console.log(snapshot.val().dateAdded);

  //prepends the values on the chart
  $(".trainNameDisplay").prepend(snapshot.val().trainName + '<hr>');
  $(".destDisplay").prepend(snapshot.val().dest + '<hr>');
  $(".trainTimeDisplay").prepend(snapshot.val().trainTime + '<hr>');
  $(".freqDisplay").prepend(snapshot.val().freq + '<hr>');

  //calculating the minutes away of the next train
  var firstTimeConverted = moment((snapshot.val().trainTime), "HH:mm").subtract(1, "years");

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  var tRemainder = diffTime % (snapshot.val().freq);

  var minAway = (snapshot.val().freq) - tRemainder;

  //prepends the minutes away on the chart
  $(".minutesDisplay").prepend(minAway + '<hr>');
  
  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
