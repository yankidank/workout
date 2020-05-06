var workoutId

async function exerciseTable(id){
  // GET exercise data
  var ajaxExercises = await $.ajax({
    url: "api/exercise/"+id,
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
      //console.log(value+' '+key)
    }
    $('#exerciseTableItems').append(newExercise);
  });

}

$('.ui.dropdown').dropdown();
$('select.dropdown').dropdown();

$('#addWorkoutButton').click(function() {
  event.preventDefault();
  // Ajax POST to save Workout
  $.ajax("/api/workout/", {
    type: "POST"
  }).then(
    function() {
      console.log("Created New Exercise");
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
  var formObject = {};
  var exerciseName = $('#newExerciseNameInput').val();
  // Arrays of Form and Unit values
  var unitArray = []
  var formArray = []
  $(".newExerciseUnit").each(function(i) {
    unitArray.push(Number(this.value))
  });
  $(".newExerciseForm").each(function(i) {
    formArray.push(this.value)
  });
  // Check if exercise input fields have values
  if (exerciseName && unitArray[0] != 0 && formArray[0] != '' ){
    console.log('Saving '+exerciseName)
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
    // POST New Exercise
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
  } else {
    console.log('Required exercise input field missing')
  }
});


$('#routineCreate').click(function() {
  event.preventDefault();
  var newRoutine = $('#routineNew').val();
  console.log(newRoutine)
  var formObject = {};
  formObject.name = newRoutine;
  console.log(formObject)
  // POST New Routine
  $.ajax("/api/routine", {
    type: "POST",
    data: formObject
  }).then(
    function() {
      console.log("Created New Routine");
      // Reload the page to get the updated list
      location.reload();
    }
  );
})

$(".exerciseButton").click(function() {
  event.preventDefault();
});

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
  }).then(async function(response) {
    const measurements = response[0].exercises;
    for (let i = 0; i < measurements.length; i++) {
      // for each exercise
      const makeTable = exerciseTable(measurements[i]);
      // Just like await Promise.all([a, b])
      await makeTable;
    }
    return response;
  })
  //console.log(workoutResponse[0]._id)
  // Return routines
  $.ajax({
    url: "api/routine",
    method: "GET"
  }).then(function(response) {
    response.forEach(element => {
      var content = `<option data-id="${element._id}" value="${element._id}">${element.name}</option>`;
      $("#addRoutineSelect").append(content);
      $("#routineSelected").append(content);
    });
  });
/* 
  // Return exercises when selecting routine
  $("#addRoutineSelect").change(async function() {
    var routineId = $("#addRoutineSelect option:selected").data().id;
    await $.ajax({
      url: "api/routine/"+routineId,
      method: "GET"
    }).then(async function(response) {
      console.log(response)
      for (let i = 0; i < response.exercises.length; i++) {
        await $.ajax({
          url: "api/exercise/"+response[i]._id,
          method: "GET"
        }).then(async function(response) {
          response._id
          exerciseTable(response._id);
        })
        //exerciseTable(response.exercises[i]._id);
        //location.reload();
      }
    })
  })
 */
  // Return Exercises
  await $.ajax({
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
  // Add exercises to workout
  $("#addExerciseSelect").change(function() {
    var exerciseId = $( "#addExerciseSelect option:selected" ).data().id;
    const workoutData = workoutResponse[0];
    const exercisesList = workoutData.exercises
    exercisesList.push(exerciseId);
    const exerciseData = {_id: workoutResponse[0]._id,  exercises: exercisesList};
    // POST exercise to workout
    $.ajax("/api/workout/"+workoutResponse[0]._id, {
      type: "PUT",
      data: exerciseData
    }).then(
      function() {
        //location.reload();
      }
    );
    exerciseTable(exerciseId);
  });
  // Add button to end workout
  if(!workoutResponse[0].date_end){
    var date_start = workoutResponse[0].date_start;
    //$("#timer").html(date_start);
    var endButton = `<button class="ui labeled icon red button right floated" id="endWorkoutButton" type="submit">
        <i class="icon stopwatch"></i>
        End Workout
      </button>`;
    $("#endWorkout").append(endButton);
  }
  $('#endWorkoutButton').click(function() {
    event.preventDefault();
    $("#timer").toggleClass('hidden');
    var endData = {_id: workoutResponse[0]._id, date_end: new Date(Date.now()) };
    $.ajax("/api/workout/"+workoutResponse[0]._id, {
      type: "PUT",
      data: endData
    }).then(
      function() {
        //location.reload();
      }
    );
    $('#endWorkoutButton').toggleClass('disabled')
  })

});
