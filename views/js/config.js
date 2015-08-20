
requirejs.config({
    baseUrl: '/audit/bower_components',
    paths: {
        "jquery" : "jquery/dist/jquery.min",
        "underscore" : "underscore/underscore-min",
        "Backbone" : "backbone/backbone-min",
        "moment": "moment/min/moment.min",
        "index": "/audit/views/js/pages/index",
        "logItem": "/audit/views/js/models/logItem",
        "logList": "/audit/views/js/models/logList"
    }
});


require(['jquery','index'],function($,IndexPage){

    $(document).ready(function(){
        var page = new IndexPage({});
    });

});