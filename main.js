d3.json("cyclist-data.json").then(dataset => {

  const margin = { top: 20, right: 30, bottom: 20, left: 80 };


  const svgWidth = 1000, svgHeight = 500;
  const contentWidth = svgWidth - margin.left - margin.right,
    contentHeight = svgHeight - margin.top - margin.bottom;

  const radius = 6;

  const titleHeight = 50;/*height of title and subtitle*/

  const yearArr = dataset.map(e => e.Year);
  const minYear = d3.min(yearArr), maxYear = d3.max(yearArr);
  const xScale = d3.scaleLinear().domain([minYear - 1/*make dots not sticking to yAxis*/, maxYear + 1])
    .range([margin.left, contentWidth + margin.left]);

  const timeArr = dataset.map(e => e.Seconds);
  const minTime = d3.min(timeArr), maxTime = d3.max(timeArr);
  const yScale = d3.scaleLinear().domain([minTime - 20/*make dots not too high*/, maxTime])
    .range([margin.top, contentHeight + margin.top]);


  const svg = d3.select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .classed('circle', true)
    .attr('fill', d => getDotColor(d))
    .attr('stroke', "black")
    .attr('r', radius)
    .attr('cx', d => {
      return xScale(d.Year);
    })
    .attr('cy', d => yScale(d.Seconds))
    .on("mouseover", function (d) {
      d3.select(this).attr("fill", "aqua");

      //Get this bar's x/y values, then augment for the tooltip
      var xPosition = parseInt(d3.select(this).attr("cx")) + margin.left;
      var yPosition = parseInt(d3.select(this).attr("cy")) + titleHeight;
      //Update the tooltip position and value
      const tooltip = d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      tooltip.select("#name").text(d.Name + ": " + d.Nationality);
      tooltip.select("#time").text(`Year: ${d.Year}, Time: ${d.Time}`);
      tooltip.select("#doping").text(d.Doping);
      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", getDotColor(d));
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => {
      return d;
    });

  svg.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${margin.top + contentHeight})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => {
      var minute = Math.floor(d / 60);
      var second = d % 60;
      second = second >= 10 ? second : "0" + second;
      return `${minute}:${second}`;
    });

  svg.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", - svgHeight / 3)
    .attr("font-size", "1.3em")
    .attr("dy", "1.8em")
    .style("text-anchor", "middle")
    .text("Time in Minutes");

  var ordinal = d3.scaleOrdinal()
    .domain(["No Doping Allegation", "Riders With Doping Allegations"])
    .range([noDopingColor, dopingColor]);

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", `translate(${margin.left + contentWidth - 300}, ${margin.top + 100})`);

  var legendOrdinal = d3.legendColor()
    .shapePadding(10)
    .scale(ordinal);

  svg.select(".legendOrdinal")
    .call(legendOrdinal);
});

var dopingColor = "#4286f4";
var noDopingColor = "#ff9028";

var getDotColor = d => d.Doping === "" ? noDopingColor : dopingColor;