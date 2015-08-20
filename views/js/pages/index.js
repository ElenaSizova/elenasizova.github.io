/**
 * @module pages/index
 */
define("index", ['jquery', 'underscore', 'Backbone','logList'],function($,_, Backbone,LogList){


    var selector = {
        filter : 'filter-toggle-button'
    }

    var FilterView = Backbone.View.extend({
        events: {
            "click" : "clickHandler"
        },
        initialize: function(){

        },
        clickHandler: function(){
            this.model.toggle();
        }
    });

    /**
     * filter model
     *  @event filter
     */
    var FilterModel = Backbone.Model.extend({
        defaults: {
            active: false
        },
        initialize: function(){
            this.view = new FilterView({model: this, el: $('.' + selector.filter)});
        },
        activate: function () {
            this.set('active', true);
            return this;
        },
        deactivate: function () {
            this.set('active', false);
            return this;
        },
        toggle: function () {
            if (this.get('active')) this.deactivate();
            else this.activate();

            this.trigger('filter', this.get('active'));
        }
    });


    return  Backbone.Model.extend({
        initialize: function () {

            this.logList = new LogList(null);

            this.filterModel = new FilterModel();
            this.filterModel.on('filter', _.bind(this.filterLogList, this));
        },
        filterLogList: function(active){
            this.logList.filter(active);
        }
    });
});