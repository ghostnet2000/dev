if(!d3.chart) d3.chart = {};

d3.chart.table = function() {
  var div;
  var data;
  var width;
  var dispatch = d3.dispatch(chart, "hover");
  function chart(container) {
    div = container;

    var table = container.append("table")
    update();
  }
  chart.update = update;

  function update() {
    var table = div.select("table")
    var rows = table.selectAll("tr.row")
    .data(data, function(d) { return d.properties.id })

    console.log("table data", data)

    rows.exit().remove();
    var rowsEnter = rows.enter()
    .append("tr").classed("row", true)


    rowsEnter.append("td")
    .append("a")
    .attr({
      href: function(d) { return d.properties.article_url }
    })
    .append("img")
    .attr({
      src: function(d) { return d.properties.thumbnail }
    })
    .style( "width", "72px")
    .style( "height", "72px")

    rowsEnter.append("td")
    .append("a")
    .attr({
      href: function(d) { return d.properties.article_url }
    }).text(function(d) { return d.properties.article_title })

    /*
    rowsEnter.append("td")
    .text(function(d) { return d.properties.ups })

    rowsEnter.append("td")
    .text(function(d) { return d.properties.downs })
    */
    

    rowsEnter.on("mouseover", function(d) {
      d3.select(this).style("background-color", "orange")
      dispatch.hover([d])
      //changes the details in the tooltip item

      d3.select("#tt_total")
        .text(d.properties.article_description);
      d3.select("#tt_female")
        .text(d.properties.primary_event_date);
      d3.select("#tt_black_african")
        .text(d.properties.primary_loc);
    })
    rowsEnter.on("mouseout", function(d) {
      d3.select(this).style("background-color", "")
      dispatch.hover([])
      //Clear Text
      d3.select("#tt_total")
        .text("");
      d3.select("#tt_female")
        .text("");
      d3.select("#tt_black_african")
        .text("");
    })
  }

  chart.highlight = function(data) {
    var trs = div.selectAll("tr")
    .style("background-color", "")

    trs.data(data, function(d) { return d.properties.id })
    .style("background-color", "orange")
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

  return d3.rebind(chart, dispatch, "on");
}