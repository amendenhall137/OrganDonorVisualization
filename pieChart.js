// set the dimensions and margins of the graph
var margin = {top: 50, right: 170, bottom: 75, left: 75},
    smallGraph = {graphWidth: (450-margin.left-margin.right), graphHeight:(300-margin.top-margin.bottom),width: 450,height:300,attrText:"12px",titleText:"20px"},
    bigGraph = {graphWidth: (750-margin.left-margin.right), graphHeight:(600-margin.top-margin.bottom),width: 750,height:600,attrText:"14px",titleText:"24px"},
    padding = 10;

    
function chartSetup2(svgContainer){
    /*//Graph1 = Transplant
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
        .attr("id", "TransplantLine");*/

    //Graph2 = TransplantByOrganPie
    svgContainer.append("svg")
    .attr("width", bigGraph.width)
    .attr("height", bigGraph.height)
    .attr("x", padding+bigGraph.width)
    .attr("y", padding)
    .attr("style", "outline: thin solid green;")
    .append("g")
        .attr("transform",
            "translate(" + bigGraph.width/2 + "," + bigGraph.height/2 + ")")
        .attr("class","bigGraph")
        .attr("graphType","pie")
        .attr("id", "TransplantPie");

  
  return ["TransplantLine,TransplantPie"];//,"NH3_mmolperL","LDH_UperL", "GLN_mM", "LAC_GperL","GLC_GperL"];
}

/*function setupAxes(svg, xmax=0, ymax=0, xmin=0, ymin=0){
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

function addData(svg,data,scales,colorList,yAxis,colorBy,xAxis){
  if(svg.attr("graphType") == "line"){
    var width=0;
    var height=0;
    var attrText="0px";
    var titleText="0px";
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
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return scales.x(d[xAxis]); })
              .y(function(d) { return scales.y(+d[yAxis]); })
              (d.values)
          })

    //Add legend
    var legendSpacing = 6;
    var legendG = svg.selectAll(".legend").data(colorByOptions).enter().append("g")
    //Add rect
    var legendBar =  legendG.attr("class","legend")
                            .attr("id", function(d){return (d[colorBy]+"_"+d[yAxis])})
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
          .text(function(d,i) {return colorByOptions[i]+"    ."}); //Little bit of extra spacing on end.
  }
  else if(svg.attr("graphType") == "pie"){

  }
}*/


