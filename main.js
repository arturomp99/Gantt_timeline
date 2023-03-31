// TODO: MÁRGENES!!!!!!!!
// TODO: Solo respetar el aspect ratio de la tipografía
// Igual no habría que usar viewport

let margin = {top: 10,bottom: 10,right: 10,left: 10};
let h = window.innerHeight - margin.top - margin.bottom;
let w = window.innerWidth - margin.left - margin.right;

// PARAMETERS

//

const main = async() => {
    // READ THE DATA
    const data = await d3.json('Data/self-generated.json');

    let animals = new Array();
    data["detected animals"].forEach(e => {
        if(animals.indexOf(e.id)==-1) animals.push(e.id);   // Only push if it is not in the array, TODO: Optimize this
    });

    // ------------------- BUILD THE GANTT CHART
    let colorScale = d3
    .scaleLinear()
    .domain([0, animals.length])
    .range(["#00B9FA", "#F95002"])
    .interpolate(d3.interpolateHcl);

    // CREATE THE AXES
    // Horizontal one: temporal
        /*  Data processing
        *   Javascript date format:
        *   YYY-MM-DD
        *   YYY-MM-DDTHH:MM:SSZZ
        */
    let timeScale = d3.scaleTime()
    .domain([d3.min(data["detected animals"], (d)=> new Date(d.start_time)),
            d3.max(data["detected animals"], (d)=> new Date(d.finish_time))])
    .range([0,w]);
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
    // Data processing (https://observablehq.com/@d3/d3-scaleband)
    let graphHeight = h - horAxis.node().getBBox().height;
    let animalsScale = d3
        .scaleBand()
        .domain(animals)
        .range([0, graphHeight]);   // Le quitamos la altura del eje horizontal, ya que este es desplayado hacia arriba
    var yAxis = d3
        .axisLeft(animalsScale)
        .tickSize(10);
    let vertAxis = svg
        .append('g')
        .attr('class', 'axis')
        .call(yAxis);
    // Correct the width of the horizontal sccale
    let graphWidth = w - vertAxis.node().getBBox().width;
    timeScale.range([0, graphWidth]);
    horAxis.call(xAxis);

    // Translate the axes. TODO, Could this be optimized?
    horAxis
        .attr('transform',`translate(${vertAxis.node().getBBox().width},${ graphHeight})`);
    vertAxis
        .attr('transform', `translate(${vertAxis.node().getBBox().width},0)`); 

    // Num ID for each animal
    let animalsIDs = d3.scaleBand().domain(animals).range([0, animals.length]);


    // CREATE THE RECTANGLES
    let rectWidth = graphHeight / animals.length;   // The width of the rectangles is equally distributed along the whole height
    const rectMargin = 0;  // Separation between rectangles
    var rectangles = svg
        .append('g')
        .selectAll('rect')
        .data(data["detected animals"])
        .join('rect')
            .attr("x", d=>vertAxis.node().getBBox().width + timeScale(new Date(d.start_time)))
            .attr("y", d=>animalsScale(d.id) + rectMargin/2)
            .attr("rx", rectWidth/20)   // The edges rounding is a function of the height of the rectangles
            .attr("width", d=>timeScale(new Date(d.finish_time)) - timeScale(new Date(d.start_time)))
            .attr("height", rectWidth - rectMargin)
            .style("fill", d=>colorScale(animalsIDs(d.id)))
            .style("stroke", "none");
}

let svg = d3
    .select("#gant")
        .attr("width", w)
        .attr("height", h)
    .append('svg')
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${w} ${h}`)
        // .attr('height', h)
        // .attr('width', w)
        //.attr('transform', `translate(${margin.left},${margin.top})`);

main();