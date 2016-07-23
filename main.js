(function(){

  var state = {
    testPage:"http://www.auswax.com.au/",
    results:{
      mobile:[],
      desktop:[],
    }
  }

  function mobileSpeed(){
    fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=mobile&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
    .then((response)=>{
      return response.json()
    }).then((callback)=>{
      state.results.mobile.push({speedScore:callback.ruleGroups.SPEED.score})

    })
}
mobileSpeed()
  // function desktopSpeed(){
  //   fetch("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+state.testPage+"&strategy=desktop&key=AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I")
  //   .then((response)=>{
  //     return response.json()
  //   }).then((callback)=>{
  //     state.results.desktop.push({speedScore:callback.ruleGroups.SPEED.score})
  //   })
// }


  // render(state, container)
  //
  // function render(data, into) {
  //   // TODO
  // }
})()
