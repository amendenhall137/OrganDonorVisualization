// set the dimensions and margins of the graph
var margin = {top: 50, right: 170, bottom: 75, left: 50},
    smallGraph = {graphWidth: (450-margin.left-margin.right), graphHeight:(300-margin.top-margin.bottom),width: 450,height:300,attrText:"12px",titleText:"20px"},
    bigGraph = {graphWidth: (750-margin.left-margin.right), graphHeight:(600-margin.top-margin.bottom),width: 750,height:600,attrText:"14px",titleText:"24px"},
    padding = 10;
var colors =['#F94040','#808080','#0000FF','#FF6000','#94641F','#AD07E3','#F0EA00','#000000','#00FF00','#FFA0A0','#C0B57B','#90BFF9','#A00000','#D4D4D4','#000080','#FFC080','#8C7E39','#A0FFA0','#FFC0E0','#ECE6CA','#008000'];
    
function chartSetup(svgContainer){

    //Graph1 = Transplant
    svgContainer.append("svg")
    .attr("width", bigGraph.width)
    .attr("height", bigGraph.height)
    .attr("x", padding)
    .attr("y", padding)
    //.attr("style", "outline: thin solid red;")
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
           .call(d3.axisLeft(y).tickFormat(function(d){return d/1000;}));
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
    
    // group the data: I want to draw one line per group
    var groupedData = d3.nest() // nest function allows to group the calculation per level of a factor
                    .key(function(d) { return d[colorBy];})
                    .entries(data);
    var colorByOptions = groupedData.map(function(d){ return d.key }); // list of group names
    
    if((svg.attr("sceneNum")=="1")){
      colorList = ['#000000', '#EE0000', '#7030A0', '#00B0F0', '#85CA3A', '#FF3FFF','#FF6000' ];
      var barColors = colorList;
      var filteredData = groupedData.filter(function(d){return d.key == filter});
      dash = (0,0);
    }
    else if((svg.attr("sceneNum")=="2")){
      //console.log(groupedData);
      //console.log(filter);
      colorList = ['#EE0000', '#85CA3A', '#00B0F0'];

      if(lineStyle == "solid"){
        dash = (0,0);
        colorList = ['#85CA3A'];}
      else if(lineStyle == "solid2"){
        dash = (0,0);
        colorList = ['#000000'];}
      else if(lineStyle == "dashed"){
        dash = (20,8);
        colorList = ['#EE0000'];}
      else if(lineStyle == "dashed2"){
        dash = (20,8);
        //console.log("dash")
        colorList = ['#000000'];}
      else if(lineStyle == "dotted"){
        dash = (4,2);
        colorList = ['#EE0000'];}
      else if(lineStyle == "dotted2"){
        dash = (4,2);
        //console.log("dotted")
        colorList = ['#000000'];} 

      var barColors = ['#FFFFFF'];
      colorByOptions = [filter];
      var filteredData = groupedData.filter(function(d){return d.key == filter});
      
      if(lineStyle == "solid"){ //Only add static legend one time
        
        ///Static legend for all Payment dash breakdown.
        var legendSpacingStatic3 = 6;
        //var staticColors2 = ['#EE0000', '#85CA3A', '#00B0F0'];
        var staticColorByOptions3 = ["Waitlist Additions","Transplants"];
        var staticColors3 = ['black','black'];//,
        var staticDashes3 = [(20,8),(0,0)];
        var legendGStatic3 = svg.selectAll(".staticLegend3").data(staticColorByOptions3).enter().append("g")
        var legendBarStatic3 =  legendGStatic3.attr("class","staticLegend3")
                              //.attr("id", function(d){return (d[colorBy]+"_"+yAxis)})
                              .append("line")
                              .attr("x1", 30+bigGraph.graphWidth+9)
                              .attr("x2", 30+bigGraph.graphWidth+9+20)
                              .attr("y1", function(d,i) {return 70+20+12+legendSpacingStatic3+i*parseInt(bigGraph.attrText.slice(0,-2));})
                              .attr("y2", function(d,i) {return 70+20+12+legendSpacingStatic3+i*parseInt(bigGraph.attrText.slice(0,-2));})
                              .style("stroke-dasharray", function(d,i){return staticDashes3[i];})//dashed array for line
                              .style("stroke", function(d,i){return staticColors3[i]});
        legendGStatic3.append("text")
              .attr('x',(30+bigGraph.graphWidth+15+parseInt(20)))
              .attr('y', function(d,i) {return (70+20+10+legendSpacingStatic3+i*parseInt(bigGraph.attrText.slice(0,-2)) + 0.5*parseInt(bigGraph.attrText.slice(0,-2))); })
              .style("font-size",bigGraph.attrText)
              .text(function(d,i) {return staticColorByOptions3[i]});
        //Static All Payments text
        legendGStatic3.append("text")
              .attr('x',(width+10+20))
              .attr('y', function(d,i) {return (10+80);})
              .attr('class','legendText3')
              .style("font-size",attrText)
              .text("All Payments")
              .attr("text-decoration","underline").attr("font-weight", 900).attr("font-size",'20px');



      //Only add this legend if specific subset picked
      if(filter != ""){
      //Third static legend for dash breakdown.
      var legendSpacingStatic2 = 6;
      //var staticColors2 = ['#EE0000', '#85CA3A', '#00B0F0'];
      var staticColorByOptions2 = ["Waitlist Additions","Transplants"];
      var staticColors2 = ['#EE0000','#85CA3A'];//,
      var staticDashes2 = [(20,8),(0,0)];
      var legendGStatic2 = svg.selectAll(".staticLegend2").data(staticColorByOptions2).enter().append("g")
      var legendBarStatic2 =  legendGStatic2.attr("class","staticLegend2")
                            //.attr("id", function(d){return (d[colorBy]+"_"+yAxis)})
                            .append("line")
                            .attr("x1", 30+bigGraph.graphWidth+9)
                            .attr("x2", 30+bigGraph.graphWidth+9+20)
                            .attr("y1", function(d,i) {return 20+12+legendSpacingStatic2+i*parseInt(bigGraph.attrText.slice(0,-2));})
                            .attr("y2", function(d,i) {return 20+12+legendSpacingStatic2+i*parseInt(bigGraph.attrText.slice(0,-2));})
                            .style("stroke-dasharray", function(d,i){return staticDashes2[i];})//dashed array for line
                            .style("stroke", function(d,i){return staticColors2[i]});
      legendGStatic2.append("text")
            .attr('x',(30+bigGraph.graphWidth+15+parseInt(20)))
            .attr('y', function(d,i) {return (20+10+legendSpacingStatic2+i*parseInt(bigGraph.attrText.slice(0,-2)) + 0.5*parseInt(bigGraph.attrText.slice(0,-2))); })
            .style("font-size",bigGraph.attrText)
            .text(function(d,i) {return staticColorByOptions2[i]});
      }


      }
    }
    else if((svg.attr("sceneNum")=="3")){
      colorList = ['#000000', '#EE0000', '#7030A0', '#00B0F0', '#85CA3A', '#FF3FFF','#FF6000' ];
      var barColors = colorList;
      var filteredData = groupedData.filter(function(d){return d.key == filter});;
      if(lineStyle == "dashed"){
        dash = (20,8);
      }

      //Secondary static legend for line style.
      var legendSpacingStatic = 6;
      var staticDashes = [(0,0), (20,6)];
      var staticColorByOptions = ["Transplants", "Deaths"];
      var legendGStatic = svg.selectAll(".staticLegend").data(staticColorByOptions).enter().append("g")
      var legendBarStatic =  legendGStatic.attr("class","lineLegend")
                            //.attr("id", function(d){return (d[colorBy]+"_"+yAxis)})
                            .append("line")//making a line for legend
                            .attr("x1", bigGraph.graphWidth+5)
                            .attr("x2", bigGraph.graphWidth+5+20)
                            .attr("y1", function(d,i) {return 140+10+legendSpacingStatic+i*parseInt(bigGraph.attrText.slice(0,-2));})
                            .attr("y2", function(d,i) {return 140+10+legendSpacingStatic+i*parseInt(bigGraph.attrText.slice(0,-2));})
                            .style("stroke-dasharray", function(d,i){return staticDashes[i];})//dashed array for line
                            .style("stroke", "black");
      legendGStatic.append("text")
            .attr('x',(bigGraph.graphWidth+10+parseInt(20)))
            .attr('y', function(d,i) {return (137+10+legendSpacingStatic+i*parseInt(bigGraph.attrText.slice(0,-2)) + 0.5*parseInt(bigGraph.attrText.slice(0,-2))); })
            .style("font-size",bigGraph.attrText)
            .text(function(d,i) {return staticColorByOptions[i]});
    }
    //console.log(colorByOptions);
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
                            .attr("fill", function(d,i) {return barColors.slice(0,colorByOptions.length)[i];});
    //Add text
    legendG.append("text")
          .attr('x',(width+10+parseInt(legendBar.attr("width"))))
          .attr('y', function(d,i) {return (10+legendSpacing+i*parseInt(attrText.slice(0,-2)) + 0.5*parseInt(attrText.slice(0,-2))); })
          .attr('class','legendText')
          .style("font-size",attrText)
          .text(function(d,i) {return colorByOptions[i]});
      }
    }
}


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
    var maxY = 70000//d3.max(data, function(d) {return parseFloat(d[colName])+parseFloat(d[colName])*0.1;});
    var maxX = 2020//d3.max(data, function(d) {return parseFloat(d[xCol])+parseFloat(d[xCol])*0.1;}); //Auto-determine max +10%
    var minX = 1995//d3.min(data, function(d) {return parseFloat(d[xCol])-parseFloat(d[xCol])*0.1;}); //Auto-determine lowest value -10%
    //console.log("inlinePie"+scene1.attr("pieChosen"));
    //Create First Line Graph
    var lineGraphScales = setupAxes(svg=graph,xmax=maxX,ymax=maxY,xmin=minX,ymin=minY); 
    addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol,line="solid",filter="All Organs"); 
    addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol,line="solid2",filter=filter_passed);//data.columns[2]);
    graph.selectAll(".xlabel").text("Year");
    graph.selectAll(".ylabel").text("Number of People (in thousands)");
    graph.selectAll(".title").text("Transplants over Time");
  })
}

