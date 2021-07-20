function makeTooltip(){
// Start by creating the svg area
    var svg= d3.select("#organDashboard")
        .append("svg")
        .attr("width", 400)
        .attr("height", 400)
    
    // Append a circle
    svg.append("circle")
      .attr("id", "circleBasicTooltip")
      .attr("cx", 150)
      .attr("cy", 200)
      .attr("r", 40)
      .attr("fill", "#69b3a2")
    
    // create a tooltip
    var tooltip = d3.select("#organDashboard")
      .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .text("I'm a circle!");
    
    //
    d3.select("#circleBasicTooltip")
      .on("mouseover", function(){return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY)+"px").style("left",(d3.event.pageX)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
}