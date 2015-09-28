$(document).ready(function () {

    var v = {
        fullHeight: 500,
        fullWidth: 1100,
        height: 470, // высоты графика
        width: 1035, // ширина графика,
        topOffset: 30,
        rightOffset: 65
    }

    var paper = Raphael($('.production-graph-container').get(0), v.fullWidth, v.fullHeight);

    /*******
     * horizontal
     */
    for (var i = 0; i < 7; i++) {
        var path = paper.path("M0,0,1035,0z");
        path.translate(0, v.height / 6 * i + v.topOffset);
        path.attr("stroke", "#696d71");
    }

    /*******
     * vertical
     */
    for (var i = 0; i < 16; i++) {
        var path = paper.path("M0,0,0,470z");
        path.translate(v.width / 15 * i, v.topOffset);
        path.attr("stroke", "#393e42");
    }

    $.getJSON("production.json", function (data) {

        _.each(data, function (item, index) {
            addColumn(index, item.production, item.consumption);
        });
    });

    function addColumn(index, production, consumption) {


        // оставляем 60px, чтобы умещался tooltip справа
        var startX = index * 50 + index * (v.width - 15 * 50) / 14;
        var consumptionHeight = v.height * consumption / 60000;
        var productionHeight = v.height * production / 60000;

        var consumeEl = paper.rect(startX, v.fullHeight - consumptionHeight, 30, consumptionHeight);
        consumeEl.attr("fill", "#b6b6b6");
        consumeEl.attr("stroke", "#41474c");

        var productionEl = paper.rect(startX + 20, v.fullHeight - productionHeight, 30, productionHeight);
        productionEl.attr("fill", "#e6e6e6");
        productionEl.attr("stroke", 0);
        productionEl.toFront();
        productionEl.glow({color: "#41474c", width: 10, opacity: 0.5, offsety: 7});

        (function (production, value) {
            production.hover(function () {
                    var x = production.getBBox().x;
                    var y = production.getBBox().y;

                    this.tooltip = new Tooltip(x, y, value);
                    this.tooltip.show();

                    production.animate({"fill": "#f01a1a"}, 200);
                },
                function () {

                    this.tooltip.hide();
                    production.animate({"fill": "#e6e6e6"}, 200);
                });
        })(productionEl, production);

        (function (consume, value) {
            consume.hover(function () {
                    var x = consume.getBBox().x;
                    var y = consume.getBBox().y;

                    this.tooltip = new Tooltip(x, y, value);
                    this.tooltip.show();

                    consume.animate({"fill": "#f01a1a"}, 200);
                },
                function () {
                    this.tooltip.hide();
                    consume.animate({"fill": "#b6b6b6"}, 200);
                });
        })(consumeEl, consumption);
    }

    function Tooltip(x, y, value) {
        this.x = x;
        this.y = y;
        this.text = value;
    }

    Tooltip.prototype = {
        show: function () {

            var x = this.x;
            var y = this.y;

            var tooltip = this.tooltip = paper.rect(x + 1, y - 60, 100, 30);
            tooltip.attr("fill", "#ff2222");
            tooltip.attr("stroke", "#ff2222");

            var path = this.path = paper.path("M0,0,15,0,0,10z");
            path.translate(x + 1, y - 30);
            path.attr("fill", "#ca0505");
            path.attr("stroke", "#ca0505");

            this.text = paper.text(x + 50, y - 46, this.text)
                .attr({fill: '#ffffff', "font-family": "Open Sans", "font-size": "22px"});
        },
        hide: function () {
            this.tooltip.remove();
            this.path.remove();
            this.text.remove();
        }
    }

});
