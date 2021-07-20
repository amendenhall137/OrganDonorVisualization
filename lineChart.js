// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 75, left: 50},
    smallGraph = {graphWidth: (450-margin.left-margin.right), graphHeight:(300-margin.top-margin.bottom),width: 450,height:300,attrText:"12px",titleText:"20px"},
    bigGraph = {graphWidth: (900-margin.left-margin.right), graphHeight:(600-margin.top-margin.bottom),width: 900,height:600,attrText:"14px",titleText:"24px"},
    padding = 10;
var colors =['#F94040','#808080','#0000FF','#FF6000','#94641F','#AD07E3','#F0EA00','#000000','#00FF00','#FFA0A0','#C0B57B','#90BFF9','#A00000','#D4D4D4','#000080','#FFC080','#8C7E39','#A0FFA0','#FFC0E0','#ECE6CA','#008000'];
    
function chartSetup(svgContainer){

    //Graph1 = Transplant
    svgContainer.append("svg")
    .attr("width", bigGraph.width)
    .attr("height", bigGraph.height)
    .attr("x", padding)
    .attr("y", padding)
    .attr("style", "outline: thin solid red;")
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class","bigGraph")
        .attr("graphType","line")
        .attr("id", "TransplantLine");

  return ["TransplantLine"];
}

function setupAxes(svg, xmax=0, ymax=0, xmin=0, ymin=0){
    if(svg.attr("graphType") =="line"){
        var width=0;
        var height=0;
        var attrText=0;
        var titleText=0;
        if(svg.attr("class") == "smallGraph"){
          width = smallGraph.graphWidth;
          height = smallGraph.graphHeight;
          attrText = smallGraph.attrText;
          titleText = smallGraph.titleText;
        }
        else if(svg.attr("class") == "bigGraph"){
          width = bigGraph.graphWidth;
          height = bigGraph.graphHeight;
          attrText = bigGraph.attrText;
          titleText = bigGraph.titleText;
        }

        //x-scale
        var x = d3.scaleLinear()
          .domain([xmin, xmax])
          .range([ 0, width ]);
        //x-axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")") //Move to bottom of graph
          .style("font-size", attrText)
          .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(6));
        //xlabel
        svg.append("text")
          .attr("class", "xlabel")
          .attr("id",("xlabel_"+ svg.attr("id")))
          .attr("text-anchor", "middle")
          .attr("x", width/2)
          .attr("y", height + 40)
          .style("font-size", attrText)
          .text(svg.attr("id"));

        //yscale
        var y = d3.scaleLinear()
          .domain([ymin, ymax])
          .range([ height, 0]);
        //yaxis
        svg.append("g")
           .style("font-size", attrText)
           .call(d3.axisLeft(y));
        //Ylabel
        svg.append("text")
          .attr("class", "ylabel")
          .attr("id",("ylabel_"+svg.attr("id")))
          .attr("text-anchor", "middle")
          .attr("x", -width/2)
          .attr("y", -margin.left)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .style("font-size", attrText)
          .text(svg.attr("id"));

        //Add title
        svg.append("text")
          .attr("class", "title")
          .attr("id",("title_"+ svg.attr("id")))
          .attr("text-anchor", "middle")
          .attr("x", width/2)
          .attr("y", 0)
          .style("font-size", titleText)
          .text(svg.attr("id"));

        return {"x":x,"y":y};

    }
    else if(svg.attr("graphType") == "pie"){

    }
}

function addData(svg,data,scales,colorList,yAxis,colorBy,xAxis,lineStyle,filter=""){
  if(svg.attr("graphType") == "line"){
    var width=0;
    var height=0;
    var attrText="0px";
    var titleText="0px";
    var dash = (0,0);
    if(svg.attr("class") == "smallGraph"){
      width = smallGraph.graphWidth;
      height = smallGraph.graphHeight;
      attrText = smallGraph.attrText;
      titleText = smallGraph.titleText;
    }
    else if(svg.attr("class") == "bigGraph"){
      width = bigGraph.graphWidth;
      height = bigGraph.graphHeight;
      attrText = bigGraph.attrText;
      titleText = bigGraph.titleText;
    }
    if(lineStyle == "dashed"){
        dash = (20,2);
    }
    else if(lineStyle == "dotted"){
        dash = (4,2);
    }
    
    // group the data: I want to draw one line per group
    var groupedData = d3.nest() // nest function allows to group the calculation per level of a factor
                    .key(function(d) { return d[colorBy];})
                    .entries(data);
    if((svg.attr("sceneNum")=="1")){
      var filteredData = groupedData.filter(function(d){return d.key == filter});
    }
    
    var colorByOptions = groupedData.map(function(d){ return d.key }); // list of group names
    var colorScale = d3.scaleOrdinal()
      .domain(colorByOptions)
      .range(colorList.slice(0,colorByOptions.length));
    // Draw the line
    svg.selectAll(".line")
        .data(filteredData)
        .enter()
        .append("path")
          /*.on('mouseover', function(d,i){
            tooltip.style("opacity",1)
            .style("left",(d3.event.pageX)+"px")
            .style("top",(d3.event.pageY)+"px")
            html("hi")
          })
          .on("mouseout",function(){tooltip.style("opacity",0)*/
          .attr("fill", "none")
          .attr("stroke", function(d){ return colorScale(d.key) })
          .style("stroke-dasharray", dash)//("10,3"))
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return scales.x(d[xAxis]); })
              .y(function(d) { return scales.y(+d[yAxis]); })
              (d.values)
          })
    if(lineStyle == "solid"){ //Only add legend one time
    //Add legend
    var legendSpacing = 6;
    var legendG = svg.selectAll(".legend").data(colorByOptions).enter().append("g")
    //Add rect
    var legendBar =  legendG.attr("class","legend")
                            .attr("id", function(d){return (d[colorBy]+"_"+yAxis)})
                            .append("rect")
                            .attr("width", 20)
                            .attr("height", 5)
                            .attr("x",width+5)
                            .attr("y",function(d,i) {return 10+legendSpacing+i*parseInt(attrText.slice(0,-2));})
                            .attr("fill", function(d,i) {return colorList.slice(0,colorByOptions.length)[i];});
    //Add text
    legendG.append("text")
          .attr('x',(width+10+parseInt(legendBar.attr("width"))))
          .attr('y', function(d,i) {return (10+legendSpacing+i*parseInt(attrText.slice(0,-2)) + 0.5*parseInt(attrText.slice(0,-2))); })
          .style("font-size",attrText)
          .text(function(d,i) {return colorByOptions[i]});
      }
    }
}

