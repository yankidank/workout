// const year = moment().format('YYYY');
// const dayOfYear = moment().dayOfYear();
// const momentTimer = moment("2020-05-04T16:47:11-07:00").fromNow(); // Store and get the time for each workout
// $("#momentTimer").html('started '+momentTimer);

const newExercise = `<tr>
<td rowspan="2">Running</td>
<td>
  <div class="ui form">
    <div class="field inline">
      <input class="tableUnit" type="number" value="12">
    </div>
  </div>
</td>
<td>laps</td>
</tr>`;


$('.ui.dropdown').dropdown();
$('select.dropdown').dropdown();

$('#addWorkoutButton').click(function() {
  event.preventDefault();
  console.log( "addWorkoutButton called." );
});
$('#updateWorkoutButton').click(function() {
  event.preventDefault();
  console.log( "updateWorkoutButton called." );
  $('#updateWorkoutButton .icon').toggleClass('check');
  setTimeout(function(){$('#updateWorkoutButton .icon').toggleClass('check')}, 1200)
});
$('#addFieldButton').click(function() {
  event.preventDefault();
  var unitId = $(".newExerciseUnit").last().data();
  unitId = ++unitId.id;
  //console.log(unitId)
  const moreFields = `<div class="fields">
  <div class="six wide field"></div>
  <div class="six wide field borderTop">
    <label>Unit</label>
    <input type="number" class="newExerciseUnit" data-id="${unitId}" placeholder="# of lbs, laps, miles">
  </div>
  <div class="four wide field borderTop">
    <label>Form</label>
    <input type="text" class="newExerciseForm" data-id="${unitId}" placeholder="Reps, laps, miles">
  </div>
</div>`;
  $('#insertFields').append(moreFields);
});

var measurementData = [];

$('#addExerciseButton').click(function() {
  event.preventDefault();
  //console.log( "addExerciseButton called." );

  var formObject = {};
  
  var exerciseName = $('#newExerciseName').val();
  if (exerciseName){
    console.log(exerciseName)
  } else {
    console.log('Exercise Name Not Provided')
  }

  var unitId 
  var unitTitle
  var formId
  var formTitle
  var unitArray = []
  var formArray = []

  // Create array of Form, Unit
  $(".newExerciseUnit").each(function(i) {
    unitArray.push(Number(this.value))
  });
  // Create array of Form, Unit
  $(".newExerciseForm").each(function(i) {
    formArray.push(this.value)
  });

  var unitId = $(".newExerciseUnit").data().id;
  var unitTitle = $(".newExerciseUnit").val();
  var formId = $(".newExerciseForm").data().id;
  var formTitle = $(".newExerciseForm").val();

/*   
  var newarray = [],
      thing;
  for(var y = 0; y < unitArray.length; y++){
      thing = {};
      for(var i = 0; i < formArray.length; i++){
        thing[formArray[i]] = unitArray[y][i];
      }
      newarray.push(thing)
  }
  console.log(newarray)
*/

  //measurementData.push({unit: unitTitle, form: formTitle})

  formObject.measurements = [...measurementData];

  formObject.name = exerciseName;
  //console.table(formObject.measurements);
});
$('.exerciseButton').click(function() {
  event.preventDefault();
});


// Sample to add an Exercise
$('#exerciseTableItems').append(newExercise);

$( "#addRoutineSelect" ).change(function() {
    console.log($( "#addRoutineSelect option:selected" ).data())
})
$( "#addExerciseSelect" ).change(function() {
  console.log($( "#addExerciseSelect option:selected" ).data())
})

// Customize Routines
// Dropdown change
$( "#routineSelect" ).change(function() {
  console.log($( "#routineSelect option:selected" ).val())
})

// Create a new workout, or continue last workout.


// Add exercises to a previous workout plan.
/*
VIEWS: Exercise, Workout Plans, Home/Current Routine

ROUTES: 
  GET workouts    // Previous workout
  GET workouts/:id// Returns sepcific workout
  POST exercise   // Add new
  PUT exercis/:id // Modify
  POST routine    // Add new
  PUT routine/:id // Modify
                  // When a routine is modified, create a clone and switch to it 
  

routines: // Group into repeatable routines
[
  {
    id: INTEGER,
    name: STRNG,
    exercises: [1,2,3,4]
  }
]
exercises: // Details of exercise (name, format, measurement)
[ 
  {
    id: INTEGER,
    name: String, // Bench Press
    measurements:
    [
      {
        unit: INT, // 10 reps
        form: STRING // repetitions, miles, laps, minutes, etc
      },
      {
        unit: INT,
        form: STRING
      }
    ]
  }
]
workout: // Track the data
[
  {
    id: INT,
    timesamp: Date, // Log the time of post
    exercises: [1,2,3]
  }
]
*/

/* 
// Return current workout
fetch("/api/workout")
  .then(response => response.json())
  .then(data => {
    // save db data on global variable
    workouts = data;
    populateTable();
    storeWorkout();
  });
*/

function storeWorkout() {
  const nameEl = document.querySelector("#t-name");
  const amountEl = document.querySelector("#t-amount");
  const errorEl = document.querySelector(".error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  } else {
    errorEl.textContent = "";
  }

  // create record
  const workout = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // add to beginning of current array of data
  workouts.unshift(workout);

  // re-run logic to populate ui with new record
  populateTable();

  // also send to server
  fetch("/api/workout", {
    method: "POST",
    body: JSON.stringify(workout),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      } else {
        // clear form
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(err => {
      // fetch failed, so save in indexed db
      saveRecord(workout);

      // clear form
      nameEl.value = "";
      amountEl.value = "";
    });
}
