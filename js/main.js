$(function() {

var thresholdScale = d3.scaleThreshold()
  .domain(d3.range(69,75))
  .range(d3.schemeRdBu[6]);

var svg = d3.select("#vis").append("svg");

svg.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(20,20)");

var legend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .useClass(true)
    .scale(thresholdScale)

/*
----legendHelpers.thresholdLabels----
function({ i, genLength, generatedLabels }){
  if (i === 0 ){
    return generatedLabels[i]
      .replace('NaN to', 'Less than')
  } else if (i === genLength - 1) {
    return `More than
      ${generatedLabels[genLength - 1]
      .replace(' to NaN', '')}`
  }
  return generatedLabels[i]
}
*/

svg.select(".legendQuant")
  .call(legend);

});