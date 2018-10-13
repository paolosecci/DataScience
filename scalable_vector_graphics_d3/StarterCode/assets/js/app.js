//CREATE BASE CANVAS FOR SVG / SCATTER PLOT

//set svg canvas
var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 100
};

//set plot dimensions
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//use d3 to declare svg in html
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//set dimensions of plot within svg
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("../data/data.csv").then(function(stateData){

    //cast json strings to numerical
    stateData.forEach(function(data){
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.income = +data.income;
      data.age = data.age;
    });

    //scale axes
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.poverty) - .5, d3.max(stateData, d => d.poverty)])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.smokes) - 1, d3.max(stateData, d => d.smokes)])
        .range([height, 0]);

    //create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

    //plot datapoints as circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData).enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", 15).attr("fill", "pink").attr("opacity", ".5");

    //init toolTip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(d => d.abbr);
    //create toolTip in chart
    chartGroup.call(toolTip);

    //allocate space for dataZone
    var dataZone = chartGroup.selectAll("text")
        .data(stateData).enter()
        .append("text")
        .attr("transform", `translate(${width - 200}, ${height - 100})`)
        .attr("width", 400).attr("height", 100)
        .text("");

    //event listeners
    circlesGroup.on("mouseover", function(d){
        toolTip.show(d, this);
        dataZone.append('svg:tspan').attr('x', 0).attr('dy', 5)
          .text(`${d.state}`).append('svg:tspan').attr('x', 0).attr('dy', 20)
          .text(`Poverty Rate: ${d.poverty}`).append('svg:tspan').attr('x', 0).attr('dy', 20)
          .text(`Smoking Rate: ${d.smokes}`);
    }).on("mouseout", function(d){
        toolTip.hide(d);
        dataZone.html("");
    });

    //create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2 + 80))
        .attr("dy", "1em")
        .attr("class", "axisLabel")
        .text("Percent of Smoking Population");
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2 - 80}, ${height + margin.top + 30})`)
        .attr("class", "axisLabel")
        .text("Poverty Rate");
});

// function xScale(stateData, chosen_x){
//     var xLinearScale = d3.scaleLinear()
//       .domain([d3.min(stateData, d => d[chosen_x]), d3.max(stateData, d => d[chosen_x])])
//       .range([0, width]);
//
//     return xLinearScale;
// }
// function yScale(stateData, chosen_y){
//     var yLinearScale = d3.scaleLinear()
//       .domain([d3.min(stateData, d => d[chosen_y]), d3.max(stateData, d => d[chosen_y])])
//       .range([height, 0]);
//
//     return yLinearScale;
// }
// function renderXAxis(newXScale, xAxis){
//     var bottomAxis = d3.axisBottom(newXScale);
//     xAxis.transition().duration(1000).call(bottomAxis);
//
//     return xAxis;
// }
// function renderYAxis(newYScale, yAxis){
//     var leftAxis = d3.axisLeft(newYScale);
//     yAxis.transition().duration(1000).call(leftAxis);
//
//     return yAxis;
// }
// function renderCirclesX(circlesGroup, newXScale, chosen_x){
//     circlesGroup.transition().duration(1000)
//       .attr("cx", d => newXScale(d[chosen_x]))
//       .attr("cy", d => newYScale(d[chosen_y]));
//
//     return circlesGroup;
// }
// function renderCirclesY(circlesGroup, newYScale, chosen_y){
//     circlesGroup.transition().duration(1000)
//       .attr("cx", d => newXScale(d[chosen_x]))
//       .attr("cy", d => newYScale(d[chosen_y]));
//
//     return circlesGroup;
// }
// function updateToolTip(chosen_x, chosen_y, circlesGroup){
//     //find x
//     if(chosen_x == "poverty"){var labelx = "Poverty Rate";}
//     else if(chosen_x == "age"){var labelx = "Average Age";}
//     else if(chosen_x == "income"){var labelx = "Average Income per Capita";}
//     else if(chosen_x == "healthcare"){var labelx = "healthcare Coverage Percent";}
//     else if(chosen_x == "obesity"){var labelx = "Obesity Rate";}
//     else if(chosen_x == "smokes"){var labelx = "Percent of Population that Smoke";}
//
//     //find y
//     if(chosen_y == "poverty"){var labely = "Poverty Rate";}
//     else if(chosen_y == "age"){var labely = "Average Age";}
//     else if(chosen_y == "income"){var labely = "Average Income per Capita";}
//     else if(chosen_y == "healthcare"){var labely = "healthcare Coverage Percent";}
//     else if(chosen_y == "obesity"){var labely = "Obesity Rate";}
//     else if(chosen_y == "smokes"){var labely = "Percent of Population that Smoke";}
//
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d){
//           return `${d.abbr}<br>${labelx}: ${d[chosen_x]}<br>${labely}: ${d[chosen_y]}`;
//       });
//
//     circlesGroup.call(toolTip);
//
//     circlesGroup.on("click", function(d){
//         toolTip.show(d, this);
//     }).on("mouseout", function(d, i){
//         toolTip.hide(d);
//     });
//
//     return circlesGroup;
// }
//
// //read csv data
// d3.csv("../data/data.csv").then(function(stateData){
//
//     console.log(stateData);
//
//     //cast json values to ints
//     stateData.forEach(function(data){
//       stateData.poverty = +stateData.poverty;
//       stateData.smokes = +stateData.smokes;
//       stateData.healthcare = +stateData.healthcare;
//       stateData.obesity = +stateData.obesity;
//       stateData.income = +stateData.income;
//       stateData.age = stateData.age;
//     });
//
//     //scale data to svg size
//     var xLinearScale = xScale(stateData, chosen_x);
//     var yLinearScale = yScale(stateData, chosen_y);
//
//     //create axes
//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);
//
//     //append axes
//     var xAxis = chartGroup.append("g")
//       .classed("x-axis", true)
//       .attr("transform", `translate(0, ${height})`)
//       .call(bottomAxis);
//     var yAxis = chartGroup.append("g")
//       .call(leftAxis);
//
//     //plot data points as circles
//     var circlesGroup = chartGroup.selectAll("circle")
//       .data(stateData)
//       .enter().append("circle")
//       .attr("cx", d => xScale(d[chosen_x]))
//       .attr("cy", d => yScale(d[chosen_y]))
//       .attr("r", 20)
//       .attr("fill", "pink").attr("opacity", ".5");
//
//     var labelsGroupX = chartGroup.append("g")
//       .attr("transform", `translate(${width/2}, ${height+20})`);
//     var labelsGroupY = chartGroup.append("g")
//       .attr("transform", `translate(${(width/2)+10}, ${height+20})`);
//
//     //create x labels for each option
//     var povertyLabelX = labelsGroupX.append("text")
//       .attr("x", 0).attr("y", 20)
//       .attr("value", "poverty")
//       .classed("active", true)
//       .text("Poverty");
//     var smokesLabelX = labelsGroupX.append("text")
//       .attr("x", 0).attr("y", 40)
//       .attr("value", "smokes")
//       .classed("active", true)
//       .text("Smokes");
//     var healthcareLabelX = labelsGroupX.append("text")
//       .attr("x", 0).attr("y", 60)
//       .attr("value", "healthcare")
//       .classed("inactive", true)
//       .text("Healthcare");
//     var obesityLabelX = labelsGroupX.append("text")
//       .attr("x", 0).attr("y", 80)
//       .attr("value", "obesity")
//       .classed("inactive", true)
//       .text("Obesity");;
//     var incomeLabelX = labelsGroupX.append("text")
//       .attr("x", 0).attr("y", 100)
//       .attr("value", "income")
//       .classed("inactive", true)
//       .text("Income");
//     var ageLabelX = labelsGroupX.append("text")
//       .attr("x", 0).attr("y", 120)
//       .attr("value", "age")
//       .classed("inactive", true)
//       .text("Age");
//
//     //create y labels for each option
//     var povertyLabelY = labelsGroupY.append("text")
//       .attr("x", 40).attr("y", 20)
//       .attr("value", "poverty")
//       .classed("active", true)
//       .text("Poverty");
//     var smokesLabelY = labelsGroupY.append("text")
//       .attr("x", 40).attr("y", 40)
//       .attr("value", "smokes")
//       .classed("active", true)
//       .text("Smokes");
//     var healthcareLabelY = labelsGroupY.append("text")
//       .attr("x", 40).attr("y", 60)
//       .attr("value", "healthcare")
//       .classed("inactive", true)
//       .text("Healthcare");
//     var obesityLabelY = labelsGroupY.append("text")
//       .attr("x", 40).attr("y", 80)
//       .attr("value", "obesity")
//       .classed("inactive", true)
//       .text("Obesity");;
//     var incomeLabelY = labelsGroupY.append("text")
//       .attr("x", 40).attr("y", 100)
//       .attr("value", "income")
//       .classed("inactive", true)
//       .text("Income");
//     var ageLabelY = labelsGroupY.append("text")
//       .attr("x", 40).attr("y", 120)
//       .attr("value", "age")
//       .classed("inactive", true)
//       .text("Age");
//
//     //append y labels
//     chartGroup.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x", 0 - (height/2))
//       .attr("dy", "1em")
//       .classed("axis-text", true)
//       .text("STATEDATA777");
//
//     //build circlesGroup
//     var circlesGroup = updateToolTip(chosen_x, chosen_y, circlesGroup);
//
//     //event listeners
//     labelsGroupX.selectAll("text").on("click", function(){
//         var value = d3.select(this).attr("value");
//         if(value != chosen_x){
//             chosen_x = value;
//
//             //set and scale new x axis
//             xLinearScale = xScale(stateData, chosen_x);
//             xAxis = renderXAxis(xLinearScale, xAxis);
//
//             //render data points
//             circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosen_x);
//
//             //update toolTip
//             circlesGroup = updateToolTip(chosen_x, circlesGroup);
//
//             if(chosen_x == "poverty"){
//                 povertyLabelX.classed("active", true).classed("inactive", false);
//                 smokesLabelX.classed("inactive", true).classed("active", false);
//                 healthcareLabelX.classed("inactive", true).classed("active", false);
//                 obesityLabelX.classed("inactive", true).classed("active", false);
//                 incomeLabelX.classed("inactive", true).classed("active", false);
//                 ageLabelX.classed("inactive", true).classed("active", false);
//
//             }
//             else if(chosen_x == "age"){
//                 povertyLabelX.classed("inactive", true).classed("active", false);
//                 smokesLabelX.classed("inactive", true).classed("active", false);
//                 healthcareLabelX.classed("inactive", true).classed("active", false);
//                 obesityLabelX.classed("inactive", true).classed("active", false);
//                 incomeLabelX.classed("inactive", true).classed("active", false);
//                 ageLabelX.classed("active", true).classed("inactive", false);
//             }
//             else if(chosen_x == "income"){
//                 povertyLabelX.classed("inactive", true).classed("active", false);
//                 smokesLabelX.classed("inactive", true).classed("active", false);
//                 healthcareLabelX.classed("inactive", true).classed("active", false);
//                 obesityLabelX.classed("inactive", true).classed("active", false);
//                 incomeLabelX.classed("active", true).classed("inactive", false);
//                 ageLabelX.classed("inactive", true).classed("active", false);
//             }
//             else if(chosen_x == "healthcare"){
//                 povertyLabelX.classed("inactive", true).classed("active", false);
//                 smokesLabelX.classed("inactive", true).classed("active", false);
//                 healthcareLabelX.classed("active", true).classed("inactive", false);
//                 obesityLabelX.classed("inactive", true).classed("active", false);
//                 incomeLabelX.classed("inactive", true).classed("active", false);
//                 ageLabelX.classed("inactive", true).classed("active", false);
//             }
//             else if(chosen_x == "obesity"){
//                 povertyLabelX.classed("inactive", true).classed("active", false);
//                 smokesLabelX.classed("inactive", true).classed("active", false);
//                 healthcareLabelX.classed("inactive", true).classed("active", false);
//                 obesityLabelX.classed("active", true).classed("inactive", false);
//                 incomeLabelX.classed("inactive", true).classed("active", false);
//                 ageLabelX.classed("inactive", true).classed("active", false);
//             }
//             else if(chosen_x == "smokes"){
//                 povertyLabelX.classed("inactive", true).classed("active", false);
//                 smokesLabelX.classed("active", true).classed("inactive", false);
//                 healthcareLabelX.classed("inactive", true).classed("active", false);
//                 obesityLabelX.classed("inactive", true).classed("active", false);
//                 incomeLabelX.classed("inactive", true).classed("active", false);
//                 ageLabelX.classed("inactive", true).classed("active", false);
//             }
//         }
//     })
//     labelsGroupY.selectAll("text").on("click", function(){
//         var value = d3.select(this).attr("value");
//         if(value != chosen_y){
//             chosen_y = value;
//             yLinearScale = yScale(stateData, chosen_y);
//             yAxis = renderYAxis(yLinearScale, yAxis);
//         }
//
//         if(value != chosen_y){
//             chosen_y = value;
//
//             //set and scale new x axis
//             yLinearScale = yScale(stateData, chosen_y);
//             yAxis = renderYAxis(xLinearScale, yAxis);
//
//             //render data points
//             circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosen_y);
//
//             //update toolTip
//             circlesGroup = updateToolTip(chosen_y, circlesGroup);
//
//             if(chosen_y == "poverty"){
//                 povertyLabel.classed("active", true).classed("inactive", false);
//                 smokesLabel.classed("inactive", true).classed("active", false);
//                 healthcareLabel.classed("inactive", true).classed("active", false);
//                 obesityLabel.classed("inactive", true).classed("active", false);
//                 incomeLabel.classed("inactive", true).classed("active", false);
//                 ageLabel.classed("inactive", true).classed("active", false);
//
//             }
//             else if(chosen_y == "age"){
//                 povertyLabel.classed("inactive", true).classed("active", false);
//                 smokesLabel.classed("inactive", true).classed("active", false);
//                 healthcareLabel.classed("inactive", true).classed("active", false);
//                 obesityLabel.classed("inactive", true).classed("active", false);
//                 incomeLabel.classed("inactive", true).classed("active", false);
//                 ageLabel.classed("active", true).classed("inactive", false);
//             }
//             else if(chosen_y == "income"){
//                 povertyLabel.classed("inactive", true).classed("active", false);
//                 smokesLabel.classed("inactive", true).classed("active", false);
//                 healthcareLabel.classed("inactive", true).classed("active", false);
//                 obesityLabel.classed("inactive", true).classed("active", false);
//                 incomeLabel.classed("active", true).classed("inactive", false);
//                 ageLabel.classed("inactive", true).classed("active", false);
//             }
//             else if(chosen_y == "healthcare"){
//                 povertyLabel.classed("inactive", true).classed("active", false);
//                 smokesLabel.classed("inactive", true).classed("active", false);
//                 healthcareLabel.classed("active", true).classed("inactive", false);
//                 obesityLabel.classed("inactive", true).classed("active", false);
//                 incomeLabel.classed("inactive", true).classed("active", false);
//                 ageLabel.classed("inactive", true).classed("active", false);
//             }
//             else if(chosen_y == "obesity"){
//                 povertyLabel.classed("inactive", true).classed("active", false);
//                 smokesLabel.classed("inactive", true).classed("active", false);
//                 healthcareLabel.classed("inactive", true).classed("active", false);
//                 obesityLabel.classed("active", true).classed("inactive", false);
//                 incomeLabel.classed("inactive", true).classed("active", false);
//                 ageLabel.classed("inactive", true).classed("active", false);
//             }
//             else if(chosen_y == "smokes"){
//                 povertyLabel.classed("inactive", true).classed("active", false);
//                 smokesLabel.classed("active", true).classed("inactive", false);
//                 healthcareLabel.classed("inactive", true).classed("active", false);
//                 obesityLabel.classed("inactive", true).classed("active", false);
//                 incomeLabel.classed("inactive", true).classed("active", false);
//                 ageLabel.classed("inactive", true).classed("active", false);
//             }
//         }
//     })


    // //add axes to chartGroup
    // chartGroup.append("g")
    //   .attr("transform", `translate(0, ${height})`) //because x axis is at y value of svg's height, bottom of screen
    //   .call(bottomAxis);
    // chartGroup.append("g")
    //   .call(leftAxis);
    //
    // //plot data points as circles
    // var circlesGroup = chartGroup.selectAll("circle")
    //   .data(stateData)
    //   .enter().append("circle")
    //   .attr("cx", d => xScale(d.poverty))
    //   .attr("cy", d => yScale(d.smokes))
    //   .attr("r", 5).attr("fill", "red")
    //   .attr("text", d => d.abbr);
    //
    // console.log(circlesGroup);
    //
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(d => d.abbr);
    //
    // chartGroup.call(toolTip);
    //
    // circlesGroup.on("click", function(d){
    //     toolTip.show(d, this);
    // }).on("mouseout", function(d, i){
    //     toolTip.hide(d);
    // });
    // });
