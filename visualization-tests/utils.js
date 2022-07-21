
export const PURPLE_NAME = "purple";
export const ORANGE_NAME = "orange";
const PURPLE = 'rgba(145,137,156,100)';
const ORANGE = 'rgba(153,145,133,100)';
const M_PURPLE = 'rgba(234,197,251,.5)';
const M_ORANGE = 'rgba(255,241,202,.8)';
const T_PURPLE = 'rgba(241, 228, 255, 1)';
const T_ORANGE = '#FDE4BA';
const AREA_GRADIENT_ID_PURPLE = 'purple-area-gradient';
const AREA_GRADIENT_ID_ORANGE = 'orange-area-gradient';
const H_ORANGE = 'rgba(252, 163, 17, 1)';
const H_PURPLE = 'rgba(188, 150, 230, 1)';


export function mapRawData(data, yKey){
    let newData = [];

    for (let i = 0; i < data.length; i++){
        let newObject = {};
        for (let [key, value] of Object.entries(data[i])){
            if (key.toLowerCase() === yKey){
                newObject['y'] = value;
            } else{
                newObject[key] = value;
            }
        }
        newData.push(newObject);
    }
    return newData;
}

export function createPlateau(data, pointPadding){
    var allNewData = [];
    for (let i = 0; i < data.length; i++) {
        let rows = data[i];
        var newData = [];
        for (let j = 0; j < rows.length; j++){
            let startPoint = structuredClone(rows[j]); 
            startPoint.type = 'start';
            startPoint.x = startPoint.x - pointPadding;
            newData.push(startPoint);

            let midPoint = structuredClone(rows[j]); 
            midPoint.type = 'mid';
            newData.push(midPoint);

            let endPoint = structuredClone(rows[j]); 
            endPoint.type = 'end';
            endPoint.x = endPoint.x + pointPadding;
            newData.push(endPoint);
        }
        allNewData.push(newData);
    }
    return allNewData;
}

export function addXValues(data, xMax, intervals){
    let interval = xMax/intervals;
    let xValues = [interval/2];

    for (let i = 2; i < intervals + 1; i++){
        xValues.push((i*interval) - interval/2);
    }

    for (let i = 0; i < data.length; i++){
        let rows = data[i].sort((x1, x2) => x1 - x2);
        if (xValues.length != rows.length ){
            console.log("Differing length in x and y values");
        }
        for (let j = 0; j < rows.length; j++){
            rows[j].x = xValues[j];
        }
    }
}

export function addColors(data, colorMap){
    for (let i = 0; i < data.length; i++){
        let rows = data[i];
        let color = colorMap[rows[0].teamId];
        for (let j = 0; j < rows.length; j++){
            rows[j].color = color;
        }
    }
}

export function createColorMap(teamIds){
    let colorMap = {};
    for (let i = 0; i < teamIds.length; i++){
        if (i === 0){
            colorMap[teamIds[i]] = {
                lineColor: PURPLE,
                markerColor: M_PURPLE,
                colorName: PURPLE_NAME,
                textColor: T_PURPLE,
                areaColor: AREA_GRADIENT_ID_PURPLE,
                hoverColor: H_PURPLE,
            }
        } else {
            colorMap[teamIds[i]] = {
                lineColor: ORANGE,
                markerColor: M_ORANGE,
                colorName: ORANGE_NAME,
                textColor: T_ORANGE,
                areaColor: AREA_GRADIENT_ID_ORANGE,
                hoverColor: H_ORANGE,
            }
        }
    }
    return colorMap;
}

export function getUniqueTeamIds(data){
    let flat = Array.prototype.concat.apply([], data);
    return [...new Set(flat.map(d => d.teamId))];
}

export function addToolTips(data, orangeToolTip, purpleToolTip){
    for (let i = 0; i < data.length; i++){
        let rows = data[i];
        for (let j = 0; j < rows.length; j++){
            let row = rows[j];
            if (row.color.colorName == PURPLE_NAME){
                row.toolTip = purpleToolTip;
            } else {
                row.toolTip = orangeToolTip;
            }
        }
    }
}

export function createToolTipText(data){
    return `<span class="toolTip" style="color:${data.color.textColor}">
    GPM: ${data.y} </br>
    Opponent: ${data.teamId}
    </span> 
    `
    
}

export function makeMarkerId(d){
    return "marker" + d.color.colorName + "y" + d.y + "x" + d.x;
}

export function getLineColor(d){
    return d[0].color.lineColor;
}

export function getMarkerColor(d){
    if (d.constructor === Array){
        return d[0].color.markerColor;
    } else {
        return d.color.markerColor;
    }
}

export function getMarkerHoverColor(d){
    return d.color.hoverColor;
}

export function getAreaColorId(d){
    let x =  d[0].color.areaColor;
    console.log(x);
    return x;
}

export function xPoint(point){
    return point.x;
}

export function yPoint(point){
    return point.y;
}

export function markerXPosition(point, markerWidth, xScale){
    return xScale(xPoint(point)) - markerWidth/2;
}

export function markerYPosition(point, markerHeight, yScale){
    return yScale(yPoint(point)) - markerHeight/2;
}