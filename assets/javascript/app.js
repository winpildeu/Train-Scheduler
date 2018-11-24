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

    // convert the time input to a Moment.js format (req. a random date...)
    first = moment(first, "HH mm").format("hh mm A");
    console.log(`Converted time: ${first}`);

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
        console.log(`Snapshot: ${sv}`);

        // dynamically build the HTML elements
        let trainInfo = $("<div>").append(
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