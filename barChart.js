//altered from https://www.d3-graph-gallery.com/graph/barplot_grouped_basicWide.html

function makeBarChart(){
    // set the dimensions and margins of the graph
    const barMargin = {top: 10, right: 30, bottom: 40, left: 170},
        width = 600 - barMargin.left - barMargin.right,
        height = 600 - barMargin.top - barMargin.bottom;

    var bigBarGraph = {graphWidth: (600-barMargin.left-barMargin.right), graphHeight:(600-barMargin.top-barMargin.bottom),width: 600,height:600,attrText:"14px",titleText:"24px"};
    
    // append the svg object to the body of the page
    const svg = d3.select("#organDashboard")
      .append("svg")
        .attr("width", bigBarGraph.graphWidth + barMargin.left + barMargin.right)
        .attr("height", bigBarGraph.graphHeight + barMargin.top + barMargin.bottom)
        .attr("x",100+bigGraph.width)
        .attr("y", 20)
        .append("g")
        .attr("transform",`translate(${barMargin.left},${barMargin.top})`);
    
    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/amendenhall137/OrganDonorVisualization/main/YearPaymentTransplantWaitlist2.csv").then( function(data) {
    
      // List of subgroups = header of the csv files
      var subgroups = data.columns.slice(1);
      subgroups = subgroups.slice(1,subgroups.length);
      //console.log(subgroups);
    
      // List of groups = species here = value of the first column called group -> I show them on the X axis
      const groups = data.map(d => d.Payment)
    
      //console.log(groups)
    
      // Add Y axis
      const y = d3.scaleBand()
          .domain(groups)
          .range([0, height])
          .padding([0.2])
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // Add X axis
      const x = d3.scaleLinear()
        .domain([0, 35000])
        .range([0, width]);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));
    
      // Another scale for subgroup position?
      const ySubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, y.bandwidth()])
        .padding([0.05])
    
      // color palette = one color per subgroup
      const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(colors.slice(0,3));
    
      console.log(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); });  
      // Show the bars
      svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .join("g")
          .attr("transform", d => `translate(0,${y(d.Payment)})`)
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .join("rect")
          .attr("y", d => ySubgroup(d.key))
          .attr("x", d => 0)
          .attr("height", ySubgroup.bandwidth())
          .attr("width", d => x(d.value))
          .attr("fill", d => color(d.key));
    
    })
    }