/*function addData2(svg,data,scales,colorList,yAxis,colorBy,xAxis,lineStyle){
    if(svg.attr("graphType") == "line"){
      var width=0;
      var height=0;
      var attrText="0px";
      var titleText="0px";
      var dash = (0,0);
      if(svg.attr("class") == "smallGraph"){
        width = smallGraph.graphWidth;
        height = smallGraph.graphHeight;
        attrText = smallGraph.attrText;
        titleText = smallGraph.titleText;
      }
      else if(svg.attr("class") == "bigGraph"){
        width = bigGraph.graphWidth;
        height = bigGraph.graphHeight;
        attrText = bigGraph.attrText;
        titleText = bigGraph.titleText;
      }
      if(lineStyle == "dashed"){
          dash = (20,2);
      }
      else if(lineStyle == "dotted"){
          dash = (4,2);
      }
  
      // group the data: I want to draw one line per group
      var groupedData = data;
      var colorByOptions = groupedData.map(function(d){ return d.key }); // list of group names
      var colorScale = d3.scaleOrdinal()
        .domain(colorByOptions)
        .range(colorList.slice(0,colorByOptions.length));
      // Draw the line
      svg.selectAll(".line")
          .data(groupedData)
          .enter()
          .append("path")
            /*.on('mouseover', function(d,i){
              tooltip.style("opacity",1)
              .style("left",(d3.event.pageX)+"px")
              .style("top",(d3.event.pageY)+"px")
              html("hi")
            })
            .on("mouseout",function(){tooltip.style("opacity",0)
            .attr("fill", "none")
            .attr("stroke", function(d){ return colorScale(d.key) })
            .style("stroke-dasharray", dash)//("10,3"))
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
              return d3.line()
                .x(function(d) { return scales.x(d.key); })
                .y(function(d) { return scales.y(+d.value); })
                (d.values)
            })
      if(lineStyle == "solid"){ //Only add legend one time
      //Add legend
      var legendSpacing = 6;
      var legendG = svg.selectAll(".legend").data(colorByOptions).enter().append("g")
      //Add rect
      var legendBar =  legendG.attr("class","legend")
                              .attr("id", function(d){return (d[colorBy]+"_"+yAxis)})
                              .append("rect")
                              .attr("width", 20)
                              .attr("height", 5)
                              .attr("x",width+5)
                              .attr("y",function(d,i) {return 10+legendSpacing+i*parseInt(attrText.slice(0,-2));})
                              .attr("fill", function(d,i) {return colorList.slice(0,colorByOptions.length)[i];});
      //Add text
      legendG.append("text")
            .attr('x',(width+10+parseInt(legendBar.attr("width"))))
            .attr('y', function(d,i) {return (10+legendSpacing+i*parseInt(attrText.slice(0,-2)) + 0.5*parseInt(attrText.slice(0,-2))); })
            .style("font-size",attrText)
            .text(function(d,i) {return colorByOptions[i]}); //Little bit of extra spacing on end.
        }
      }
  }*/


