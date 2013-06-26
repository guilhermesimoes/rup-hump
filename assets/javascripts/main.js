var svg,
    margin = {top: 10, right: 20, bottom: 230, left: 60},
    chartHeight = 110,
    contextPaddingTop = 20,
    contextHeight = 60,
    contextLabelPaddingTop = 20,
    screenTakenPercentage = 0.9,
    drawAreaWidth,
    drawAreaHeight,
    chartWidth,
    contextWidth,
    contextOffsetLeft,
    contextOffsetTop,
    subjectsCount,
    chartsData = [];

if (appConfig.fileApi) {
    var inputElement = document.getElementById("js-input");
    inputElement.style.display = "";
    inputElement.addEventListener("change", handleFiles);
}
else {
    showWarning("This browser does not support the HTML5 File API specification. Switch to a modern browser (like Chrome or Firefox) to interact with this page.");
}

function handleFiles() {
    var file = this.files[0],
        objectURL = window.URL.createObjectURL(file);

    d3.csv(objectURL, function(data) {
        parseData(data);
        updateWidthVariables();
        drawChart();
    });

    window.onresize = debounce(function() {
        updateWidthVariables();
        drawChart();
    }, 200);
}


function updateWidthVariables() {
    drawAreaWidth = document.body.offsetWidth * screenTakenPercentage;
    chartWidth = drawAreaWidth - margin.left - margin.right;
    contextWidth = chartWidth * 0.5;
    contextOffsetLeft = margin.left + chartWidth * 0.25;

    for (var i = 0; i < subjectsCount; i++) {
        chartsData[i].width = chartWidth;
    }
}

function parseData(data) {
    var tempDate,
        subjects = [],
        maxDataPoint = 0;

    /* Loop through first row and get each subject
      and push it into an array to use later */
    for (var prop in data[0]) {
        if (data[0].hasOwnProperty(prop)) {
            if (prop !== "Date") {
                subjects.push(prop);
            }
        }
    }

    subjectsCount = subjects.length;
    drawAreaHeight = margin.top + (subjectsCount * chartHeight) + margin.bottom;
    contextOffsetTop = margin.top + ((subjectsCount + 1) * chartHeight) + contextPaddingTop;

    /* Let's make sure these are all numbers,
      we don't want javaScript thinking it's text

      Let's also figure out the maximum data point
      We'll use this later to set the Y-Axis scale
    */
    data.forEach(function(d) {
        for (var prop in d) {
            if (d.hasOwnProperty(prop)) {

                if (prop === "Date") {
                    // D3 needs a date object, let's convert it just one time
                    tempDate = new Date(d.Date);

                    if (isValidDate(tempDate)) {
                        d.Date = tempDate;
                    }
                    else {
                        showWarning("The date " + d.Date + " could not be parsed by this web browser. Try to follow the standard date format, ISO 8601.");
                    }
                }
                else {
                    d[prop] = parseFloat(d[prop]);

                    if (d[prop] > maxDataPoint) {
                        maxDataPoint = d[prop];
                    }
                }
            }
        }
    });

    chartsData = [];
    for (var i = 0; i < subjectsCount; i++) {
        chartsData.push({
            data: data.slice(),
            id: i,
            name: subjects[i],
            maxDataPoint: maxDataPoint,
            height: chartHeight,
            margin: margin,
            showTopAxis: (i === 0),
            showBottomAxis: (i === subjectsCount - 1)
        });
    }
}

function isValidDate(date) {
    if (Object.prototype.toString.call(date) !== "[object Date]") {
        return false;
    }
    return !isNaN(date.getTime());
}

