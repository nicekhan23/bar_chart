const width = 960;
const height = 500;
const padding = 60;

const svg = d3.select("#chart");
const tooltip = d3.select("#tooltip");

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

d3.json(url).then(data => {
  const dataset = data.data;

  const xScale = d3.scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height - padding, padding]);

  // Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  // Bars
  const barWidth = (width - 2 * padding) / dataset.length;

  svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", d => height - padding - yScale(d[1]))
    .on("mouseover", function (event, d) {
      tooltip
        .style("opacity", 0.9)
        .attr("data-date", d[0])
        .html(`${d[0]}<br>$${d[1]} Billion`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 40) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
});
