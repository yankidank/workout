// const year = moment().format('YYYY');
// const dayOfYear = moment().dayOfYear();
// const momentTimer = moment("2020-05-04T16:47:11-07:00").fromNow(); // Store and get the time for each workout
// $("#momentTimer").html('started '+momentTimer);

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

$('#addExerciseButton').click(function() {
  event.preventDefault();
  //console.log( "addExerciseButton called." );
  var formObject = {};
  var exerciseName = $('#newExerciseNameInput').val();
  var exerciseUnit = $('#newExerciseUnitInput').val();
  var exerciseForm = $('#newExerciseFormInput').val();
  //console.log(exerciseName+' '+exerciseUnit+' '+exerciseForm)

  // Arrays of Form and Unit values
  var unitArray = []
  var formArray = []
  $(".newExerciseUnit").each(function(i) {
    unitArray.push(Number(this.value))
  });
  $(".newExerciseForm").each(function(i) {
    formArray.push(this.value)
  });

  if (exerciseName && unitArray[0] != 0 && formArray[0] != '' ){
    console.log('Saving '+exerciseName)
  } else {
    console.log('Required exercise input field missing')
  }

  function toObject(form, unit) {
      var result = {};
      for (var i = 0; i < form.length; i++)
          result[form[i]] = unit[i];
      return result;
  }
  var measureObj = toObject(formArray, unitArray);

  formObject.measurements = []
  formObject.measurements.push(measureObj);
  formObject.name = exerciseName;

  // Ajax POST New Exercise
  $.ajax("/api/exercise", {
    type: "POST",
    data: formObject
  }).then(
    function() {
      console.log("Created New Exercise!");
      // Reload the page to get the updated list
      location.reload();
    }
  );

});

$('.exerciseButton').click(function() {
  event.preventDefault();
});

$( "#addRoutineSelect" ).change(function() {
    console.log($( "#addRoutineSelect option:selected" ).data())
})
$( "#addExerciseSelect" ).change(function() {
  // Add an Exercise
  var exerciseId = $( "#addExerciseSelect option:selected" ).data().id;
  $.ajax({
    url: "api/exercise/"+exerciseId,
    method: "GET"
  }).then(function(response) {
    // Return the measurements
    const measurements = response.measurements[0];
    // Key/value measurements saved to different arrays
    const keyArray = [];
    const valueArray = [];
    for(p in measurements) {
      keyArray.push(p)
      valueArray.push(measurements[p])
    }
    //console.table(keyArray)
    //console.table(valueArray)
    var rowSpan = keyArray.length; 
    var newExercise = '';

    for (let index = 0; index < keyArray.length; index++) {
      const key = keyArray[index];
      const value = valueArray[index];
      if (index === 0){
        // First measurement
        newExercise += `<tr>
          <td rowspan="${rowSpan}">${response.name}</td>
          <td>
            <div class="ui form">
              <div class="field inline">
                <input class="tableUnit" type="number" value="${value}">
              </div>
            </div>
          </td>
          <td>${key}</td>
        </tr>`;
      } else {
        // Not first measurement
        newExercise += `<tr>
          <td>
            <div class="ui form">
              <div class="field inline">
                <input class="tableUnit" type="number" value="${value}">
              </div>
            </div>
          </td>
          <td>
            ${key}
          </td>
        </tr>`;
      }
      console.log(value+' '+key)
    }
    $('#exerciseTableItems').append(newExercise);
  });
})

// Customize Routines
// Dropdown change
$( "#routineSelect" ).change(function() {
  console.log($( "#routineSelect option:selected" ).val())
})

// On page load
$(document).ready(function() {

  // Return routines
  $.ajax({
    url: "api/routine",
    method: "GET"
  }).then(function(response) {
    //console.log(response);
    response.forEach(element => {
      //console.log(element.name)
      var content = `<option data-id="${element._id}" value="${element._id}">${element.name}</option>`;
      $("#addRoutineSelect").append(content);
      $("#routineSelected").append(content);
    });
  });

  // Return Exercises
  $.ajax({
    url: "api/exercise",
    method: "GET"
  }).then(function(response) {
    //console.log(response);
    response.forEach(element => {
      //console.log(element.name)
      var content = `<option data-id="${element._id}" value="${element._id}">${element.name}</option>`;
      $("#addExerciseSelect").append(content);
      $("#newWorkoutExercises").append(content);
    });
  });

});



// Create a new workout, or continue last workout.

// Add exercises to a previous workout plan.

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
