//altered from https://www.d3-graph-gallery.com/graph/barplot_grouped_basicWide.html, https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad
var barColors = ['#EE0000', '#85CA3A', '#00B0F0'];
function makeBarChart(){
    // set the dimensions and margins of the graph
    const barMargin = {top: 50, right: 170, bottom: 75, left: 150};

    var bigBarGraph = {graphWidth: (900-barMargin.left-barMargin.right), graphHeight:(600-barMargin.top-barMargin.bottom),width: 900,height:600,attrText:"14px",titleText:"24px"};
    
    // append the svg object to the body of the page
    const svg = d3.select("#organDashboard")
      .append("svg")
        .attr("width", bigBarGraph.graphWidth + barMargin.left + barMargin.right)
        .attr("height", bigBarGraph.graphHeight + barMargin.top + barMargin.bottom)
        .attr("x",bigGraph.width)
        .attr("y", 0)
        .append("g")
        .attr("transform",`translate(${barMargin.left},${barMargin.top})`);
    
    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearPaymentTransplantWaitlist2.csv").then( function(data) {
    
      // List of subgroups = header of the csv files
      var subgroups = data.columns.slice(1);
      subgroups = subgroups.slice(1,subgroups.length);
      //console.log(subgroups)
    
      // List of groups = species here = value of the first column called group -> I show them on the Y axis
      const groups = data.map(d => d.Payment)
    
      //console.log(groups)
    
      // Add Y axis
      const y = d3.scaleBand()
          .domain(groups)
          .range([0, bigBarGraph.graphHeight])
          .padding([0.2])
      svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size",bigBarGraph.attrText);
    
      // Add X axis
      const x = d3.scaleLinear()
        .domain([0, 700000])
        .range([0, bigBarGraph.graphWidth]);
      svg.append("g")
        .attr("transform", `translate(0, ${bigBarGraph.graphHeight})`)
        .call(d3.axisBottom(x).tickSize(0).tickFormat(function(d){return d/1000;}))
        .style("font-size",bigBarGraph.attrText);
      svg.append("text")
        .attr("class", "xlabel")
        .attr("id",("xlabel_"+ svg.attr("id")))
        .attr("text-anchor", "middle")
        .attr("x", bigBarGraph.graphWidth/2)
        .attr("y", bigBarGraph.graphHeight + 30)
        .style("font-size", bigBarGraph.attrText)
        .text("Number of People (in thousands, 1995-2020)");
    
      // Another scale for subgroup position
      const ySubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, y.bandwidth()])
        .padding([0.05])

      // color palette = one color per subgroup
      const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(barColors.slice(0,3));

        //group data by payment and dataset
        var groupedData = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) { return d.Payment;})
            //.key(function(c) {return c.Year;})
            .rollup(function(d){
                    return {
                        Waitlist_Additions: d3.sum(d, function(e) { return e.Waitlist_Additions; }),
                        Waitlist_Removals: d3.sum(d, function(e) { return e.Waitlist_Removals; }),
                        Transplants: d3.sum(d, function(e) { return e.Transplants; })
                    };
                    })
            
            
            .entries(data);
    //console.log(groupedData);
    // Show the bars
    var bars =  svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(groupedData)//data)
        .join("g")
        .attr("Payment", function(d){return d.key;})
        .attr("transform", d => `translate(0,${y(d.key)})`)
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(c) { 
          //console.log(c + " "+ d.value[c]);
        return {key: c, value: d.value[c]}; }); })
        .join("rect")
        //.attr("id", d.value)
        .attr("y", d => ySubgroup(d.key))
        .attr("x", d => 0)
        .attr("height", ySubgroup.bandwidth())
        .attr("width", d => x(d.value))
        .attr("fill", d => color(d.key));//color(d.key))
    
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
                    //.html("<p id='payment'>Payment:<br> None</p><p id='list'>List Added to:<br> None</p><p id='value'>Number of People:<br> 0</p>");

    
    //Animation
    bars.on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.key)).darker(2));
            tooltip.style("visibility","visible");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.key));
            tooltip.style("visibility", "hidden");
        })
        .on("click",function(d){
          //console.log("payment " + d3.select(this.parentNode).attr("Payment"));
          //var dashboard = d3.select("#organDashboard").attr("barChosen",});
          //console.log("InPieChart: "+dashboard.attr("pieChosen"));
          //update line chart on click of pie chart.
          redrawLine2(d3.select(this.parentNode).attr("Payment"));
        })
        .on("mousemove", function(d){
            //console.log("x: "+d3.event.pageX+" y: "+d3.event.pageY);
            //tooltip.style("top", (d3.event.pageY)+"px").style("left",(d3.event.pageX)+"px");
            tooltip
                .html("Value:<br>" + d.value + "<br>List:<br>"+ d.key)
                .style("left", (d3.event.pageX+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (d3.event.pageY) + "px");
        })

    //Legend
    //remove underscores in values.
    for(var sgroup in subgroups){
      subgroups[sgroup] = subgroups[sgroup].replace("_", " ");
    }
    //Add rect
    var legendSpacing = 6;
    var legendG = svg.selectAll(".legend").data(subgroups).enter().append("g")
    var legendBar =  legendG.attr("class","legend")
                            //.attr("id", function(d){return (d[colorBy]+"_"+yAxis)})
                            .append("rect")
                            .attr("width", 20)
                            .attr("height", 5)
                            .attr("x",bigBarGraph.graphWidth-100)
                            .attr("y",function(d,i) {return 10+legendSpacing+i*parseInt(bigBarGraph.attrText.slice(0,-2));})
                            .attr("fill", function(d,i) {return barColors.slice(0,subgroups.length)[i];});
    //Add text
    //console.log(bigBarGraph.graphWidth+10+parseInt(legendBar.attr("width")));
    legendG.append("text")
            .attr('x',parseInt(legendBar.attr("x"))+4+parseInt(legendBar.attr("width")))
            .attr('y', function(d,i) { return (10+legendSpacing+i*parseInt(bigBarGraph.attrText.slice(0,-2)) + 0.5*parseInt(bigBarGraph.attrText.slice(0,-2))); })
            .style("font-size",bigBarGraph.attrText)
            .text(function(d,i) {return subgroups[i]});
    })
    }