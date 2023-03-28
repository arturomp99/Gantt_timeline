let margin = {top: 10,bottom: 10,right: 10,left: 10};
let h = window.innerHeight - margin.top - margin.bottom;
let w = window.innerWidth - margin.top - margin.bottom;

// PARAMETERS

//

const main = async() => {
    // READ THE DATA
    const data = await d3.json('Data/self-generated.json');

    // DATA PROCESSING
        /*
        *   Javascript date format:
        *   YYY-MM-DD
        *   YYY-MM-DDTHH:MM:SSZZ
        */
    let timeScale = d3.scaleTime()
        .domain([d3.min(data["detected animals"], (d)=> new Date(d.start_time)),
                d3.max(data["detected animals"], (d)=> new Date(d.finish_time))])
        .range([0,w]);
    let animals = new Array();
    data["detected animals"].forEach(e => {
        if(animals.indexOf(e.id)==-1) animals.push(e.id);   // Only push if it is not in the array, TODO: Optimize this
    });
    let animalsScale = d3
        .scaleBand()    // (https://observablehq.com/@d3/d3-scaleband)
        .domain(animals)
        .range([0, h]);
    console.log(animals);

    // ------------------- BUILD THE GANTT CHART
    let colorScale = d3
    .scaleLinear()
    .domain([0, animals.length])
    .range(["#00B9FA", "#F95002"])
    .interpolate(d3.interpolateHcl);

    // CREATE THE AXES
    // Horizontal one: temporal
    var xAxis = d3
        .axisBottom(timeScale)
        .ticks(d3.timeMinute.every(10)) // create a tick each minute
        .tickSize(10)   // The ticksize could be a function of the dimensions of the chart (https://www.geeksforgeeks.org/d3-js-axis-ticksize-function/)
        .tickFormat(d3.timeFormat('%H:%M:%S'));  // (https://d3-wiki.readthedocs.io/zh_CN/master/Time-Formatting/)
    
    var horAxis = svg
        .append('g')
        .attr('class','axis')
        .call(xAxis);

    // Vertical one: categorical   
    var yAxis = d3
        .axisLeft(animalsScale)
        .tickSize(10);
    let vertAxis = svg
        .append('g')
        .attr('class', 'axis')
        .call(yAxis);

    // Translate the axes. TODO, Could this be optimized?
    horAxis
        .attr('transform',`translate(${vertAxis.node().getBBox().width},${h - horAxis.node().getBBox().height})`);
    vertAxis
        .attr('transform', `translate(${vertAxis.node().getBBox().width},${-horAxis.node().getBBox().height})`); 
}

let svg = d3
    .select("#gant")
    .append('svg')
        .attr('height', h)
        .attr('width', w)
        .attr('transform', `translate(${margin.left},${margin.top})`);

main();