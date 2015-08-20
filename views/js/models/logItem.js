/**
 * @module models/logItem
 */
define("logItem", ['jquery', 'underscore', 'Backbone'],function($,_, Backbone){

    /**
     * selector objects
     */
    var selector = {
        el: 'collapsible-item',
        header: 'collapsible-item-header',
        body: 'collapsible-item-body',
        mark: 'collapsible-item-header-mark'
    }

    /**
     * log item view
     */
    var LogView = Backbone.View.extend({
        className: selector.el,
        events: {
            "click .collapsible-item-header"  : "toggle",
            "click .collapsible-item-header-mark"  : "mark",
            "click .collapsible-item-body"  : "stopPropagation"
        },
        template: _.template($("#log_item_template").html()),
        initialize: function(){
            this.model.on('change:active', this.changeActiveHandler, this);
            this.model.on('change:mark', this.changeMarkHandler, this);
            this.render();
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            this.cacheElements();
            return this;
        },
        /**
         *  cache DOM elements for use it in future
         */
        cacheElements: function(){
            this.$mark = this.$el.find('.' + selector.mark);
        },
        changeActiveHandler: function (item, active, options) {
            this.$el.toggleClass('active', active)
        },
        changeMarkHandler: function (item, mark, options) {
            this.$mark.toggleClass('active', mark)
        },
        toggle: function(ev){
            ev.stopPropagation();
            this.model.toggle();
        },
        mark: function(ev){
            ev.stopPropagation();
            this.model.mark();
        },
        stopPropagation: function(ev){
            ev.stopPropagation();
        }
    });

    /**
     * log item model
     * @arguments logItem model attributes
     *
     * may be need deep model or with object property audit and event
     */
    var LogItem = Backbone.Model.extend({
        defaults: {
            id: null,
            /**
             * active in collapsible tree
             * @name LogItem~active
             * @type Boolean
             */
            active: false,
            /**
             * mark as suspicious
             * @name LogItem~mark
             * @type Boolean
             */
            mark: false,
            /**
             * date presented in correct format
             * @name LogItem~dateTime
             * @type String
             */
            dateTime: "",
            /**
             * type of log - need to css icons
             * @name LogItem~variant
             * @type String
             */
            variant: null
            /**
             *  other attributes ...
             */
        },
        initialize: function () {

            this.view = new LogView({
                model: this
            });
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
        },
        mark: function(){
            /**
             * may be save there mark attrubite to server ?
             */

            if (this.get('mark')) this.set('mark', false);
            else this.set('mark', true);
        }
    });

    return LogItem;

});