// initial variables
let database = firebase.database();

let trainName = "";
let destination = "";
let firstTrain = "";
let frequency = 0;
let nextArrival;
let minutesAway;

function calculations(name, dest, first, freq) {
    // set the values for the variables that don't need adjusting
    trainName = name;
    destination = dest;
    frequency = freq;

    // calculate the nextArrival and minutesAway values
    let firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    let currentTime = moment();
    console.log(`Current time: ${moment(currentTime).format("HH:mm")}`);
    
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(`Difference in time: ${diffTime}`);
    
    let timeRemain = diffTime % frequency;
    console.log(timeRemain);
    
    // find the minutes until next train
    minutesAway = frequency - timeRemain;
    console.log(`Minutes till train: ${minutesAway}`);

    // find the next train time
    nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
    console.log(`Next train arrival: ${nextArrival}`);
        

    addData();
}

function addData() {
    // add the entries into the database as a new child
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });
}

// document ready shorthand
$(function () {

    // timepicker option display
    $('input.timepicker').timepicker({ timeFormat: "HH:mm"});

    // event listeners ===========================

    // saves the input values upon submit button click
    $("#add-train").on("click", function () {
        // stop the default click behavior
        event.preventDefault();

        // save the input
        let trainNameInput = $("#name-input").val().trim();
        let destinationInput = $("#dest-input").val().trim();
        let firstTrainInput = $("#first-input").val().trim();
        let frequencyInput = $("#freq-input").val().trim();

        // confirm the input
        console.log(`Train name: ${trainNameInput}`);
        console.log(`Destination: ${destinationInput}`);
        console.log(`First Train: ${firstTrainInput}`);
        console.log(`Frequency: ${frequencyInput} min`);

        // do the math and conversions
        calculations(trainNameInput, destinationInput, firstTrainInput, frequencyInput);
    });

    // watches for when an entry is added to the database and updates the html page to show
    database.ref().on("child_added", function (snapshot) {
        // store the value at the moment in a variable
        let sv = snapshot.val();
        console.table(`Snapshot: ${sv}`);

        // dynamically build the HTML elements
        let trainInfo = $("<tr>").append(
            $("<td>").text(sv.trainName),
            $("<td>").text(sv.destination),
            $("<td>").text(sv.frequency),
            $("<td>").text(sv.nextArrival),
            $("<td>").text(sv.minutesAway)
        );

        // add the element onto the HTML page
        $("#entries").append(trainInfo);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});

// stuff to get the timepicker JS to work (not quite sure how it works exactly)
// (function ($) {
//     $(function () {
//         $('input.timepicker').timepicker();
//     });
// })(jQuery);