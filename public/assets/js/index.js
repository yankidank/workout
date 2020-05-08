var workoutId

async function removeRoutineExercise(routine, exercise){
  const exerciseData = {exercises: exercise};
  var ajaxRoutineStore = await $.ajax({
    url: "api/routine/"+routine,
    method: "DELETE",
    data: exerciseData
  }).then(function(response) {
    console.table(response)
    console.log(`Removed Exercise ${exercise} from Routine`)
  });
}

async function exerciseTable(id){
  // GET exercise data
  var ajaxExercises = await $.ajax({
    url: "api/exercise/"+id,
    method: "GET"
  }).then(function(response) {
    // Return the measurements
    if (response.measurements[0]){
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
            <!-- <td rowspan="${rowSpan}">
              <a href="#${response._id}" title="Remove Exercise"><i class="icon red x tableicon"></i></a>
            </td> -->
            <td rowspan="${rowSpan}">
              ${response.name}
            </td>
            <td>
              <div class="ui form">
                <div class="field inline">
                  <!-- <input class="tableUnit" type="number" value="${value}"> -->
                  ${value}
                </div>
              </div>
            </td>
            <td>${key}</td>
            <!--
            <td rowspan="${rowSpan}">
              <a href="#" title="Mark as Complete"><i class="icon green check tableicon"></i></a>
            </td>
            -->
          </tr>`;
        } else {
          // Not first measurement
          newExercise += `<tr>
            <td>
              <div class="ui form">
                <div class="field inline">
                  <!-- <input class="tableUnit" type="number" value="${value}"> -->
                  ${value}
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
    }
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
      console.log("Created New Workout");
      // Reload the page to get the updated list
      location.reload();
    }
  );
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
    <input type="number" class="newExerciseUnit" data-value="${unitId}" placeholder="# of lbs, laps, miles">
  </div>
  <div class="four wide field borderTop">
    <label>Form</label>
    <input type="text" class="newExerciseForm" data-value="${unitId}" placeholder="Reps, laps, miles">
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
  //console.log(newRoutine)
  var formObject = {};
  formObject.name = newRoutine;
  //console.log(formObject)
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
      var content = `<option data-value="${element._id}" value="${element._id}">${element.name}</option>`;
      $("#addRoutineSelect").append(content);
      $("#routineSelected").append(content);
    });
  });

  // Add exercises from routine to workout
  $("#addRoutineSelect").change(async function() {
    var routineId = $("#addRoutineSelect option:selected").data().value;
    await $.ajax({
      url: "api/routine/"+routineId,
      method: "GET"
    }).then(async function(res) {
      for (let i = 0; i < res.exercises.length; i++) {
        await $.ajax({
          url: "api/exercise/"+res.exercises[i],
          method: "GET"
        }).then(async function(response) {
          const exerciseId = res.exercises[i];
          const workoutData = workoutResponse[0];
          const exercisesList = workoutData.exercises
          exercisesList.push(exerciseId);
          const exerciseData = {_id: workoutData._id,  exercises: exercisesList};
          await $.ajax("/api/workout/"+workoutData._id, {
            type: "PUT",
            data: exerciseData
          }).then(
            function() {
              //location.reload();
            }
          );
          exerciseTable(response._id);
        })
        //exerciseTable(response.exercises[i]._id);
        //location.reload();
      }
    })
  })
 
  // Return Exercises for Form Options
  await $.ajax({
    url: "api/exercise",
    method: "GET"
  }).then(function(response) {
    //console.log(response);
    response.forEach(element => {
      //console.log(element.name)
      var content = `<option data-value="${element._id}" value="${element._id}">${element.name}</option>`;
      $("#addExerciseSelect").append(content);
      $("#newExercises").append(content);
    });
  });

  // Add exercises to workout from dropdown
  $("#addExerciseSelect").change(function() {
    var exerciseId = $( "#addExerciseSelect option:selected" ).data().value;
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
    $('#addWorkoutButton').toggleClass('hidden');
    $('#endWorkoutButton').toggleClass('hidden');
  }
  $('#endWorkoutButton').click(function() {
    event.preventDefault();
    $('#addWorkoutButton').toggleClass('hidden');
    $('#endWorkoutButton').toggleClass('hidden');
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
  $("#routineEdit").change(function() {
    $("#routineExercises .multiple a").remove();
  })
  // Return Exercises in Routines
  $("#routineSelected").change(async function() {
    // Enable exercise input
    $('#routineExercises .multiple').removeClass('disabled')
    var routineId = $("#routineSelected option:selected").data().value;
    await $.ajax({
      url: "api/routine/"+routineId,
      method: "GET"
    }).then(async function(res) {
      for (let i = 0; i < res.exercises.length; i++) {
        await $.ajax({
          url: "api/exercise/"+res.exercises[i],
          method: "GET"
        }).then(async function(response) {
          // On Edit Routine dropdown change
          // add exercises to search input
          $(`<a class="ui label transition exerciseElement visible" data-value="${response._id}" style="display: inline-block !important;"> ${[response.name]}<i class="delete icon"></i></a>`).insertAfter("#routineExercises div i.dropdown");
        })
      }
    })
  })

  // Save exercise to routine
  $("#routineExercises .multiple .menu .item").click(function(){
    var routineId = $("#routineSelected option:selected").data().value;
    if (routineId){
      var exerciseId = $(this)[0].attributes[1].nodeValue
      saveExercise(routineId, exerciseId)
    }
  })

// End on page load
});

async function saveExercise(routine, exercise){
  var exerciseArray = await routineExerciseArray(routine);
  exerciseArray.push(exercise);
  const exerciseData = {exercises: exerciseArray};
  await $.ajax("/api/routine/"+routine, {
    type: "PUT",
    data: exerciseData
  }).then(
    function() {
      console.log('Added exercise to routine')
    }
  );
}

// Remove Exercise from Routine when clicking in search box
// Requires edit of semantic.js (for now) around line 5454
// remove: {
//  click: function() {
//    clicklabel(); // Add this line
async function clickLabel(passThis){
  var exercise = passThis[0].parentElement.attributes[1].nodeValue;
  var routine = $("#routineSelected option:selected").data().value;
  var exerciseArray = await routineExerciseArray(routine)
  function removeExercise(id) {
    return id != exercise;
  }
  var filteredExercises = exerciseArray.filter(removeExercise)
  const exerciseData = {exercises: filteredExercises};
  await $.ajax("/api/routine/"+routine, {
    type: "PUT",
    data: exerciseData
  }).then(
    function() {
      console.log('Removed exercise from routine')
    }
  );
}

async function routineExerciseArray(routine){
  var getRoutine = await $.ajax({
    url: "api/routine/"+routine,
    method: "GET"
  }).then(function(response) {
    return response.exercises
  });
  return getRoutine
}
