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
    let legendWidth = 60;
    var margin = { top: 100, right: 40, bottom: 40, left: 40 };
    var width = 800;
    var height = 600;
    var chart_width = width - margin.left - margin.right;
    var chart_height = height - margin.top - margin.bottom;

    var svg = d3.select("#line_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let xMax = 100;
    let xMin = 2;

    u.addXValues(data, xMax, data[0].length);
    let colorMap = u.createColorMap(u.getUniqueTeamIds(data));
    u.addColors(data, colorMap);

    var x = d3.scaleLinear()
        .domain([-xMin, xMax])
        .range([legendWidth, chart_width]);
    
    // Add Background Image
    svg.append("bg")
        .append("pattern")
        .attr("id", "bg")
        .attr('width', "100%")
        .attr('height', "100%")
        .attr('x', -xMin)
        .attr('y', -10)
        .append("image")
        .attr('xlink:href', 'http://tali.gg-staging.s3-website.us-east-2.amazonaws.com/bg%202.png')
        .attr('width', "100%")
        .attr('height', "100%")
        .attr('x', -xMin)
        .attr('y', -2);
    
    // Draw Rect with BG Image
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "url(#bg)");
    
    // Add Team Icons
    const yPadding = 10;
    const teamIconWidth = 30;
    const teamIconHeight = 30;

    const teamIconHoverWidth = 113;
    const teamIconHoverHeight = 20;

    let teamIconOrangeRect = svg.append('rect')
        .attr('class', 'teamIconHover')
        .attr('width', teamIconHoverWidth)
        .attr('height', teamIconHoverHeight)
        .attr('x', chart_width - teamIconHoverWidth + (teamIconWidth/2))
        .attr('y', yPadding + (teamIconHoverHeight/4))
        .attr('fill', 'rgba(255, 137, 28, 1)')
        .style('opacity', 0)

    let teamIconPurpleRect = svg.append('rect')
        .attr('class', 'teamIconHover')
        .attr('width', teamIconHoverWidth)
        .attr('height', teamIconHoverHeight)
        .attr('x', chart_width - teamIconHoverWidth + (teamIconWidth/2))
        .attr('y', + teamIconHeight + (yPadding/2) + (teamIconHoverHeight))
        .attr('fill', 'rgba(147, 50, 255, 1)')
        .attr('opacity', 0);

    svg.append("image")
        .attr("id", "orangeTeamIcon")
        .attr('xlink:href', 'http://tali.gg-staging.s3-website.us-east-2.amazonaws.com/OrangeTeamIcon.svg')
        .attr('x', chart_width)
        .attr('y', yPadding)
        .attr('width', teamIconWidth)
        .attr('height', teamIconHeight)
        .on("mouseover", function(e, d) {
            teamIconOrangeRect.style('opacity', 100)
        })
        .on("mouseout", function(e, d) {
            teamIconOrangeRect.style('opacity', 0)
        });
    
    svg.append("image")
        .attr("id", "orangeTeamIcon")
        .attr('xlink:href', 'http://tali.gg-staging.s3-website.us-east-2.amazonaws.com/PurpleTeamIcon.svg')
        .attr('x', chart_width)
        .attr('y', teamIconHeight + (yPadding * 2))
        .attr('width', teamIconWidth)
        .attr('height', teamIconHeight)
        .on("mouseover", function(e, d) {
            teamIconPurpleRect.attr('opacity', 100)
        })
        .on("mouseout", function(e, d) {
            teamIconPurpleRect.attr('opacity', 0)
        });
    
    
    function drawOutlineOfEntireSVG(){
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr('fill', 'white')
            .attr('opacity', '.7')
            .attr('stroke', 'red');
    }
    // drawOutlineOfEntireSVG();

    function drawHorizontalLine(yPoint){
        svg.append("line")
        .attr('class', 'horizontalLine')
        .attr('stroke', 'white')
        .attr('x1', x(xMin))
        .attr('y1', y(yPoint))
        .attr('x2', x(xMax))
        .attr('y2', y(yPoint));
    }

    function writeHoriontalLineText(xPoint, yPoint){
        // Each num is 5px wid
        let sLen = String(yPoint).length; 
        console.log(sLen);
        if (sLen > 3){
            xPoint = xPoint - 5/2;
        }
        svg.append('text')
            .attr("x", xPoint)
            .attr("y", y(yPoint) - 2)
            .attr('fill', 'white')
            .attr('font-family', 'Lexend Deca')
            // .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .text(yPoint);
    }

    let testMax = 2000;
    let testMin = 0;

    var y = d3.scaleLinear()
        // Domain is for y is minY and maxY
        .domain([testMin, testMax])
        .range([chart_height, margin.top]);
    
    



    function drawAxises(x, y){
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(d3.axisBottom(x));
    }

    let padding = (legendWidth/2)/2

    // Draw YAxis Legend Rect
    svg.append("rect")
        .attr("width", legendWidth)
        .attr("height", chart_height - (margin.bottom + margin.top))
        .attr("x", padding)
        .attr("y", margin.top + padding)
        .attr('fill', 'rgba(54, 49, 60, 0.8)');
    
    let horizontalLines = [0, 400, 800, 1200, 1600, 2000];
    for(let i = 0; i < horizontalLines.length; i++){
        drawHorizontalLine(horizontalLines[i]);
    }

    for(let i = 1; i < horizontalLines.length - 1; i++){
        writeHoriontalLineText(legendWidth*.5, horizontalLines[i]);
    }

    // drawAxises(x, y);


    let pData = u.createPlateau(data, xMin);
    console.log('pData', pData);

    // Create Line Graph
    svg.selectAll(".line")
        .data(pData)
        .join("path")
        .attr("fill", 'none')
        // .attr("background", (d) => u.getAreaFill(d))
        .attr("stroke", (d) => u.getLineColor(d))
        .attr("stroke-width", 5)
        .attr("d", (d) => d3.line()
            .x((point, index) => x(u.xPoint(point)))
            .y((point) => y(u.yPoint(point)))
            (d))
        .attr('class', (d) => "line" + d[0].teamId);


    // Defs tells D3 this is not an element
    var defs = svg.append('defs');

    // Create necessary linear gradients
    function createLinearGradients(){
        defs.append("linearGradient")
            .attr("id", "orange-area-gradient")
            .attr("x1", '0%')
            .attr("y1", '0%')
            .attr("x2", '0%')
            .attr("y2", '100%')
            .selectAll("stop")
            .data([
                {offset: "19.15%", color: "rgba(112, 106, 97, 1)"},
                {offset: "67.35%", color: "rgba(25, 28, 49, 0)"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

    defs.append("linearGradient")
            .attr("id", "purple-area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", '0%')
            .attr("y1", '0%')
            .attr("x2", '0%')
            .attr("y2", '100%')
            .selectAll("stop")
            .data([
                {offset: "19.33%", color: "rgba(145, 137, 156, 1)"},
                {offset: "86%", color: "rgba(25, 28, 49, 0)"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

    defs.append("linearGradient")
            .attr("id", "hover-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", '0%')
            .attr("y1", '0%')
            .attr("x2", '0%')
            .attr("y2", '100%')
            .selectAll("stop")
            .data([
                {offset: ".33%", color: "#FCA311"},
                {offset: "54.54%", color: "rgba(255, 255, 255, 0)"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });
    }

    createLinearGradients();


    // Create Area Graph
    svg.selectAll(".area")
        .data(pData)
        .join("path")
        .attr("fill", (d) => `url(#${u.getAreaColorId(d)})`) //;'url(#area-gradient)')
        // .attr("background", (d) => u.getAreaFill(d))
        .attr("d", (d) => d3.area()
            .x((point) => x(u.xPoint(point)))
            .y1((point) => y(u.yPoint(point)))
            .y0(y(0))
            (d))
        .attr('class', (d) => "area" + d[0].teamId);


    // Create Different Colored Tooltips
    let orangeToolTip = d3.select("#line_chart").append("div")
        .attr("class", "toolTip")
        .style("background", "linear-gradient(89.99deg, rgba(254, 179, 56, 0.25) 0.01%, rgba(255, 255, 255, 0) 100%)")
        .style("border", "0.5px solid #FDE4BA")
        .style("opacity", 100);

    let purpleToolTip = d3.select("#line_chart").append("div")
        .attr("class", "toolTip")
        .style("background", "linear-gradient(89.99deg, rgba(220, 204, 239, 0.25) 0.01%, rgba(255, 255, 255, 0) 100%)")
        .style("border", "0.5px solid rgba(226, 201, 255, 1)")
        .style("opacity", 100);
    
    // Creating marker hover rects
    let orangeHoverRect = d3.select('#line_chart').append('div')
        .attr("class", "hover_rect")
        .style("opacity", 100)
        .style("background", "linear-gradient(179.96deg, #FCA311 0.03%, rgba(255, 255, 255, 0) 54.54%)");

    let purpleHoverRect = d3.select('#line_chart').append('div')
        .attr("class", "hover_rect")
        .style("opacity", 100)
        .style("background", "linear-gradient(179.96deg, #BC96E6 0.03%, rgba(255, 255, 255, 0) 54.54%)");
    

    u.addToolTips(pData, orangeToolTip, purpleToolTip );
    

    var backgroundElement = document.getElementById('bg');
    var bgPos = backgroundElement.getBoundingClientRect();

    const markerWidth = 20;
    const markerHeight = 12;

    const markerWidthOnHover = 24;
    const markerHeightOnHover = 14;
    let markers = pData.map(x => x.filter(y => {return y.type == "mid"}));

    // Draw markers
    svg.selectAll(".rects")
        .data(markers)
        .join("g")
        .attr("fill", (d) => u.getMarkerColor(d))
        .selectAll(".rect_points")
        .data(set => set)
        .join("svg:rect")
        .attr("rx", (d, i) => 3)
        .attr("ry", (d, i) => 1)
        .attr("x", (d, i) => u.markerXPosition(d, markerWidth, x))
        .attr("y", (d) => u.markerYPosition(d, markerHeight, y))
        .attr("width", (d) => markerWidth)
        .attr("height", (d) => markerHeight)
        .attr("class", (d) => "marker" + d.color.colorName)
        .attr("id", (d) => u.makeMarkerId(d))//"marker" + d.color.colorName + "y" + d.y + "x" + d.x)
        .on("mouseover", function(e, d) {
            let hoverRect;
            if (d.color.colorName === u.ORANGE_NAME){
                hoverRect = orangeHoverRect;
            } else {
                hoverRect = purpleHoverRect;
            }

            hoverRect
                .style("left", x(d.x) + margin.left  + "px")
                .style("top", (bgPos.top) + u.markerYPosition(d, markerHeight, y) + (markerWidth/2) - 2 + "px")
                .transition()
                .duration(200)
                // .style("top", y(d.y) + margin.top + margin.bottom + "px")
                .style("opacity", 90);

            let marker = svg.select('#' + u.makeMarkerId(d));
            marker 
                .attr('fill', u.getMarkerHoverColor(d))
                .attr("x", u.markerXPosition(d, markerWidthOnHover, x))
                .attr("y", u.markerYPosition(d, markerHeightOnHover, y))
                .attr('width', markerWidthOnHover)
                .attr('height', markerHeightOnHover);
            

            let toolTip = d.toolTip;
            toolTip.transition()
                .duration(200)
                .style("opacity", 100)
            toolTip.html(u.createToolTipText(d))
                .style("left", bgPos.left + margin.left  + "px")
                .style("top", bgPos.top *1.1  + "px");
            
        })
        .on("mouseout", function(e, d) {
            let hoverRect;
            if (d.color.colorName === u.ORANGE_NAME){
                hoverRect = orangeHoverRect;
            } else {
                hoverRect = purpleHoverRect;
            }

            hoverRect
                .transition()
                .duration(0)
                .style("opacity", 0);

            let marker = svg.select('#' + u.makeMarkerId(d));
            let toolTip = d.toolTip;
            toolTip.transition()
                .duration(50)
                .style("opacity", 0)

            marker
                .attr('fill', u.getMarkerColor(d))
                .attr("x", u.markerXPosition(d, markerWidth, x))
                .attr("y", u.markerYPosition(d, markerHeight, y))
                .attr('width', markerWidth)
                .attr('height', markerHeight);
            

        });;

        // Get text size
        // var fontSize = 12;
        // var test = document.getElementById("Test");
        // test.style.fontSize = fontSize;
        // var height = (test.clientHeight + 1) + "px";
        // var width = (test.clientWidth + 1) + "px"
        
        // console.log(height, width);
}