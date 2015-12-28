/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (c3) {
    var KLASS;

    KLASS = {
        chartErrorBars: 'chart-error-bars',
        chartErrorBar: 'chart-error-bar',
        errorLine: 'error-bar-line'
    };
    
    var errorBarY;

    errorBarY = function ($$, d, sign) {
        var error, ref, ref1;
        error = ((ref = $$.config.data_errors) !== null ? (ref1 = ref[d.id]) !== null ? ref1[d.index] : void 0 : void 0) || 0;
        return $$.getYScale(d.id)(d.value + sign * error);
    };

    var errorBarPoints;

    errorBarPoints = function (d, index) {
        var $$, barIndices, bottom, center, getPoints, height, left, lowerErrorBarY, points, right, top, upperErrorBarY, width, y0, yScale;
        $$ = this;
        barIndices = $$.getShapeIndices($$.isBarType);
        getPoints = $$.generateGetBarPoints(barIndices);
        points = getPoints(d, d.index);
        left = points[0][0];
        right = points[2][0];
        top = points[1][1];
        bottom = points[0][1];
        width = right - left;
        height = bottom - top;
        center = (left + right) / 2;
        upperErrorBarY = errorBarY($$, d, -1);
        lowerErrorBarY = errorBarY($$, d, 1);
        yScale = $$.getYScale;
        y0 = yScale.call($$, d.id)(0);
        return [upperErrorBarY, lowerErrorBarY, center - width / 5, center + width / 5, center][index];
    };


    var errorBarLinePointX1, errorBarLinePointX2, errorBarLinePointY1, errorBarLinePointY2, errorBarLinePoints,
            slice = [].slice;

    errorBarLinePoints = {
        top: [2, 3, 1, 1],
        vertical: [4, 4, 0, 1],
        bottom: [2, 3, 0, 0]
    };

    errorBarLinePointX1 = function (d) {
        return errorBarPoints.call(this, d.data, errorBarLinePoints[d.location][0]);
    };

    errorBarLinePointX2 = function (d) {
        return errorBarPoints.call(this, d.data, errorBarLinePoints[d.location][1]);
    };

    errorBarLinePointY1 = function (d) {
        return errorBarPoints.call(this, d.data, errorBarLinePoints[d.location][2]);
    };

    errorBarLinePointY2 = function (d) {
        return errorBarPoints.call(this, d.data, errorBarLinePoints[d.location][3]);
    };

    c3.chart.internal.fn.redrawBar = _.wrap(c3.chart.internal.fn.redrawBar, function (f, durationForExit) {
        var $$, barData, barIndices, errorBar, getPoints, lines;
        f.apply(this, [durationForExit]);
        $$ = this;
        barData = $$.barData.bind($$);
        barIndices = $$.getShapeIndices($$.isBarType);
        getPoints = $$.generateGetBarPoints(barIndices);
        errorBar = $$.main.selectAll('.' + c3.chart.internal.fn.CLASS.bars).selectAll('.' + KLASS.chartErrorBar).data(function (d) {
            var ref;
            if (((ref = $$.config.data_errors[d.id]) !== null ? ref.length : void 0) > 0) {
                return barData(d);
            } else {
                return [];
            }
        });
        errorBar.enter().append('g').attr('class', function (d) {
            return [KLASS.chartErrorBar, KLASS.chartErrorBar + "-" + d.id + "-" + d.index].join(' ');
        });
        errorBar.exit().transition().duration(durationForExit).style('opacity', 0).remove();
        lines = errorBar.selectAll('.' + KLASS.errorLine).data(function (d) {
            return Object.keys(errorBarLinePoints).map(function (location) {
                return {
                    data: d,
                    location: location
                };
            });
        });
        lines.enter().append('line').attr('class', function (d) {
            return [KLASS.errorLine, KLASS.errorLine + "-" + d.location + "-" + d.data.id + "-" + d.data.index].join(' ');
        }).attr('x1', _.bind(errorBarLinePointX1, $$)).attr('x2', _.bind(errorBarLinePointX2, $$)).attr('y1', _.bind(errorBarLinePointY1, $$)).attr('y2', _.bind(errorBarLinePointY2, $$));
        return lines.exit().transition().duration(durationForExit).style('opacity', 0).remove();
    });

    c3.chart.internal.fn.addTransitionForBar = _.wrap(c3.chart.internal.fn.addTransitionForBar, function (f, transitions, drawBar) {
        var $$;
        $$ = this;
        transitions.push($$.main.selectAll('.' + c3.chart.internal.fn.CLASS.bars).selectAll('.' + KLASS.errorLine).attr('x1', _.bind(errorBarLinePointX1, $$)).attr('x2', _.bind(errorBarLinePointX2, $$)).attr('y1', _.bind(errorBarLinePointY1, $$)).attr('y2', _.bind(errorBarLinePointY2, $$)).style("fill", $$.color).style("opacity", 1));
        return f.call(this, transitions, drawBar);
    });

    c3.chart.internal.fn.getDefaultConfig = _.wrap(c3.chart.internal.fn.getDefaultConfig, function () {
        var args, f;
        f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return _.merge(f.apply(this, args), {
            data_errors: {}
        });
    });

    c3.chart.internal.fn.tooltipPosition = function (data, width, height, element) {
        var $$, center, chartOffsetX, circles, graphOffsetX, tooltipLeft, tooltipWidth, x, y;
        $$ = this;
        if (element instanceof SVGRectElement) {
            y = errorBarY($$, data[0], 1);
            center = errorBarPoints.call($$, 4, data[0]);
            tooltipLeft = $$.getCurrentPaddingLeft();
            x = Math.round(center + tooltipLeft - width / 2);
            y -= height + 10;
        } else {
            if (!(element instanceof SVGCircleElement)) {
                circles = this.getCircles(data[0].index);
                element = circles[0][0];
            }
            chartOffsetX = document.querySelector($$.config.bindto).getBoundingClientRect().left;
            graphOffsetX = document.querySelector($$.config.bindto + " g.c3-axis-y").getBoundingClientRect().right;
            tooltipWidth = document.getElementById('tooltip').parentNode.clientWidth;
            x = parseInt(element.getAttribute('cx')) + graphOffsetX - chartOffsetX - Math.floor(tooltipWidth / 2);
            y = element.getAttribute('cy');
            y = y - height - 12;
        }
        return {
            top: y,
            left: x
        };
    };

    c3.chart.internal.fn.getYDomainMax = _.wrap(c3.chart.internal.fn.getYDomainMax, function (f, targets) {
        var $$, data, i, j, k, len, v, ys;
        $$ = this;
        if ($$.config.data_groups.length > 0) {
            console.warn("this extension breaks data.groups.");
        }
        ys = $$.getValuesAsIdKeyed(targets);
        for (k in ys) {
            data = ys[k];
            if (!(k in $$.config.data_errors)) {
                continue;
            }
            for (i = j = 0, len = data.length; j < len; i = ++j) {
                v = data[i];
                if ($$.config.data_errors[k][i]) {
                    data[i] += $$.config.data_errors[k][i];
                }
            }
        }
        return $$.d3.max(Object.keys(ys).map(function (key) {
            return $$.d3.max(ys[key]);
        }));
    });
})(c3);