//Read the data and graph
function makeLineGraph1(filter_passed="All Organs"){
  //console.log("line1Draw");

  //console.log(filter);
  //d3.select('#TransplantLine').selectAll('*').remove(); //Remove old graphs
  //Data and creation
  d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearOrganTransplantWaitlist1and3.csv").then(function(data) {
    //Var names
    var scene1 = d3.select("#organDashboard");
    var graphNames = ["TransplantLine"]
    var colorCol = "Organ";
    var xCol = "Year";
    var graph = scene1.select("#"+graphNames[0]);
    graph.attr("sceneNum","1");
    var colName = "Transplant"//graph.attr("id"); //Column name must match g id for that graph
    //Determine max and min for graph
    var minY = 0//d3.min(data, function(d) {return parseFloat(d[colName])-parseFloat(d[colName])*0.1;});
    var maxY = d3.max(data, function(d) {return parseFloat(d[colName])+parseFloat(d[colName])*0.1;});
    var maxX = 2020//d3.max(data, function(d) {return parseFloat(d[xCol])+parseFloat(d[xCol])*0.1;}); //Auto-determine max +10%
    var minX = 1995//d3.min(data, function(d) {return parseFloat(d[xCol])-parseFloat(d[xCol])*0.1;}); //Auto-determine lowest value -10%
    //console.log("inlinePie"+scene1.attr("pieChosen"));
    //Create First Line Graph
    var lineGraphScales = setupAxes(svg=graph,xmax=maxX,ymax=maxY,xmin=minX,ymin=minY); 
    addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol,line="solid",filter="All Organs"); 
    addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol,line="dashed",filter=filter_passed);//data.columns[2]);
    graph.selectAll(".xlabel").text(xCol);
    graph.selectAll(".ylabel").text(colName);
  })
}

function redrawLine1(filter)
{
  d3.select('#TransplantLine').selectAll('*').remove();
  makeLineGraph1(filter);

}
function makeLineGraph2(){
    d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearPaymentTransplantWaitlist2.csv").then(function(data){
        var scene2 = d3.select("#organDashboard");
        var graphNames = ["TransplantLine"];
        var colorCol = "Payment";
        var xCol = "Year";
        var graph = scene2.select("#"+graphNames[0]);
        graph.attr("sceneNum",2);
        var colName = ["Waitlist_Additions","Waitlist_Removals","Transplants"];//graph.attr("id"); //Column name must match g id for that graph
        var aggCol = "Payment";
        
        //Determine max and min for graph
        var minY = 0;//d3.min(data, function(d) {return parseFloat(d[colName])-parseFloat(d[colName])*0.1;});
        var maxY = 50000;//d3.max(data, function(d) {return parseFloat(d[colName])+parseFloat(d[colName])*0.1;});
        var maxX = 2020;//d3.max(data, function(d) {return parseFloat(d[xCol])+parseFloat(d[xCol])*0.1;}); //Auto-determine max +10%
        var minX = 1995;//d3.min(data, function(d) {return parseFloat(d[xCol])-parseFloat(d[xCol])*0.1;}); //Auto-determine lowest value -10%
        
        /*var groupedData = d3.nest() // nest function allows to group the calculation per level of a factor
                        .key(function(d) { return d.List;})
                        .key(function(c) {return c.Year;})
                        .rollup(function(d){return d3.sum(d,function(g){return g.Number;})})
                        .entries(data);*/
        /*var groupedDataOld = d3.nest() // nest function allows to group the calculation per level of a factor
                            .key(function(d) { return d[colorCol];})
                            .entries(data);*/
        //Create First Line Graph
        var lineGraphScales = setupAxes(svg=graph,xmax=maxX,ymax=maxY,xmin=minX,ymin=minY);  
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[0],colorBy=colorCol,xAxis=xCol,line="solid");//data.columns[2]);
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[1],colorBy=colorCol,xAxis=xCol,line="dashed");
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[2],colorBy=colorCol,xAxis=xCol,line="dotted");
        graph.selectAll(".xlabel").text(xCol);
        graph.selectAll(".ylabel").text(colName);
    })
}

function makeLineGraph3(){
    //Data and creation
    d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearOrganTransplantWaitlist1and3.csv").then(function(data) {
        //Var names
        var scene3 = d3.select("#organDashboard");
        var graphNames = ["TransplantLine"];
        var colorCol = "Organ";
        var xCol = "Year";
        var graph = scene3.select("#"+graphNames[0]);
        var colName = "Transplant"//graph.attr("id"); //Column name must match g id for that graph
        
        //Determine max and min for graph
        var minY = 0//d3.min(data, function(d) {return parseFloat(d[colName])-parseFloat(d[colName])*0.1;});
        var maxY = d3.max(data, function(d) {return parseFloat(d[colName])+parseFloat(d[colName])*0.1;});
        var maxX = 2020//d3.max(data, function(d) {return parseFloat(d[xCol])+parseFloat(d[xCol])*0.1;}); //Auto-determine max +10%
        var minX = 1995//d3.min(data, function(d) {return parseFloat(d[xCol])-parseFloat(d[xCol])*0.1;}); //Auto-determine lowest value -10%
        
        //Create First Line Graph
        var lineGraphScales = setupAxes(svg=graph,xmax=maxX,ymax=maxY,xmin=minX,ymin=minY);  
        console.log(graph.attr("id"));
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol,line="solid");//data.columns[2]);
        console.log(graph.attr("id"));
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis="DeathSickness",colorBy=colorCol,xAxis=xCol,line="dashed");
        graph.selectAll(".xlabel").text(xCol);
        graph.selectAll(".ylabel").text(colName);
    })
}
