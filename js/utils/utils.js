(function (exports) {

    function createBin (start, end, size) {
        return {start, end, size};
    }

    function priceIsInBinRange (price, bin) {
        return bin.start <= price && price <= bin.end;
    }

    exports.getTickerData = function (ticker, data) {
        return data.filter(function (datum) {
            return datum.sym === ticker;
        });
    }

    exports.getBins = function (data, priceInterval) {
        data = data.sort(function (datum1, datum2) {
            return datum1.price - datum2.price;
        });
        return data.reduce(function (bins, datum) {
            if (bins.length) {
                var lastBin = bins[bins.length - 1];
                if (priceIsInBinRange(datum.price, lastBin)) {
                    lastBin.size += datum.size;
                } else {
                    bins.push(createBin(datum.price, datum.price + priceInterval, datum.size))
                }
            } else {
                bins.push(createBin(datum.price, datum.price + priceInterval, datum.size))
            }
            return bins;
        }, []);
    }

})(window.utils = window.utils || {})