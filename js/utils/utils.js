(function (exports) {

    function createBin(start, end, size, eachBin) {
        var bin = {start, end, size};
        return (eachBin && (eachBin(bin) || bin)) || bin;
    }

    function priceIsInBinRange (price, bin) {
        price = Math.round(price * 100)/100;
        return bin.start <= price && price <= bin.end;
    }

    exports.getTickerData = function (ticker, data) {
        return data.filter(function (datum) {
            return datum.sym === ticker;
        });
    }

    exports.getBins = function (data, priceInterval, eachBin) {
        data = data.sort(function (datum1, datum2) {
            return datum1.price - datum2.price;
        });
        return data.reduce(function (bins, datum) {
            if (bins.length) {
                var lastBin = bins[bins.length - 1];
                if (priceIsInBinRange(datum.price, lastBin)) {
                    lastBin.size += datum.size;
                } else {
                    bins.push(createBin(datum.price, datum.price + priceInterval, datum.size, eachBin))
                }
            } else {
                bins.push(createBin(datum.price, datum.price + priceInterval, datum.size, eachBin))
            }
            return bins;
        }, []);
    }

})(window.utils = window.utils || {})