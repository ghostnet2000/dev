if(!d3.chart) d3.chart = {};

d3.chart.symbol_map = function() {
  var g;
  var data;
  var width = 350;
  var height = 350;
  var cx = 10;
  var size_scale = 30;
  var dispatch = d3.dispatch(chart, "hover");
  var projection;
    
    
  function chart(container) {
    g = container;

    d3.json("layer1.json", function (error, json) {


      // create a first guess for the projection
      var center = d3.geo.centroid(json)
      var scale  = 150;
      var offset = [width/2, height/2];
      projection = d3.geo.mercator()
          .scale(scale)
          .center(center)
          .translate(offset);


      // create the path
      var path = d3.geo.path().projection(projection);

      // using the path determine the bounds of the current map and use 
      // these to determine better values for the scale and translation
      var bounds  = path.bounds(json);
      var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
      var scale   = (hscale < vscale) ? hscale : vscale;
      var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                        height - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      projection = d3.geo.mercator().center(center)
        .scale(scale).translate(offset);
      path = path.projection(projection);

      // add a rectangle to see the bound of the svg
      
      g.append("rect").attr('width', width).attr('height', height)
        .style('stroke', 'black').style('fill', 'none');
      
      g.selectAll("path").data(json.features).enter().append("path")
        .attr("d", path)
        .style("opacity", 0.3)
        .style("fill", "green")
        .style("stroke-width", "1")
        .style("stroke", "black")
/*
        //draws the map in the div.
        g.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#9ECAE1");
  */
     update();
    });
    //update(); // This calculates projections
  }
  chart.update = update;

    function update() {
      
     var symbols = g.selectAll("circle")
      .data(data.sort(function(a, b) { return b.agprod - a.agprod; }), key);

      symbols.enter().append("circle");
      
     
      symbols
      .transition()
      .attr("cx", function(d) {
            return projection(d.geometry.coordinates)[0];
            })
      .attr("cy", function(d) {
            return projection(d.geometry.coordinates)[1];
            })
      .attr("r", function(d) {
            return Math.sqrt(parseFloat(1.3154) * size_scale);
            })
      .style("fill", function(d) {
             return "E41A1C";
             })
      .style("opacity", 0.75)
      .attr("class", "symbol")
      .attr("title", function(d) { return "Productivity for " + d.properties.id + ": " + 1.3154; });
  
    
    symbols.exit()
      //.transition()
      .remove();
     

    symbols.on("mouseover", function(d) {
      d3.select(this).style("stroke", "orange")
      dispatch.hover([d])
    })

    symbols.on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.hover([])
    })
  }

    chart.highlight = function(data) {
        var symbols = g.selectAll("circle.symbol")
        .style("stroke", "")
        .style("stroke-width", "")

        
        symbols.data(data, key)
        .style("stroke", "black")
        .style("stroke-width", 3)
    }
  
    
    
  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }
    
   var key = function(d) {
        return d.id;
   };

  return d3.rebind(chart, dispatch, "on");
}