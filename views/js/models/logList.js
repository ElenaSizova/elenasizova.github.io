/**
 * @module models/logList
 */
define("logList", ['jquery', 'underscore', 'Backbone','moment', 'logItem'],function($,_, Backbone,moment,LogItem){

    var selector = {
        list: 'log-list'
    }

    /**
     * log list view
     */
    var LogListView = Backbone.View.extend({
        initialize: function () {
            this.$el = $('.' + selector.list);
            this.listenTo(this.collection, 'add', this.addItem);
        },
        addItem: function (model) {
            this.$el.append(model.view.el);

            /**
             * fix for filtered
             * remove when the collection will be updated by filtering
             */
            if(this.collection.filtered && !model.get('mark'))
                model.view.$el.hide();
        }
    });

    /**
     * log item model
     * @arguments null
     */
    var LogList = Backbone.Collection.extend({
        model: LogItem,
        initialize: function(){

            this.view = new LogListView({collection: this});

            this.on('change:active', this.changeActiveHandler, this);
            $('body').on('click', _.bind(this.deactivateAll, this));

            this.load();
        },
        /**
         * fake function - load data from json file
         */
        load: function(){
            var self = this;

            $.getJSON("/data.json", function(data) {

                /* cache json */
                self.data = data;

                _.each(data, function(item){
                    item.dateTime = moment(item.time).format("lll");
                    item.variant = item.type == 'auth.attempt' ? (item.event.success ? 1 : 2) : 3;
                    item.mark = item.audit.suspicious;
                    self.add(item);
                });

                setInterval(_.bind(self.loadMore, self), 15000);
            });
        },
        /**
         * fake function - imitation real-time adding events
         */
        loadMore: function(){

            var model = this.data[_.random(0, this.data.length -1)];
            model.id = _.uniqueId();

            this.add(model);
        },
        changeActiveHandler: function (item, active, options) {
            if (active) {
                var otherItems = this.without(item);
                _.invoke(otherItems, 'deactivate');
            }
        },
        deactivateAll: function(){
            _.invoke(this.models, 'deactivate');
        },
        /**
         * fake function - filter collection list
         * must reset collection when filter was applied
         */
        filter: function(active) {
            this.filtered = active;

            if (active)
                _.each(this.models, function (item) {
                    if (item.get('mark') == false)
                        item.view.$el.hide();
                });
            else
                _.each(this.models, function (item) {
                    item.view.$el.show();
                });

        }
    });

    return LogList;
});