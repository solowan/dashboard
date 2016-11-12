/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * Created by fhuertas on 29/07/15.
 */
var MUNIN_HISTORY_PROPERTIES_URL = "props/views.properties"
var MUNIN_HISTORY_URL = "templates/munin.ejs"
var ONLINE_URL = "templates/online.ejs"
var STATISTICS_URL = "templates/statistics_online.ejs"
var MANAGEMENT_URL = "templates/management.ejs"


var app

var view_loaded = undefined;
var views = {}

views.index = {}
views.index.url = "templates/welcome.ejs"


views.munin_history = []
views.onlineView = []
views.statistic_online = []
views.management = []
viewsIndex = {}




var closeRoutine = undefined;


var addViewToList = function (view){
    switch (view.tag) {
        case MENU_REAL_TIME_TAG :
            views.onlineView.push(view);
            break;
        case MENU_HISTORICAL_DATA_TAG :
            views.munin_history.push(view);
            break;
        case MENU_STATISTICS_ONLINE_TAG :
            views.statistic_online.push( view);
            break;
        case MENU_MANAGEMENT_TAG :
            views.management.push(view);
            break;
    }

}

parsePropertiesUrl(MUNIN_HISTORY_PROPERTIES_URL,function (propertiesObject){
    var sortedKeys
    if (propertiesObject.munin_history != undefined) {
        sortedKeys = Object.keys(propertiesObject.munin_history).sort()
        for (var i = 0; i < sortedKeys.length; i++) {
            var view = propertiesObject.munin_history[sortedKeys[i]];
            view.id = sortedKeys[i];
            view.url = MUNIN_HISTORY_URL;
            //views.munin_history[i] =
            //views.munin_history[i].id =
            view.url = MUNIN_HISTORY_URL;
            if (view.tag == null){
                view.tag = MENU_HISTORICAL_DATA_TAG;
            }
            addViewToList(view);
            viewsIndex[sortedKeys[i]] = view;
        }
    }
    if (propertiesObject.online_view != undefined) {
        sortedKeys = Object.keys(propertiesObject.online_view).sort()
        for (var i = 0; i < sortedKeys.length; i++) {
            var view = propertiesObject.online_view[sortedKeys[i]];
            view.id = sortedKeys[i];

            view.url = ONLINE_URL;
            view.menu = propertiesObject.online_view[sortedKeys[i]].menu;
            view.title = propertiesObject.online_view[sortedKeys[i]].title;
            view.connections = propertiesObject.online_view[sortedKeys[i]].connections;
            if (view.tag == null){
                view.tag = MENU_REAL_TIME_TAG;
            }
            addViewToList(view);
            viewsIndex[sortedKeys[i]] = view
        }
    }

    if (propertiesObject.statistic_online != undefined) {
        sortedKeys = Object.keys(propertiesObject.statistic_online).sort()
        for (var i = 0; i < sortedKeys.length; i++) {

            var view = propertiesObject.statistic_online[sortedKeys[i]]

            view.id = sortedKeys[i]
            view.title = propertiesObject.statistic_online[sortedKeys[i]].title;
            view.menu = propertiesObject.statistic_online[sortedKeys[i]].menu;
            view.url = STATISTICS_URL;
            view.charts = propertiesObject.statistic_online[sortedKeys[i]].charts;
            if (view.tag == null){
                view.tag = MENU_STATISTICS_ONLINE_TAG;
            }
            addViewToList(view);
            viewsIndex[sortedKeys[i]] = view
        }
    }

    if (propertiesObject.management != undefined) {
        sortedKeys = Object.keys(propertiesObject.management).sort()
        for (var i = 0; i < sortedKeys.length; i++) {
            var view = propertiesObject.management[sortedKeys[i]]
            view.id = sortedKeys[i]
            view.url = MANAGEMENT_URL;
            //views.statistic_online[i] = propertiesObject.management[sortedKeys[i]]
            viewsIndex[sortedKeys[i]] = view;
            if (view.tag == null){
                view.tag = MENU_MANAGEMENT_TAG;
            }
            addViewToList(view);
            viewsIndex[sortedKeys[i]] = view
        }
    }
    load_menus(views)

    if (propertiesObject.default_view != undefined) {
        view_loaded = viewsIndex[propertiesObject.default_view]
        //setTimeout(change_view.bind(this,),200);
    }
    //configureAngular()
});


