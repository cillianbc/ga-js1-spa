(function(){
  'use strict';
  // -------------- Initialize Firebase ----------------------------------------
  let config = {
    apiKey: "AIzaSyDOEYIuem8sZdSD4Uxy0H9haCL0uqJpUQ8",
    authDomain: "cbc-js1-final.firebaseapp.com",
    databaseURL: "https://cbc-js1-final.firebaseio.com",
    storageBucket: "",
  }
  // ------ init Firebase databaseURL ------------------------------------------
  firebase.initializeApp(config);

  // ------- Declare results HTML containers -----------------------------------
  let resultsContainer = document.getElementById("leftResultsCol")
  let listContainer = document.getElementById("toDoListUl")
  let masterContainer = document.querySelector(".container-fluid")

  // ---------State for holding view data---------------------------------------
  let state = {
    testPage:"",
    prettyUrl:"",
    todoList:"",
    results:{
      mobile:
        {score:0,resultDetails:[]},
      desktop:
        {score:0,resultDetails:[]}
    }
  }

  // ------------- API Call ----------------------------------------------------
  function fetchAll(){
    let  desktopFetch =
      fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=desktop&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
      .then((response)=>{
        return response.json()
      })
    let mobileFetch = fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=mobile&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
      .then((response)=>{
        return response.json()
      })

      Promise.all([desktopFetch,mobileFetch]).then((results)=>{
        let desktopResults = results[0]
        let mobileResults = results[1]
        state.results.desktop.score = desktopResults.ruleGroups.SPEED.score
        state.results.mobile.score = mobileResults.ruleGroups.SPEED.score
        _.each(desktopResults.formattedResults.ruleResults,function(value,key,list){
          console.log(value)
          if(value.ruleImpact >0.1 && value.localizedRuleName !== "Reduce server response time"){
            state.results.desktop.resultDetails.push({
              resultName:value.localizedRuleName,
              resultSummary:value.summary.format
            })
          }
        })
        _.each(mobileResults.formattedResults.ruleResults,function(value,key,list){
          console.log(value)
          if(value.ruleImpact >0.1 && value.localizedRuleName !== "Reduce server response time"){
            state.results.mobile.resultDetails.push({
              resultName:value.localizedRuleName,
              resultSummary:value.summary.format
            })
          }
        })
        renderResults(state,resultsContainer)

    })
  }


  // ------------------ firebase functions-------------------------------------------------

    firebase.database().ref('tasks/').on('value', function(snapshot) {
      // Pull the list value from firebase
      state.todoList = snapshot.val()
      renderList(state,listContainer)
    });

  // Pull the list value from firebase
    firebase.database().ref('tasks/').on('value', function(snapshot) {
      state.todoList = snapshot.val()
      renderList(state,listContainer)
    });

// --------------------- Events ------------------------------------------------

  document.querySelector("#goButton").addEventListener('click', (event) => {
    resetView(resultsContainer)
    resetResults()
    state.testPage = document.querySelector('#urlInput').value;
    loading(resultsContainer)
    fetchAll()
    document.querySelector('#urlInput').value = ""
  })

// --------- Add new item todo List -------------------------------------------
  delegate("#leftResultsCol", 'click', '.panel', (event) => {
   let html = event.delegateTarget.querySelector(".panel-heading").innerHTML
     firebase.database().ref('tasks/').push({
       title: html,
       done: false  // Default all tasks to not-done
     });
  })

  delegate('#toDoListUl', 'click', '.delete', (event) => {
    let key = getKeyFromClosestElement(event.delegateTarget);
    console.log(key)
    firebase.database().ref(`tasks/${key}/`).remove();
  })

  delegate('#toDoListUl', 'click', '.done-it', (event) => {
    let key = getKeyFromClosestElement(event.delegateTarget);
    // Update the `done` value of that particular key to be the `checked` state of
    // the `<input>` checkbox.
    firebase.database().ref(`tasks/${key}/`).update({
      done: event.delegateTarget.checked
    });
  })


  //  ------------------- Pushes The Website as a major database key -----------
  function prettyWebsite() {
    let website = state.testPage.replace(/^https?\:\/\/www./i, "")
    website = website.replace(/\.[a-z]{3}/i, "")
    state.prettyUrl = website
  }


  // ------------- Resets all Results in the state -----------------------------
  function resetResults(){
    state.testPage = ""
    state.results.desktop.resultDetails = []
    state.results.mobile.resultDetails = []
    state.results.mobile.score = 0
    state.results.desktop.score = 0
  }

  // ----------- Pushes the Scores into the database ---------------------------

  function pushDesktopScore(){
       firebase.database().ref('Speed/Desktop').set({
         score: state.results.desktop.score
       });
  }
  function pushMobileScore(){
       firebase.database().ref('Speed/Mobile').set({
         score: state.results.mobile.score
       });
  }

  // ---------------- Render & View Functions ----------------------------------

  function resetView(into){
    into.innerHTML = " "
  }
  function loading(into){
    into.innerHTML = `<div class="loading"><img src="img/38.gif"></a></div>`
  }
  function renderScore(state, into){
    into.innerHTML = `<h2>Website Score: ${state.results.mobile.score}/100</h2>`
  }

  function getKeyFromClosestElement(element) {
     // Search for the closest parent that has an attribute `data-id`
     let closestItemWithId = closest(event.delegateTarget, '[data-id]')
     if (!closestItemWithId) {
       throw new Error('Unable to find element with expected data key');
     }
     // Extract and return that attribute
     return closestItemWithId.getAttribute('data-id');
   }


  function renderResults(data,into){
    into.innerHTML = `
      <h3>How to Speed your site up</h3>
      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#desktop">Desktop</a></li>
        <li><a data-toggle="tab" href="#mobile">Mobile</a></li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane active" id="desktop">
          <h2>${data.prettyUrl} Score: ${data.results.desktop.score}/100</h2>
          ${data.results.desktop.resultDetails.map((result)=>{
            return `${renderResultPanels(result)}`
          }).join("")}
        </div>
        <div id="mobile" class="tab-pane" data-toggle="tab">
          <h2>${data.prettyUrl} Score: ${data.results.mobile.score}/100</h2>
          ${data.results.mobile.resultDetails.map((result)=>{
            return `${renderResultPanels(result)}`
          }).join("")}
        </div>
      </div>
      `
  }

  function renderResultPanels(results){
    return `
      <div class="panel panel-primary">
        <div class ="panel-heading">${results.resultName}</div>
        <div class="panel-body">${results.resultSummary}</div>
        <button type="button" id="resultPanel" class="btn btn-lrg">Add to To Do List</button>
      </div>
      `
  }

  function renderList(state,into){
    into.innerHTML = Object.keys(state.todoList).map((key) => {
      return `
      <li data-id="${key}" ${state.todoList[key].done ? "style='text-decoration: line-through'" : ""}>
      <input class="done-it" type="checkbox" ${state.todoList[key].done ? "checked" : ""} />
      ${state.todoList[key].title}
      <button class="delete btn btn-warning">Delete</button>
      `
    }).join('')
  }

})()
