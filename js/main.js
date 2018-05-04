var MAIN_DIV_SELECTOR = "#main";
var TICKER_SELECT = "#ticker-select";
var HISTOGRAM_SELECTOR = ".histogram-c";
var INCREMENT_RANGE_SELECTOR = "#increment-range";
var INCREMENT_VALUE_SELECTOR = "#increment-value";
var TIME_INPUT_SELECTOR = ".time-input";


function createHistogram (ticker, data) {
    d3.select(HISTOGRAM_SELECTOR).remove();
    var startTime = getStartTime(),
        endTime = getEndTime();
    data = data.filter(function (datum) {
        // console.log("startTime ::: ", startTime, datum.time, endTime)
        return startTime <= datum.time && datum.time <= endTime;
    });
    console.log(data);
    var bins = utils.getBins(utils.getTickerData(ticker, data), getIncreamentValue());
    var histogram = new HistogramView({ left: 100, right: 100, top: 100, bottom: 100 });
    document.querySelector(MAIN_DIV_SELECTOR).appendChild(histogram.el);
    histogram.draw(bins);
}

function sheduleHistogramDraw (ticker, data) {
    return setTimeout(() => { createHistogram(ticker, data); }, 1000);
}

function getIncreamentValue () {
    return document.querySelector(INCREMENT_RANGE_SELECTOR).value/100;
}

function prefixZero (number) {
    return (+number%10 === +number) ? "0"+(+number) : number;
}

function getStartTime () {
    var HOUR = document.querySelector("#start-hour").value;
    var MIN = document.querySelector("#start-min").value;
    var SEC = document.querySelector("#start-sec").value;
    var MSEC = document.querySelector("#start-m-sec").value;
    console.log([[HOUR, MIN, SEC].join(":"), MSEC].join("."))
    return date.parse([[prefixZero(HOUR), prefixZero(MIN), prefixZero(SEC)].join(":"), MSEC].join("."), 'hh:mm:ss.SSS');
}

function getEndTime () {
    var HOUR = document.querySelector("#end-hour").value;
    var MIN = document.querySelector("#end-min").value;
    var SEC = document.querySelector("#end-sec").value;
    var MSEC = document.querySelector("#end-m-sec").value;
    return date.parse([[prefixZero(HOUR), prefixZero(MIN), prefixZero(SEC)].join(":"), MSEC].join("."), 'hh:mm:ss.SSS');
}

document.addEventListener('DOMContentLoaded', function (event) {
    var selectElement = document.querySelector(TICKER_SELECT);
    var incrementRange = document.querySelector(INCREMENT_RANGE_SELECTOR);
    var defaultTicker = selectElement.options[selectElement.selectedIndex || 0].value;

    d3.csv("data/SampleTrades.csv", function (d) {
        return {
            time: date.parse(d.time, 'hh:mm:ss.SSS'), // convert "Year" column to Date
            sym: d.sym,
            price: +d.price,
            size: +d.size
        };
    }).then(function (data) {
        console.log(data);
        var timer = null;
        createHistogram(defaultTicker, data);
        selectElement.addEventListener("change", function () {
            createHistogram(selectElement.options[selectElement.selectedIndex].value, data);
        });
        incrementRange.addEventListener("input", function () {
            if (timer) { clearTimeout(timer); }
            document.querySelector(INCREMENT_VALUE_SELECTOR).innerText = incrementRange.value/100;
            timer = sheduleHistogramDraw(selectElement.options[selectElement.selectedIndex].value, data, timer)
        });
        document.querySelectorAll(TIME_INPUT_SELECTOR).forEach(function (el) {
            el.addEventListener("input", function () {
                if (timer) { clearTimeout(timer); }
                timer = sheduleHistogramDraw(selectElement.options[selectElement.selectedIndex].value, data, timer)
            })
        })
    })
     
});