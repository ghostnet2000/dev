/**
 * WhenVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
WhenVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.breakdown = ['total'];
  this.yVariable = ['commuter','leisure'];

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 60,
      left: 45
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}


WhenVis.prototype.initVis = function() {
  var that = this;

  /************* Foreign Code *********************/

  var formatDate = d3.time.format("%m/%y");

  var x = d3.time.scale().range([0, this.width]);
  var y = d3.scale.linear().range([this.height, 0]);

  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").tickFormat(formatDate);

  var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(6);

  // Create the SVG drawing area
  var svg = d3.select("body")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  /**********************************************/

  this.wrangleData();
  // // call the update method
  this.updateVis();
}

WhenVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WhenVis.prototype.updateVis = function() {
  var that = this;

  // Get the data

  // Parse the date strings into javascript dates
  data.forEach(function(d) {
    d.created_date = parseDate(d.article_date);
  });

  // Determine the first and list dates in the data set
  var monthExtent = d3.extent(this.data, function(d) { return d.created_date; });

  // Create one bin per month, use an offset to include the first and last months
  var monthBins = d3.time.months(d3.time.month.offset(monthExtent[0],-1),
                                 d3.time.month.offset(monthExtent[1],1));

  // Use the histogram layout to create a function that will bin the data
  var binByMonth = d3.layout.histogram()
    .value(function(d) { return d.created_date; })
    .bins(monthBins);

  // Bin the data by month
  var histData = binByMonth(this.data);

  // Scale the range of the data by setting the domain
  this.x.domain(d3.extent(monthBins));
  this.y.domain([0, d3.max(histData, function(d) { return d.y; })]);

  // Set up one bar for each bin
  // Months have slightly different lengths so calculate the width for each bin
  // Note: dx, the width of the histogram bin, is in milliseconds so convert the x value
  // into UTC time and convert the sum back to a date in order to help calculate the width
  // Thanks to npdoty for pointing this out in this stack overflow post:
  // http://stackoverflow.com/questions/17745682/d3-histogram-date-based
  that.svg.selectAll(".bar")
      .data(histData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return this.x(d.x); })
      .attr("width", function(d) { return this.x(new Date(d.x.getTime() + d.dx))- this.x(d.x)-1; })
      .attr("y", function(d) { return this.y(d.y); })
      .attr("height", function(d) { return this.height - this.y(d.y); });

  // Add the X Axis
  that.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

  // Add the Y Axis and label
  that.svg.append("g")
     .attr("class", "y axis")
     .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Sightings");

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */

WhenVis.prototype.onSelectionChange = function() {
  var myDom = {
      gender: ['male','female'],
      total: ['total'],
      weekend: ['weekend'],
      weekday: ['weekday'],
      commute: ['commuter','leisure'],
      registered: ['registered','casual'],
      dist: ['dist'],
      speed:['speed'],
      duration: ['duration']
  };
  var breakdown = d3.select('#formgroup').selectAll('.formgroup2.active');
  var yVariable = d3.select('#formgroup').selectAll('.formgroupy.active');
  breakdown = (breakdown.node()) ? breakdown.node().value : 'total';
  yVariable = (yVariable.node()) ? yVariable.node().value : 'total';
  console.log(yVariable)
  this.yVariable = myDom[yVariable];
  this.breakdown = [breakdown]
  this.wrangleData();
  this.updateVis();
}

WhenVis.prototype.onTypeChange = function(_dom) {
  if (this.dom != _dom) {
  	this.dom = _dom;
  	this.wrangleData(this.filter);
  	this.updateVis();
  }
}
/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

WhenVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var that = this;
  var res = [];
  /**
  that.yVariable.forEach(function (t) {
    that.breakdown.forEach(function (w) {
      res.push({
        type: t+" "+w,
        points: that.data.map(function (d) {
          return {x: d.timeofday, y: d[t][w]}
        })
      })
    })
  });
  **/
  return res;
}

// WhenVis.prototype.mouseover = function() {
//   d3.selectAll(".area").style("opacity",0.3);
//   d3.selectAll(".line").style("stroke","2px");
//   d3.select(d3.event.target).style("opacity",0.8).style("stroke","5px");
// }
// WhenVis.prototype.mouseout = function() {
//   d3.selectAll(".area").style("opacity",0.6)
//   d3.selectAll(".line").style("stroke","2px")
// }
