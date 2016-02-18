function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    
    //initialize tooltip
    //...

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        
        //define the domain of the scatter plot axes
        //Task1
        //Choose the data attributes to visualize and define the scale of the scatter plot axes in the parser
        // d3.csv() using the operator domain().   

    
        x.domain([0, d3.max(data, function(d){
            //console.log("ERATE", d["Employment rate"]);  
            return d["Employment rate"]; }) ]);
        y.domain([0, d3.max(data, function(d){return d["Unemployment rate"]; }) ]);

        draw();

    });

    function draw()
    {
        
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            //.text("Employment rate");
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            //.text("Unemployment rate");
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 2)
            .attr("cx", function(d){
                return d["Employment rate"];
            })
            .attr("cy", function(d){
                return d["Unemployment rate"];
            });
            //Define the x and y coordinate data values for the dots
            //...
        svg.selectAll("text")
            .data(self.data)
            .enter()
            .append("text")
            .text(function(d){
                return d["Employment rate"] + ", " + d["Unemployment rate"] + ", " + d["Country"];
            })
            .attr("x", function(d){
                return d["Employment rate"];
            })
            .attr("y", function(d){
                return d["Unemployment rate"];
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "8px")
            .attr("fill", "red");

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Employment rate");
            //tooltip

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Unemployment rate")

            .on("mousemove", function(d) {
                //...    
            })
            .on("mouseout", function(d) {
                //...   
            })
            .on("click",  function(d) {
                //...    
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}