function Chart(options) {
    this.data = options.data;
    this.width = options.width;
    this.height = options.height;
    this.maxDataPoint = options.maxDataPoint;
    this.id = options.id;
    this.name = options.name;
    this.margin = options.margin;
    this.showTopAxis = options.showTopAxis;
    this.showBottomAxis = options.showBottomAxis;

    var localName = this.name;

    /* XScale is time based */
    this.xScale = d3.time.scale()
        .range([0, this.width])
        .domain(d3.extent(this.data.map(function(d) { return d.Date; })));

    /* YScale is linear based on the maxData Point we found earlier */
    this.yScale = d3.scale.linear()
        .range([this.height, 0])
        .domain([0, this.maxDataPoint]);

    var xS = this.xScale;
    var yS = this.yScale;

    /* 
      This is what creates the chart.
      There are a number of interpolation options. 
      'basis' smooths it the most, however, when working with a lot of data, this will slow it down 
    */
    this.area = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return xS(d.Date); })
        .y0(this.height)
        .y1(function(d) { return yS(d[localName]); });
    /*
      This isn't required - it simply creates a mask. If this wasn't here,
      when we zoom/panned, we'd see the chart go off to the left under the y-axis 
    */
    svg.append("defs").append("clipPath")
                        .attr("id", "clip-" + this.id)
                        .append("rect")
                            .attr("width", this.width)
                            .attr("height", this.height);
    /*
      Assign it a class so we can assign a fill color
      And position it on the page
    */
    this.chartContainer = svg.append("g")
                            .attr("class", this.name.replace(/\s+/g, "-").toLowerCase())
                            .attr("transform", "translate(" + this.margin.left + "," + (this.margin.top + (this.height * this.id) + (10 * this.id)) + ")");

    /* We've created everything, let's actually add it to the page */
    this.chartContainer.append("path")
                            .data([this.data])
                            .attr("class", "chart")
                            .attr("clip-path", "url(#clip-" + this.id + ")")
                            .attr("d", this.area);

    this.xAxisTop = d3.svg.axis().scale(this.xScale).orient("bottom");
    this.xAxisBottom = d3.svg.axis().scale(this.xScale).orient("top");
    /* We only want a top axis if it's the first subject */
    if (this.showTopAxis) {
        this.chartContainer.append("g")
            .attr("class", "x axis top")
            .attr("transform", "translate(0,0)")
            .call(this.xAxisTop);
    }
    /* Only want a bottom axis on the last subject */
    if (this.showBottomAxis) {
        this.chartContainer.append("g")
            .attr("class", "x axis bottom")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxisBottom);
    }

    this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(5);

    this.chartContainer.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(-15,0)")
                        .call(this.yAxis);

    this.chartContainer.append("text")
                        .attr("class", "subject-title")
                        .attr("transform", "translate(15,40)")
                        .text(this.name);
}

function drawChart() {
    document.getElementById("js-chart-container").style.width = drawAreaWidth + "px";
    svg = d3.select("#js-chart-container").html("").append("svg")
        .attr("width", drawAreaWidth)
        .attr("height", drawAreaHeight);

    var charts = [];
    for (var i = 0; i < subjectsCount; i++) {
        charts.push(new Chart(chartsData[i]));
    }

    /* Let's create the context brush that will 
        let us zoom and pan the chart */
    var contextXScale = d3.time.scale()
        .range([0, contextWidth])
        .domain(charts[0].xScale.domain());

    var contextAxis = d3.svg.axis()
        .scale(contextXScale)
        .tickSize(contextHeight)
        .tickPadding(-10)
        .orient("bottom");

    var brush = d3.svg.brush()
        .x(contextXScale)
        .on("brush", onBrush);

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + contextOffsetLeft + "," + contextOffsetTop + ")");

    context.append("g")
        .attr("class", "x axis top")
        .attr("transform", "translate(0,0)")
        .call(contextAxis);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
            .attr("y", 0)
            .attr("height", contextHeight);

    context.append("text")
        .attr("class", "instructions")
        .attr("transform", "translate(0," + (contextHeight + contextLabelPaddingTop) + ")")
        .text("Click and drag above to zoom / pan the data");

    function onBrush() {
        /* this will return a date range to pass into the chart object */
        var b = brush.empty() ? contextXScale.domain() : brush.extent();
        for (var i = 0; i < subjectsCount; i++) {
            charts[i].showOnly(b);
        }
    }
}

Chart.prototype.showOnly = function(b) {
    this.xScale.domain(b);
    this.chartContainer.select("path").data([this.data]).attr("d", this.area);
    this.chartContainer.select(".x.axis.top").call(this.xAxisTop);
    this.chartContainer.select(".x.axis.bottom").call(this.xAxisBottom);
};