function change_view(view) {
    view_loaded = view;
}

var load_menus = function (views) {
    var historyDiv = $("#"+HISTORY_MENU_TAG_ID);
    var lineTemplate = historyDiv.find("li."+TEMPLATE_CLASS);
    historyDiv.empty();
    historyDiv.append(lineTemplate);

    //var sortedKeys;
    for (var i = 0; i < views.munin_history.length; i++) {
        var newLine = lineTemplate.clone().removeClass(TEMPLATE_CLASS);
        newLine.find("a").text(views.munin_history[i].menu)
        newLine.find("a").click(change_view.bind(this,views.munin_history[i]))
        historyDiv.append(newLine);

    }


    var onlineDiv = $("#"+ONLINE_MENU_TAG_ID); // especifica
    lineTemplate = historyDiv.find("li."+TEMPLATE_CLASS);
    onlineDiv.empty();
    onlineDiv.append(lineTemplate);
    for (var i = 0; i < views.onlineView.length;i++) { // especifica
        var newLine = lineTemplate.clone().removeClass(TEMPLATE_CLASS);
        newLine.find("a").text(views.onlineView[i].menu)
        newLine.find("a").click(change_view.bind(this,views.onlineView[i])) // especifica
        onlineDiv.append(newLine);
    }


    var statisticsDiv = $("#"+STATISTICS_MENU_TAG_ID);
    lineTemplate = statisticsDiv.find("li."+TEMPLATE_CLASS);
    statisticsDiv.empty();
    statisticsDiv.append(lineTemplate);
    for (var i = 0; i < views.statistic_online.length;i++) {
        var newLine = lineTemplate.clone().removeClass(TEMPLATE_CLASS);
        newLine.find("a").text(views.statistic_online[i].menu)
        newLine.find("a").click(change_view.bind(this,views.statistic_online[i]))
        statisticsDiv.append(newLine);
    }

    var management = $("#"+MANAGEMENT_MENU_TAG_ID );
    lineTemplate = management.find("li."+TEMPLATE_CLASS);
    management.empty();
    management.append(lineTemplate);
    for (var i = 0; i < views.management.length;i++) {
        var newLine = lineTemplate.clone().removeClass(TEMPLATE_CLASS);
        newLine.find("a").text(views.management[i].menu)
        newLine.find("a").click(change_view.bind(this,views.management[i]))
        management.append(newLine);
    }
};

app = angular.module('dashboard-app', []);
app.controller('dashboard-ctrl', function($scope) {
});

var viewSwitcher = function (view, $compile, $http, scope,element) {
    var oldInstance = scope._instance;
    if (oldInstance != undefined && oldInstance.closeRoutine != undefined) {
        setTimeout(function () {
            oldInstance.closeRoutine();
        },5000)
    }
    $("[id^='dropdown-so-context-menu-']").remove()
    var instance;
    $http.get(view.url).then(function (result) {
        element.empty();
        element.append($compile(result.data)(scope));
        switch (view_loaded.url) {
            case STATISTICS_URL:
                instance = new StatisticsOnline(view_loaded,scope);
                instance.loadCharts()
                closeRoutine = instance.closeRoutine.bind(instance);
                break;
            case MUNIN_HISTORY_URL:
                instance= new MuninHistory(view_loaded)
                instance.loadGraphs();
                break;
            case MANAGEMENT_URL:
                instance = new Management(view_loaded)
                break;
            case ONLINE_URL:
                instance = new OnlineLogic(view_loaded);
                break;
        }
        scope._instance = instance;

    });

}

app.directive('principalView',function ($compile,$http) {
    return {
        link: function (scope, element, attrs){
            setTimeout(function () {
                var url
                if (view_loaded == undefined) {
                    view_loaded = views.index;
                }
                viewSwitcher(view_loaded,$compile,$http,scope,element);
            },100)
            setTimeout(function (){
                $(".view-link").on('click',function (){
                    viewSwitcher(view_loaded,$compile,$http,scope,element);
                })
            },100)
        }
    }
})
