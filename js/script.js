$(function() {
    // Set global variables (width, height, etc.)
    var width = 1200,
        height = 1200,
        margin = {
            top: 30,
            right: 120,
            bottom: 50,
            left: 80
        };

    var drawWidth = width - margin.left - margin.right;
    var drawHeight = height - margin.top - margin.bottom;

    // Create a color scale
    var color = d3.scaleThreshold()
                .domain(d3.range(67,83))
                .range(d3.schemeRdBu[6]);
    // Create svg and g elements
    var svg = d3.select("#vis").append("svg")
        .attr('width', width)
        .attr('height', height);

    var county = d3.map();

    var path = d3.geoPath();

    var x = d3.scaleLinear()
            .domain([1, 10])
            .rangeRound([600, 860]);

    // Load and prep data and shapefile
    d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data/ihme-life-expectancy.csv", function(d) { 
        if (d.FIPS.length == 4)
            d.FIPS = "0"+d.FIPS
            if (d.FIPS.length == 5)
                county.set(d.FIPS, +d.Life_expectancy_2014.split(" ")[0]);
        })
    .await(ready);
    // Function once data and shapefile are loaded
    function ready(error, us) {
        // Set color scale domain
        color.domain([67,71,75,79,83]);
        // Append and draw counties (with transition)

        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("fill", function(d) { 
                return color(d.rate = county.get(d.id)); })
            .attr("d", path)
            .append("title")
            .text(function(d) { return d.rate + " years"; });

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "states")
            .attr("d", path);

        // Append a legend using d3.legend
        var legend = d3.legendColor()
                    .labelFormat(d3.format(".2f"))
                    .labels(d3.legendHelpers.thresholdLabels)
                    .title("Life Expectancy (years)")
                    .scale(color);

         svg.append("g")
            .attr("class", "legendQuant")
            .attr("transform", "translate(1010,20)");

            svg.selectAll(".legendQuant")
                .call(legend);

    }
});