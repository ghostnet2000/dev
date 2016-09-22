if(!d3.chart) d3.chart = {};

d3.chart.histogram = function() {
  var g;
  var data;
  var width = 400;
  var height = 400;
  var cx = 10;
  var cy = 0;
  var categories = [ "EC", "FS", "GP", "KZN", "LP","NC", "NW", "MP", "WC", "ZA" ]
  var numberBins = 10;
  var _data;
  var dispatch = d3.dispatch(chart, "hover");

  var count = function() {
    var counts = {};
    data.forEach(function(x) { counts[x.properties.province] = (counts[x.properties.province] || 0)+1; });
    _data = sortOnKeys(counts)
  };

  var sortOnKeys = function(dict) {

    var sorted = [];
    var xyz = [];

    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
      tempDict[sorted[i]] = dict[sorted[i]];
    }

    for(var i = 0; i < categories.length; i++) {
      xyz[i] = tempDict[categories[i]] != undefined ? tempDict[categories[i]] : 0;
    }
    console.log(xyz);
    return xyz;
  }

  function chart(container) {
    g = container;

    update();
  }
  
  chart.update = update;
  function update() {
    count();
    var max = d3.max(_data, function(d) { return d })


    var hist = d3.layout.histogram()
    .value(function(d) { return d })
    .range([0, max ])
    .bins(10);

    var layout = hist(_data);

    xmax = d3.max(layout, function(d) { return d })
    //alert( xmax );
    //alert(layout);

    var xScale = d3.scale.linear()
    .domain([0, max])             //Replaced with _xmax
    .range([cx, width])

    var yScale = d3.scale.ordinal()
    .domain(d3.range(layout.length))
    .rangeBands([height,cy], 0.1)

    var rects = g.selectAll("rect")
    .data(layout)

    rects.enter()
    .append("rect")
    .classed("bin", true)

    rects.append("div")
      .classed("label", true)
      .style("width", "20px")
      .text(function (e,i ) { return categories[i]; });


    rects.exit().remove()

    rects.attr({
      x: cx,
      y: function(d, i) { return yScale(i) },
      height: yScale.rangeBand(),
      width: function(d, i) { return xScale( _data[i] ) }
    })
    .on("click", function(d) {
      console.log("bin", d)
    })
    .on("mouseover", function(d) {
      d3.select(this).style("fill", "#dfefef")
      dispatch.hover(d);
    })
    .on("mouseout", function(d) {
      d3.select(this).style("fill", "")
      dispatch.hover([]);
    })

  }

/*
all_provinces_bar_data_bind_text
*/

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

  return d3.rebind(chart, dispatch, "on");
}