// const year = moment().format('YYYY');
// const dayOfYear = moment().dayOfYear();
// const momentTimer = moment("2020-05-04T16:47:11-07:00").fromNow(); // Store and get the time for each workout
// $("#momentTimer").html('started '+momentTimer);
var workoutId

$('.ui.dropdown').dropdown();
$('select.dropdown').dropdown();

$('#addWorkoutButton').click(function() {
  event.preventDefault();
  console.log( "addWorkoutButton called." );
  // Ajax POST to save Workout
  $.ajax("/api/workout/", {
    type: "POST"
  }).then(
    function() {
      console.log("Created New Exercise!");
      // Reload the page to get the updated list
      location.reload();
    }
  );
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
  // Add Exercise to Workout
  var exerciseId = $( "#addExerciseSelect option:selected" ).data().id;
  const workoutData = {}
  workoutData.measurements = []
  workoutData.measurements.push(exerciseId);
  // POST exercise to workout
  $.ajax("/api/workout/"+workoutId, {
    type: "POST",
    data: workoutData
  }).then(
    function() {
      console.log(`Added ${exerciseId} to ${workoutId} `);
      // Reload the page
      location.reload();
    }
  );
  // GET exercise data
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
$( "#routineSelect" ).change(function() {
  console.log($( "#routineSelect option:selected" ).val())
})

// On page load
$(document).ready(async function() {
  // Get workout data
  var workoutResponse = await $.ajax({
    url: "api/workout/",
    method: "GET"
  }).then(function(response) {
    return response;
  })
  //console.log(workoutResponse[0]._id)

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

  if(!workoutResponse[0].date_end){
    var endButton = `<button class="ui labeled icon red button right floated" id="endWorkoutButton" type="submit">
        <i class="icon stopwatch"></i>
        End Workout
      </button>`;
    $("#endWorkout").append(endButton);
  }
  $('#endWorkoutButton').click(function() {
    event.preventDefault();
    var endData = {_id: workoutResponse[0]._id, date_end: new Date(Date.now()) };
    $.ajax("/api/workout/"+workoutResponse[0]._id, {
      type: "PUT",
      data: endData
    }).then(
      function() {
        location.reload();
      }
    );
  })

});
