(function(){
  'use strict';
  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyDOEYIuem8sZdSD4Uxy0H9haCL0uqJpUQ8",
    authDomain: "cbc-js1-final.firebaseapp.com",
    databaseURL: "https://cbc-js1-final.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

  let resultsContainer = document.getElementById("leftResultsCol")

  let state = {
    testPage:"",
    results:{
      mobile:
        {score:0,resultDetails:[]},
      desktop:
        {score:0,resultDetails:[]}
    }
  }





  function mobileSpeed(){
    fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=mobile&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
    .then((response)=>{
      return response.json()
    }).then((callback)=>{
      state.results.mobile.score = callback.ruleGroups.SPEED.score
      _.each(callback.formattedResults.ruleResults,function(value,key,list){
        if(value.ruleImpact >1 && value.localizedRuleName !== "Reduce server response time"){
          if(typeof(value.summary.args) == "undefined"){console.log("SPUD")}
          state.results.mobile.resultDetails.push({
            resultName:value.localizedRuleName,
            resultSummary:value.summary.format
          })
        }
      })
      renderResults(state,resultsContainer)
      })
  }

  function desktopSpeed(){
    fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=mobile&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
    .then((response)=>{
      return response.json()
    }).then((callback)=>{
      state.results.desktop.score = callback.ruleGroups.SPEED.score
      _.each(callback.formattedResults.ruleResults,function(value,key,list){
        if(value.ruleImpact >1 && value.localizedRuleName !== "Reduce server response time"){
          state.results.desktop.resultDetails.push({
            resultName:value.localizedRuleName,
            resultSummary:value.summary.format
          })
        }
      })
      renderResults(state,resultsContainer)
    })
  }

// Event Functions

  document.querySelector("#goButton").addEventListener('click', (event) => {
    resetView(resultsContainer)
    resetResults()
    state.testPage = document.querySelector('#urlInput').value;
    mobileSpeed()
    // desktopSpeed()
    document.querySelector('#urlInput').value = ""
  })


function resetResults(){
  state.results.desktop.resultDetails = []
  state.results.mobile.resultDetails = []
  state.results.mobile.score = 0
  state.results.desktop.score = 0
}
// Render Functions

function resetView(into){
  into.innerHTML = " "
}
function renderScore(state, into){
  into.innerHTML = `<h2>Website Score: ${state.results.mobile.score}/100</h2>`
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
        <h2>Website Score: ${state.results.desktop.score}/100</h2>
        ${state.results.desktop.resultDetails.map((result)=>{
          return `${renderResultPanels(result)}`
        }).join("")}
      </div>
      <div id="mobile" class="tab-pane" data-toggle="tab">
        <h2>Website Score: ${state.results.mobile.score}/100</h2>
        ${state.results.mobile.resultDetails.map((result)=>{
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
      <button type="button" id="${results.resultName}" class="btn btn-lrg">Add to To Do List</button>
    </div>
    `
}
  //
  // function render(data, into) {
  //   // TODO
  // }
})()
