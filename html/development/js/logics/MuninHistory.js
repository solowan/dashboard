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
 * Created by fhuertas on 4/08/15.
 */

var MuninHistory = function (view) {
    // object parameters
    this._view = view;
    this._graphs = [];
    $("#"+MuninHistory.TITLE).text("History: "+this._view.title)
}

// Constants
MuninHistory.MH_MUNIN_PANEL = "mh-panel"
MuninHistory.MH_MUNIN_IMG_DIV_CLASS = "mh-panel"
MuninHistory.MH_MUNIN_IMG_CLASS = "mh-graph-img"
MuninHistory.TITLE = "mh-title"

// Methods
MuninHistory.prototype.loadGraphs = function () {
    var graphTemplate = $("."+MuninHistory.MH_MUNIN_PANEL+"."+TEMPLATE_CLASS)
    var parentGraphs = graphTemplate.parent()
    if (this._view.graphs != undefined) {
        var keys = Object.keys(this._view.graphs).sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var newGraph = {}
            newGraph.div = graphTemplate.clone().removeClass(TEMPLATE_CLASS);
            newGraph.options = this._view.graphs[key];
            newGraph.div.find(".panel-heading").text(newGraph.options.header);
            var imgDiv = $('<img/>',{
                src:newGraph.options.url+"?"+new Date().getTime(),
                alt:newGraph.options.header,
                class:MuninHistory.MH_MUNIN_IMG_CLASS
            })
            newGraph.div.find("."+MuninHistory.MH_MUNIN_IMG_DIV_CLASS).append(imgDiv);
            newGraph.reloadFunction = function (munin,timeout) {
                // newGraph context
                munin.reloadImage(this)
                setTimeout(this.reloadFunction.bind(this,munin,timeout), timeout);
            }
            this._graphs.push(newGraph);
            var timeout = newGraph.options.refresh_time*1000;
            newGraph.reloadFunction(this,timeout);
            var nChilds = parentGraphs.children('.'+MuninHistory.MH_MUNIN_PANEL).not('.'+TEMPLATE_CLASS).length;
            if (nChilds % 2 == 0){
                parentGraphs.append('<div class="clearfix"></div>');
            }
            parentGraphs.append(newGraph.div)
        }
    }
}

MuninHistory.prototype.reloadImage = function (graph) {
    graph.div.find('img').attr('src',graph.options.url+"?"+new Date().getTime())
}

