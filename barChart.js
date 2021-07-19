//altered from https://www.d3-graph-gallery.com/graph/barplot_grouped_basicWide.html

function makeBarChart(){
    // set the dimensions and margins of the graph
    const barMargin = {top: 10, right: 30, bottom: 20, left: 170},
        width = 580 - barMargin.left - barMargin.right,
        height = 400 - barMargin.top - barMargin.bottom;
    
    // append the svg object to the body of the page
    const svg = d3.select("#organDashboard")
      .append("svg")
        .attr("width", width + barMargin.left + barMargin.right)
        .attr("height", height + barMargin.top + barMargin.bottom)
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
        .domain([0, 50000])
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
        .range(['#e41a1c','#377eb8','#4daf4a'])
    
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