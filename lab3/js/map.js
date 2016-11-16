function map(data) {

    var startTime;
    var endTime;
    var time;
    var gdata = [];
    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var clustered = false;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    var filterdData = data;

    var color = d3.scale.category10();
    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    //console.log("data", geoData.features[0]);
    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
            data.push({
                type: "Feature",
                geometry: {
                    type: 'Point',
                    coordinates: [d.lon, d.lat]
                },
                "properties" : {
                "id" : d.id,
                "time" : d.time,
                "magnitude" : d.mag,
                "place" : d.place,
                "depth" : d.depth
                }
            });
        });
        //console.log("data", data);

        return data;
    }

    function draw(countries){

          var country = g.selectAll(".country").data(countries);
              
              country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");

        //draw point        
        var point = g.selectAll("circle")
                    .data(geoData.features)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("cx", function(d) {
                        return projection(d.geometry.coordinates)[0];
                    })
                    .attr("cy", function(d) {
                        return projection(d.geometry.coordinates)[1];
                    })
                    .attr("r", 3)
                    .style("fill", "orange")
    };

    //Draws the map and the points
    function cl(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries)
                    .enter().insert("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .style('stroke-width', 1)
                    .style("fill", "lightgray")
                    .style("stroke", "white");

        //draw point
        var point = g.selectAll("circle")
            .data(geoData.features)
            .enter().append("circle")
            .attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
            .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
            .attr("r",2 )
            .attr("class", "showDot")
            .style("fill", "orange");


    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
        d3.selectAll("circle").style("opacity", function(d) {
        
        if(clustered){
            return (d.magnitude > value ) ? 1 : 0;
        }
        else{
            return (d.properties.magnitude > value ) ? 1 : 0;
        }

        });
    }

    //Filters data points according to the specified time window
    this.filterTime = function(value) {
        //Complete the code
        startTime = value[0].getTime();
        endTime = value[1].getTime();

        d3.selectAll("circle").style("opacity", function(d) {

            time = new Date(d.properties.time);
          
         return (startTime <= time.getTime() && time.getTime() <= endTime) ? 1 : 0;
        });

    };

    //Calls k-means function and changes the color of te points
    this.cluster = function () {
        //Complete the code
        //console.log("TESTING", data);
        gData = [];
        var filtDataIndex =  [];
        console.log("orig", data.length);
        //add all data to the global data array which is not filtered out 
        //console.log("start", startTime);
        //console.log("end", endTime);
        for (j=0; j < data.length; j++) {
            var dTime = new Date(data[j].time);
            var dMag = data[j].mag;
            //make data array with selected values
            if ((startTime == 0 || dTime.getTime() >= startTime) && (endTime == 0 || dTime.getTime() <= endTime)) {

                filtDataIndex.push(j);
                gData.push(data[j]);
            }
        }
        // if no filtering
        //console.log("g", gData.length);
        if (gData.length == 0)
        {
            for (var i = 0; i < data.length; i++)
            {
                gData.push(data[i]);
            }
        }

        var k = document.getElementById("k").value;
        var kmeansRes = kmeans(gData,k);

        
        //console.log("gData", gData);
        //console.log("kmeansRes", kmeansRes);
        svg.selectAll("circle")
            .data(geoData.features)
            .style("fill", function(d){ 
                //console.log("d", kmeansRes[i]);
            for (var i = 0; i < gData.length; i++) {

                if(d.properties.id == gData[i].id){
                    console.log("HI");
                    return color(kmeansRes[i]);    
                }
                
                
            };
                

            });

        clustered = true;
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
