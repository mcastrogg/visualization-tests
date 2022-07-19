import * as u from "./utils.js"

const test_line_chart_data = [
    [4.5, 4.8, 4.6, 5.3, 4.4, 5.1, 4.7, 5.0, 5.12, 5.45],
    [4.0, 4.25, 4.13, 4.51, 3.9, 4.3, 4.08, 4.48, 4.37, 4.68]
];

let raw_line_chart_data = [
    { gpm: 605, text: "gpm", teamId: 1 },
    { gpm: 767, text: "gpm", teamId: 1 },
    { gpm: 1034, text: "gpm", teamId: 1 },
    { gpm: 1421, text: "gpm", teamId: 1 },
    { gpm: 669, text: "gpm", teamId: 1 },
    { gpm: 972, text: "gpm", teamId: 1 },
    { gpm: 859, text: "gpm", teamId: 1 },
    { gpm: 754, text: "gpm", teamId: 1 },
    { gpm: 1231, text: "gpm", teamId: 1 },
    { gpm: 1554, text: "gpm", teamId: 1 },
    { gpm: 1898, text: "gpm", teamId: 2 },
    { gpm: 1500, text: "gpm", teamId: 2 },
    { gpm: 1300, text: "gpm", teamId: 2 },
    { gpm: 1100, text: "gpm", teamId: 2 },
    { gpm: 972, text: "gpm", teamId: 2 },
    { gpm: 937, text: "gpm", teamId: 2 },
    { gpm: 1154, text: "gpm", teamId: 2 },
    { gpm: 1301, text: "gpm", teamId: 2 },
    { gpm: 1399, text: "gpm", teamId: 2 },
    { gpm: 1500, text: "gpm", teamId: 2 },
]
const MARKER_LEN = 10;
raw_line_chart_data = u.mapRawData(raw_line_chart_data, 'gpm');

function create_plateau(raw_data) {
    var newData = [];
    for (let i = 0; i < raw_data.length; i++) {
        newData.push(raw_data[i]);
        newData.push(raw_data[i]);
        newData.push(raw_data[i]);
    }
    return newData;
}

// raw_line_chart_data = create_plateau(raw_line_chart_data);

let line_chart_data = Object.values(raw_line_chart_data.reduce(function(obj, value) {
    var key = value.teamId;
    if (obj[key] == null) obj[key] = [];

    obj[key].push(value);
    return obj;
}, {}));


// console.log(Object.values(line_chart_data));


line_chart(line_chart_data);


//////////////////////////////////////////////////////////////////////////////

function line_chart(data) {
    var margin = { top: 100, right: 40, bottom: 40, left: 40 };
    var width = 800;
    var height = 600;
    var chart_width = width - margin.left - margin.right;
    var chart_height = height - margin.top - margin.bottom;

    var svg = d3.select("#line_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    let xMax = 100;
    let xMin = 2;
    // var x = d3.scaleLinear()
    //     .domain([0, xMax])
    //     .range([0, chart_width]);
    data = u.addXValues(data, xMax, data[0].length);

    var x = d3.scaleLinear()
        .domain([-xMin, xMax])
        .range([0, chart_width]);
    
    // Draws x axis on the bottom
    // svg.append("g")
    //     .attr("transform", `translate(0, ${chart_height})`)
    //     .call(d3.axisBottom(x));

    let flat = data.flat().map(e => e.y);
    let min = Math.min(...flat);
    let max = Math.max(...flat);

    let trueMin = 400;
    console.log(trueMin, max);
    var y = d3.scaleLinear()
        // Domain is for y is minY and maxY
        .domain([0, max])
        .range([chart_height, 0]);

    // var y = d3.scaleLinear()
    //     // Domain is for y is minY and maxY
    //     .domain([3.5, 5.5])
    //     .range([chart_height, 0]);

    // Draws y axis on the left
    // svg.append("g")
    //     .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
        .domain([0, 1])
        .range(d3.schemeSet2);

    // color.domain(data.map(function (d) { return d.teamId; }));

    // draws the lines
    console.log(data);
    var xValue = function(d){return d.x;}
    var yValue = function(d){return d.y;}
    
    var lineFunction = d3.line()
      .x(function(d) { return xValue(d); })
      .y(function(d) { return yValue(d); });
    //   .interpolate("linear");
    
    var line = d3.line()
            .x(function(d){ return x(d.x)})
            .y(function(d){return y(d.y)})

    // var path = svg.append("path")
    //           .attr({
    //             "d":line(data),
    //             "fill":"blue",
    //             "stroke":"black"
    //           })
    
    let yData = data.map(e => e.map(x => x.y));

    let previousPoint = 0;
    function test(point, index){
        return point.x;
    }

    function testy(point){
        return point.y;
    }

    function drawRect(point){
        if (point.type == "mid"){
            return point.x;
        }
    }

    let pData = u.createPlateau(data, xMin);
    console.log('pData', pData);
    svg.selectAll(".line")
        .data(pData)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 5)
        .attr("d", d => d3.line()
            // This is an interpolater and fills in the points between the points
            // we passed to the graph
            // with out it the line is jagged, with it the line is curved
            // .curve(d3.curveLinear)
            .x((point, index) => x(test(point, index)))
            .y((point) => y(testy(point)))
            (d));

    let ttDiv = d3.select("#line_chart").append("div")
        .attr("class", "toolTip")
        .style("opacity", 10);

    let markers = pData.map(x => x.filter(y => {return y.type == "mid"}));
    console.log(markers);
    svg.selectAll(".rects")
        .data(markers)
        .join("g")
        .attr("fill", color)
        .selectAll(".rect_points")
        .data(set => set)
        .join("svg:rect")
        .attr("rx", (d, i) => 3)
        .attr("ry", (d, i) => 1)
        .attr("x", (d, i) => x(test(d) -1.3))
        .attr("y", (d) => y(testy(d) + 20))
        .attr("width", (x) => 20)
        .attr("height", (x) => 10)
        .on("mouseover", function(e, d) {
            ttDiv.transition()
                .duration(200)
                .style("opacity", .9);
            ttDiv.html("GPM: " + d.y)
                // .style("left", (d.x) + "px")
                .style("left", (e.x) + "px")
                // .style("top", (d.y - 28) + "px");
                .style("top", (200) + "px");
        })
        .on("mouseout", function(d) {
            ttDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });;

    // .attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; });
    // .style("fill", d3.scale.category20c());


    // .attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; });
    //     // .attr("r", 5)
    //     .attr("stroke", "white");

    // svg.selectAll(".dots")
    //     .data(data)
    //     .join("g")
    //     .attr("fill", (d, i) => color(i))
    //     .selectAll(".points")
    //     .data(set => set)
    // .join("svg:rect")
    // .attr("rx", (d, i) => x(i))
    // .attr("ry", (d) => y(d))
    // .attr("x", (d, i) => x(i))
    // .attr("y", (d, i) => y(d))
    // .attr("width", 1)
    // .attr("height", 1)
    // .attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; })
    // .attr("stroke", "white");

    // .style("fill", d3.scale.category20c());

    // svg.append("svg:rect")
    //     .attr("rx", 6)
    //     .attr("ry", 6)
    //     .attr("x", -12.5)
    //     .attr("y", -12.5)
    //     .attr("width", 25)
    //     .attr("height", 25)
    //     // .attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; })
    //     .style("fill", d3.scale.category20c());
}