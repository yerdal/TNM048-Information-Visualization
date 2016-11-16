function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    var cValue = function(d) { return d.Country;},
    color = d3.scale.category20();

    //initialize tooltip
    //...

    var projection = d3.geo.mercator()
        .center([50, 60 ])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/world-topo.topojson", function(error, world) {
        //console.log(world);
        var countries = topojson.feature(world, world.objects.countries).features;

        //load summary data
        //...
        d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {

        draw(countries, data);
        });
    });

    function draw(countries,data)
    {
        var country = g.selectAll(".country").data(countries);

        //initialize a color country object
        var cc = {};

        data.forEach(function(d){
            cc[d["Country"]] = color(d["Country"]);
        });
        //...

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            .style("fill", function(d) { return cc[d.properties.name]; })

            //country color
            //...
            //tooltip
            .on("mouseover", function(d){
                tooltip.style("visibility", "visible");
                return tooltip.text(d.properties.name);
            })
            .on("mousemove", function(d){
              tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(d.properties.name)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");

                //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                return tooltip.style("visibility", "hidden");
            })
            //selection
            .on("click",  function(d) {
                //...
                selFeature(d.properties.name);
            });
    }

    //zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    //method for selecting features of other components
    function selFeature(value){
        //...
        sp1.selectDot(value);
        pc1.selectLine(value);
    }
}
