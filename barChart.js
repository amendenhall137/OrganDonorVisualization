var barMargin = {top: 50, right: 170, bottom: 75, left: 300},
    smallBarGraph = {graphWidth: (450-barMargin.left-barMargin.right), graphHeight:(300-barMargin.top-barMargin.bottom),width: 450,height:300,attrText:"12px",titleText:"20px"},
    bigBarGraph = {graphWidth: (750-barMargin.left-barMargin.right), graphHeight:(600-barMargin.top-barMargin.bottom),width: 750,height:600,attrText:"14px",titleText:"24px"},
    barPadding = 0;
var colors =['#F94040','#808080','#0000FF','#FF6000','#94641F','#AD07E3','#F0EA00','#000000','#00FF00','#FFA0A0','#C0B57B','#90BFF9','#A00000','#D4D4D4','#000080','#FFC080','#8C7E39','#A0FFA0','#FFC0E0','#ECE6CA','#008000'];
    

function barChartSetup(svgContainer){
    //Graph1 = Transplant
    svgContainer.append("svg")
    .attr("width", bigBarGraph.width)
    .attr("height", bigBarGraph.height)
    .attr("x", barPadding*2+bigBarGraph.width+0)
    .attr("y", barPadding)
    .attr("style", "outline: thin solid red;")
    .append("g")
        .attr("transform",
            "translate(" + barMargin.left + "," + barMargin.top + ")")
        .attr("class","bigBarGraph")
        .attr("graphType","bar")
        .attr("id", "TransplantBar");

    return ["TransplantBar"];
}


function makeBarChart(){ //horizontal bar chart
    d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearPaymentTransplantWaitlist2.csv").then(function(data){
    var yAxis = "Payment";
    var bars1 = "Waitlist_Additions";
    var bars2 = "Waitlist_Removals";
    var bars3 = "NumberTransplants";
    var scene3 = d3.select("#organDashboard");
    var graphName = barChartSetup(scene3);
    var graph = scene3.select("#"+graphName);
    minX = 0;
    maxX = d3.max(data, function(d) {return parseFloat(d[bars1])+parseFloat(d[bars1])*0.1;});
    
    //x-axis
    var barXScales = d3.scaleLinear().range([0,bigBarGraph.graphWidth]);
    barXScales.domain([0,maxX]);
    graph.append("g")
         .attr("transform","translate(0,"+bigBarGraph.graphHeight+")")
         .call(d3.axisBottom(barXScales));
    
    //y-axis
    var barYScales = d3.scaleBand().range([0,bigBarGraph.graphHeight]).padding(0.4);
    barYScales.domain(data.map(function(d){ return d[yAxis]}));
    graph.append("g")
         .call(d3.axisLeft(barYScales).tickFormat(function(d){
             return d;
         }).ticks(10))
         .append("text")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .attr("text-anchor", "end")
         .text("value");

    var colorBy = "Payment";
    var groupedData = d3.nest() // nest function allows to group the calculation per level of a factor
                        .key(function(d) { return d[colorBy];})
                        .entries(data);
    console.log(groupedData);
    //Add data
    graph.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class","bar")
    .attr("x", function(d) { return 0})//barXScales(d[bars1]); })
    .attr("y", function(d) { return barYScales(d[yAxis]); })
    .attr("height", barYScales.bandwidth())
    .attr("width", function(d) { return barXScales(d[bars1]); });

    })//End CSV pull
}