function redrawLine1(filter)
{
  d3.select('#TransplantLine').selectAll('*').remove();
  makeLineGraph1(filter);

}

function redrawLine2(filter)
{
  d3.select('#TransplantLine').selectAll('*').remove();
  makeLineGraph2(filter);

}
function makeLineGraph2(filter_passed2=""){
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
        var maxY = 70000;//d3.max(data, function(d) {return parseFloat(d[colName])+parseFloat(d[colName])*0.1;});
        var maxX = 2020;//d3.max(data, function(d) {return parseFloat(d[xCol])+parseFloat(d[xCol])*0.1;}); //Auto-determine max +10%
        var minX = 1995;//d3.min(data, function(d) {return parseFloat(d[xCol])-parseFloat(d[xCol])*0.1;}); //Auto-determine lowest value -10%

        //Create First Line Graph
        var lineGraphScales = setupAxes(svg=graph,xmax=maxX,ymax=maxY,xmin=minX,ymin=minY);  
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[0],colorBy=colorCol,xAxis=xCol,line="dashed2",filter="All Payment"); //Waitlist Additions
        //addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[1],colorBy=colorCol,xAxis=xCol,line="dotted2",filter="All Payment"); //Waitlist Removals
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[2],colorBy=colorCol,xAxis=xCol,line="solid2",filter="All Payment"); //Transplants


        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[0],colorBy=colorCol,xAxis=xCol,line="dashed",filter=filter_passed2);//data.columns[2]);
        //addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[1],colorBy=colorCol,xAxis=xCol,line="dotted",filter=filter_passed2);
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName[2],colorBy=colorCol,xAxis=xCol,line="solid",filter=filter_passed2);
        graph.selectAll(".xlabel").text("Year");
        graph.selectAll(".ylabel").text("Number of People (in thousands)");
        graph.selectAll(".title").text("Waitlist Compared to Number of Transplants")
        graph.selectAll(".legendText").attr("text-decoration","underline").attr("font-weight", 900).attr("font-size",'20px');
    })
}

