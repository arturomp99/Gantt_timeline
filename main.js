margin = {top: 10,bottom: 10,right: 10,left: 10};
totalHeight = window.innerHeight;
totalWidth = window.innerWidth;

d3
    .select("#gant")
        .attr('heigth', totalHeight)
        .attr('width', totalWidth)
    .append('svg')
        .attr('heigth', totalHeight-margin.top-margin.bottom)
        .attr('width', totalWidth-margin.left-margin.right)
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .style('background-color','red')