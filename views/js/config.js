
requirejs.config({
    baseUrl: '/bower_components',
    paths: {
        "jquery" : "jquery/dist/jquery.min",
        "underscore" : "underscore/underscore-min",
        "Backbone" : "backbone/backbone-min",
        "moment": "moment/min/moment.min",
        "index": "/views/js/pages/index",
        "logItem": "/views/js/models/logItem",
        "logList": "/views/js/models/logList"
    }
});


require(['jquery','index'],function($,IndexPage){

    $(document).ready(function(){
        var page = new IndexPage({});
    });

});