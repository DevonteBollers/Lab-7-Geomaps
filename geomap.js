
d3.json("./topo.json").then((data) => {

    const topo = topojson.feature(data, data.objects.states);

    console.log(topo);

    // create the projection
    const projection = d3.geoAlbersUsa()
        .scale(1000)
        .translate([450, 250]);

    const path = d3.geoPath()
        .projection(projection);

    // create the map
    const svg = d3.select("#geomap")
        .append("g")
        .attr("transform", "translate(50,50)");

    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "whitesmoke")
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

});
