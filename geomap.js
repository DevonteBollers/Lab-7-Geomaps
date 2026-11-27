
Promise.all([
    d3.json("./topo.json"),
    d3.csv("./cities.csv"),
    d3.csv("./states.csv")
]).then((data) => {

    const topology = data[0];
    const cities = data[1];
    const states = data[2];

    const topo = topojson.feature(topology, topology.objects.states);

    // create a dictionary for states and populations
    const stateDictionary = new Map();

    states.forEach((state) => {
        stateDictionary.set(state.State, +state["2018 Population"]);
    });

    console.log(stateDictionary);

    // create the color scale
    const blues = d3.scaleSequential()
        .domain(d3.extent(stateDictionary.values()))
        .range(["white", "steelblue"]);

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

    // draw the states
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
            const population = stateDictionary.get(d.properties.name);

            if (population === undefined) {
                return "whitesmoke";
            }

            return blues(population);
        })
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

    // draw the capital cities
    svg.append("g")
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr("cx", (d) => {
            return projection([+d.longitude, +d.latitude])[0];
        })
        .attr("cy", (d) => {
            return projection([+d.longitude, +d.latitude])[1];
        })
        .attr("r", 4)
        .attr("fill", "indianred")
        .attr("stroke", "black")
        .attr("stroke-width", "0.5px")
        .attr("opacity", 0.8);

});
