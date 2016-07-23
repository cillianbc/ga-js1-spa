(function(){

  var state = {
    testPage:"http://www.auswax.com.au",
    results:{
      mobile:
        {score:1,resultDetails:[]},
      desktop:
        {score:1,resultDetails:[]}
    }
  }

  function mobileSpeed(){
    fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=mobile&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
    .then((response)=>{
      return response.json()
    }).then((callback)=>{
      state.results.mobile.score = callback.ruleGroups.SPEED.score
      _.each(callback.formattedResults.ruleResults,function(value,key,list){
        if(value.ruleImpact >1){
          state.results.mobile.resultDetails.push({
            resultName:value.localizedRuleName,
            resultSummary:value.summary,
          })
        }
      })
      console.log(state.results.mobile)
    })
}
  mobileSpeed()
  function desktopSpeed(){
    fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=desktop&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
    .then((response)=>{
      return response.json()
    }).then((callback)=>{
      state.results.desktop.score = callback.ruleGroups.SPEED.score
      _.each(callback.formattedResults.ruleResults,function(value,key,list){
        if(value.ruleImpact >1){
          state.results.desktop.resultDetails.push({
            resultName:value.localizedRuleName,
            resultSummary:value.summary,
          })
        }
      })
      console.log(state.results.desktop)
    })
}
  desktopSpeed()

  // render(state, container)
  //
  // function render(data, into) {
  //   // TODO
  // }
})()
