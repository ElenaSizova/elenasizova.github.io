$(document).ready(function () {

    var color = {
        continent: {
            fill: "#d20d0d",
            stroke: "#a32628",
        },
        circle: {
            fill: "#e5e5e5",
            text: "7b7e83",
            hover: {
                fill: "#d40e0f",
                text: "#ffffff"
            }
        }
    };

    function Continent(map, data, name){

        this.paths = [];
        this.name = name;

        this.init(map, data);
    }

    Continent.prototype = {
        init: function(map, data){

            var self = this;
            var paths = data[this.name];
            _.each(paths, function(path) {

                var path = map.path(path);
                path.attr("fill", color.continent.fill);
                path.attr("stroke", color.continent.stroke);
                path.attr("opacity", 0);

                self.paths.push(path);
            });
        },
        show: function(){
            _.each(this.paths, function(path){
                path.animate({"opacity": 0.5}, 100);
            });
        },
        hide: function(){
            _.each(this.paths, function(path){
                path.animate({"opacity": 0}, 100);
            });
        }
    };

    function Label(name, fullName){
        this.name = name;
        this.fullName = fullName;
    }

    Label.prototype = {
        init: function(x, y, r, map,data){
            var self = this;

            this.continent =  new Continent(map,data, this.name);

            var circle = map.circle(x, y, r);
            circle.attr("fill",color.circle.fill);
            circle.attr("stroke", 0);
            circle.toFront();
            circle.glow({color: "#41474c", width: 5, opacity: 0.5, offsety: 2.5});

            this.value = map.text(x, y, "4,56")
                .attr({fill: color.circle.text,
                    "font-family": "Open Sans", "font-size": "15.6px", "font-weight": 600});

            this.title = map.text(x, y-5, this.fullName)
                .attr({fill: color.circle.hover.text, "opacity" : 0,
                    "font-family": "Open Sans", "font-size": "13px", "font-weight": 400});

            var elementSet = map.set();
            elementSet.push(circle);
            elementSet.push(this.value);
            elementSet.push(this.title);

            elementSet.attr('cursor','pointer');

            elementSet.hover(function () {
                    var x = circle.getBBox().x;
                    var y = circle.getBBox().y;

                    self.continent.show();
                    self.title.attr({"opacity" : 1});
                    self.value.translate(0, 25).attr({fill: color.circle.hover.text});

                    circle.animate({"fill": color.circle.hover.fill}, 100);
                },
                function () {
                    self.continent.hide();
                    self.title.attr({"opacity" : 0});
                    self.value.translate(0, -25).attr({fill: color.circle.text});
                    circle.animate({"fill": color.circle.fill}, 100);
                });

        },

        update: function(current){
            var value = current[this.name];
            this.value.attr({"text" : value});
        }
    }

    function Map(){
        this.year = "2014";
        this.type = "type1";
        this.labels = [];
        this.init();
    }

    Map.prototype = {

        init: function(){

            var self = this;
            var map = Raphael($('.map-graph').get(0), 1570, 724);

            $.getJSON("map.json", function (data) {
                $.getJSON("values.json", function (values) {

                    self.values = values;

                    var nordAmerica = new Label('nordAmerica', 'Северная \n Америка');
                    nordAmerica.init(330, 185, 47, map, data);
                    self.labels.push(nordAmerica);

                    var southAmerica = new Label('southAmerica', 'Центральная \n и Южная \n Америка');
                    southAmerica.init(530, 450, 50.5, map, data);
                    self.labels.push(southAmerica);

                    var africa = new Label('africa', 'Африка');
                    africa.init(730, 360, 40, map, data);
                    self.labels.push(africa);

                    var europe = new Label('europe', 'Европа');
                    europe.init(930, 170, 45, map, data);
                    self.labels.push(europe);

                    var azia = new Label('azia', 'Азия');
                    azia.init(1180, 300, 52, map, data);
                    self.labels.push(azia);

                    var australia = new Label('australia', 'Австралия');
                    australia.init(1350, 530, 37.5, map, data);
                    self.labels.push(australia);

                    $('.map-type-item').on('click', function () {
                        $('.map-type-item').removeClass('active');
                        $(this).addClass('active');

                        self.type = $(this).attr('data-type');
                        self.updateLabels();
                    });

                    $('.map-years-prev').on('click', function () {
                        var $items = $('.map-years-items');
                        var margin = parseInt($items.css('margin-right'));

                        if (margin == -750)
                            return;

                        $items.animate({
                            marginRight: (margin - 75 * 5) + 'px'
                        }, 300);
                    });

                    $('.map-years-next').on('click', function () {
                        var $items = $('.map-years-items');
                        var margin = parseInt($items.css('margin-right'));

                        if (margin == 0)
                            return;

                        $items.animate({
                            marginRight: (margin + 75 * 5) + 'px'
                        }, 300);
                    });

                    $('.map-years-items-item').on('click', function () {
                        $('.map-years-items-item').removeClass('active');
                        $(this).addClass('active');

                        self.year = $(this).attr('data-year');
                        self.updateLabels();
                    });

                    self.updateLabels();
                });

            });
        },

        updateLabels: function(){

            var current = this.values[this.type][this.year];

            _.each(this.labels, function(label){
                label.update(current);
            });

        }
    }


    var map = new Map();

});