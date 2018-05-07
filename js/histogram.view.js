var HISTOGRAM_VIEW_TEMPLATE_SELECTOR = "#histogram-view-template";
var HISTOGRAM_SVG_SELECTOR = ".histogram";

var SIZE_ACCESSOR = (datum) => {
    return Number(datum.size);
};

var PRICE_ACCESSOR = (datum) => {
    return Number(datum.price);
}

function isInBinRange (bin) {
    return function (n) {
        return (bin.x0 <= n) && (bin.x1 >= n);
    }
}

function addSizeIfInRange (bin) {
    return function (totalSize, datum) {
        if (isInBinRange(bin)(PRICE_ACCESSOR(datum))) {
            totalSize += SIZE_ACCESSOR(datum);
        }
        return totalSize;   
    }
}

function HistogramView(margin) {
    this.el = document.importNode(document.querySelector(HISTOGRAM_VIEW_TEMPLATE_SELECTOR).content, true).children[0];
    this.el.querySelector(".label-text").innerText = margin.label;
    this.svg = this.el.querySelector(HISTOGRAM_SVG_SELECTOR);
    this.margin = margin;
    this.d3Svg = d3.select(this.svg);
    this.d3chart = this.d3Svg.append("g")
    .attr("transform", "translate(" + this.margin.left + ", "+ this.margin.top+")");
    this._data = null;
}

HistogramView.prototype.createXAxis = function () {
    var data = this._data;
    var SVG_WIDTH = this.svg.getClientRects()[0].width;
    var SVG_HEIGHT = this.svg.getClientRects()[0].height;
    var chartHeight = SVG_HEIGHT - this.margin.bottom - this.margin.top;
    var xscale = this.xScale = d3.scaleLinear().domain([0, d3.max(data, SIZE_ACCESSOR)])
        .range([0, SVG_WIDTH - this.margin.right - this.margin.left]);
    var xAxis = d3.axisBottom(xscale)
    this.d3chart.append("g").attr("class", "x-axis").call(xAxis)
        .attr("transform", "translate(0," + chartHeight + ")")
}

HistogramView.prototype.createYAxis = function () {
    var data = this._data;
    var SVG_WIDTH = this.svg.getClientRects()[0].width;
    var SVG_HEIGHT = this.svg.getClientRects()[0].height;
    var chartHeight = SVG_HEIGHT - this.margin.bottom - this.margin.top;
    var yscale = this.yScale = d3.scaleBand()
        .domain(d3.merge(data.map((d) => [d.start, d.end])))
        .range([chartHeight, 0]);
        // .range().round(0.01);
    var yAxis = d3.axisLeft(yscale)
    this.d3chart.append("g").attr("class", "y-axis").call(yAxis);
}

HistogramView.prototype.draw = function (data) {
    var self = this;
    var SVG_WIDTH = this.svg.getClientRects()[0].width;
    var SVG_HEIGHT = this.svg.getClientRects()[0].height;
    
    this._data = data;

    console.log(data);
    this.createYAxis();
    this.createXAxis();

    var bars = this.d3chart.selectAll(".bar")
        .data(data)
        .enter().append("g").attr("class", "bar")
        .attr("transform", function (d) {
            return "translate(" + 0 +", " + self.yScale(d.end)+ ")";
        })

    bars.append("rect").attr("class", "rect-bar").attr("x", 0).attr("height", function (d) {     
        return self.yScale(d.start) - self.yScale(d.end);
    }).attr("y", function () {
        return d3.select(this).attr("height")/2;
    }).attr("width", function (d) { return 0; }).transition().duration(750).attr("width", function (d) {
        return self.xScale(d.size);
    });

}