function redrawLine3(filter)
{
  d3.select('#TransplantLine').selectAll('*').remove();
  makeLineGraph3(filter);

}

function makeLineGraph3(filter_passed3=""){
    //Data and creation
    d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearOrganTransplantWaitlist1and3.csv").then(function(data) {
        //Var names
        var scene3 = d3.select("#organDashboard");
        var graphNames = ["TransplantLine"];
        var colorCol = "Organ";
        var xCol = "Year";
        var graph = scene3.select("#"+graphNames[0]);
        graph.attr("sceneNum","3");
        var colName = "Transplant"//graph.attr("id"); //Column name must match g id for that graph
        
        //Determine max and min for graph
        var minY = 0//d3.min(data, function(d) {return parseFloat(d[colName])-parseFloat(d[colName])*0.1;});
        var maxY = 70000//d3.max(data, function(d) {return parseFloat(d[colName])+parseFloat(d[colName])*0.1;});
        var maxX = 2020//d3.max(data, function(d) {return parseFloat(d[xCol])+parseFloat(d[xCol])*0.1;}); //Auto-determine max +10%
        var minX = 1995//d3.min(data, function(d) {return parseFloat(d[xCol])-parseFloat(d[xCol])*0.1;}); //Auto-determine lowest value -10%
        
        //Create First Line Graph
        var lineGraphScales = setupAxes(svg=graph,xmax=maxX,ymax=maxY,xmin=minX,ymin=minY);  

        //All organ dataset.
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol,line="solid2",filter="All Organs");
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis="DeathSickness",colorBy=colorCol,xAxis=xCol,line="dashed",filter="All Organs");

        //Organ Specific Dataset.
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol,line="solid",filter=filter_passed3);
        addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis="DeathSickness",colorBy=colorCol,xAxis=xCol,line="dashed",filter=filter_passed3);
        
        
        
        
        
        graph.selectAll(".xlabel").text(xCol);
        graph.selectAll(".ylabel").text("Number of People (in thousands)");
        graph.selectAll(".title").text("Transplant Waiting List Deaths");
    })
}
