

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
    let newData = [];
    let interval = xMax/intervals;
    let xValues = [];

    for (let i = 0; i < intervals; i++){
        xValues.push(i*interval);
    }
    console.log('xValues', xValues);

    for (let i = 0; i < data.length; i++){
        let rows = data[i].sort((x1, x2) => x1 - x2);
        if (xValues.length != rows.length ){
            console.log("Differing length in x and y values");
        }
        for (let j = 0; j < rows.length; j++){
            rows[j].x = xValues[j];
        }
        newData.push(rows)
    }
    return newData; 
}