//Read the data and graph
function makeGraphs2(){
  //d3.select('svg').selectAll('*').remove(); //Remove old graphs
  var colors =['#F94040','#808080','#0000FF','#FF6000','#94641F','#AD07E3','#F0EA00','#000000','#00FF00','#FFA0A0','#C0B57B','#90BFF9','#A00000','#D4D4D4','#000080','#FFC080','#8C7E39','#A0FFA0','#FFC0E0','#ECE6CA','#008000'];
 
  //Data and creation
  d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearOrganTransplantWaitlist1and3.csv").then(function(data) {
    //Var names
    var scene1 = d3.select("#organDashboard");
    
    var graphNames = chartSetup2(scene1);
    /*
    var colorCol = "Organ";
    var xCol = "Year";
    var graph = scene1.select("#"+graphNames[0]);
    var colName = "Transplant"//graph.attr("id"); //Column name must match g id for that graph
    
    //Determine max and min for graph
    var minY = 0//d3.min(data, function(d) {return parseFloat(d[colName])-parseFloat(d[colName])*0.1;});
    var maxY = d3.max(data, function(d) {return parseFloat(d[colName])+parseFloat(d[colName])*0.1;});
    var maxX = 2020//d3.max(data, function(d) {return parseFloat(d[xCol])+parseFloat(d[xCol])*0.1;}); //Auto-determine max +10%
    var minX = 1995//d3.min(data, function(d) {return parseFloat(d[xCol])-parseFloat(d[xCol])*0.1;}); //Auto-determine lowest value -10%
    
    //Create First Line Graph
    var lineGraphScales = setupAxes(svg=graph,xmax=maxX,ymax=maxY,xmin=minX,ymin=minY);  
    addData(svg=graph,data=data,scales=lineGraphScales,colorList=colors,yAxis=colName,colorBy=colorCol,xAxis=xCol);//data.columns[2]);
    graph.selectAll(".xlabel").text(xCol);
    graph.selectAll(".ylabel").text(colName);
    */

    //Pie Chart
    var g = d3.select("#TransplantPie");
    var radius = Math.min(bigGraph.width, bigGraph.height) / 2 -(margin.left+margin.right)/2;
    var pieGroupBy = "Organ";
    var pieSumBy = "Year";
    var vals = "Transplant";
    var outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);//used for labels
    var pieData = d3.nest().key(function(d){
                                return d.Organ;})
                    .rollup(function(data){
                            return d3.sum(data, function(d){
                                                return d.Transplant;
                      })
                  }).entries(data);
    //make a list of subgroups
    var subgroups = []
    for(i in pieData){
      //console.log(pieData[i].key);
      subgroups.push(pieData[i].key);
    }
    const color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(colors.slice(0,subgroups.length));
    allOrgans = pieData.shift();//Remove "allOrgans" so it is just individual breakdown.

    //Add on the doughnut sections
    var totalTransplants= 0;
    var addedTransplants = false;
    var pie = d3.pie().value(function(d){
      if(!addedTransplants){
      totalTransplants += d.value; 
      }
      return d.value;});

    var arc = g.selectAll("arc").data(pie(pieData)).enter();
    var path = d3.arc().outerRadius(radius*0.8).innerRadius(radius*0.5)
    var sections = arc.append("path").attr("d",path).attr("fill",function(d,i){return color(d.data.key);})
    addedTransplants = true; //for some reason after this step the pie function would be called 3 times, this makes it only update numTransplants for one of these.
    //Animation and Tooltips
    //Tooltip text
    var tooltip = d3.select("#organDiv")
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("width","150px")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "10px");
    sections.on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.data.key)).darker(2));
          tooltip.style("visibility","visible");
          })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.data.key));
          tooltip.style("visibility", "hidden");
          })
        .on("click",function(d){
          var dashboard = d3.select("#organDashboard").attr("pieChosen",d.data.key);
          console.log("InPieChart: "+dashboard.attr("pieChosen"));
          //update line chart on click of pie chart.
          redrawLine1();

        })
        .on("mousemove", function(d){
          tooltip
              .html("Value:<br>" + Math.round(d.value/totalTransplants*100*10)/10 + "%<br>Organ:<br>"+ d.data.key)
              .style("left", (d3.event.pageX+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
              .style("top", (d3.event.pageY) + "px");
          })
    
    //Lines for labels (adapted from d3-graph-gallery.com)
    g.selectAll("allPolylines").data(pie(pieData)).enter().append("polyline")
      .attr('stroke',"black")
      .style('fill','none')
      .attr("stroke-width",1)
      .attr("points",function(d){
          var posA = path.centroid(d); //line in slice
          var posB = outerArc.centroid(d); //line stop at fake outer arc made for that
          var posC = outerArc.centroid(d);//label position
          var midangle = d.startAngle + (d.endAngle-d.startAngle)/2; //Angle to show label right/left
          posC[0] = radius*0.95*(midangle<Math.PI ?1:-1); //mulitply to put on right or left
          if(d.data.key == "Intestine"){posC[0]=radius*0.95*1;}
          if(d.data.key == "Pancreas"){posB[1]=posB[1]-8; posC[1]=posC[1]-8;}
          return [posA, posB, posC];
      });

    //Add labels to lines
    g.selectAll('allLabels').data(pie(pieData)).enter().append('text')
    .text( function(d) { return d.data.key } )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle <(Math.PI) ? 1 : -1);
        pos[1] =pos[1]+6;
        if(d.data.key == "Intestine"){pos[0]=radius*0.99*1+50;}
        if(d.data.key =="Pancreas"){pos[1]=pos[1]-10;}
        //console.log(d)
        //console.log(d.data.key)
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < (Math.PI) ? 'start' : 'end')
    })
  
  })
}

//makeGraphs()
