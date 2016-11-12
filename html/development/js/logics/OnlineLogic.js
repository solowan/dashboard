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
 * Created by fhuertas on 5/08/15.
 */

// Constructor
var OnlineLogic = function (view) {
    this._view = view;
    this._connections = [];
    $('#'+OnlineLogic.HEADER_ID).text(this._view.title)
    var sortedKeys = Object.keys(this._view.connections).sort();
    for (var i = 0; i < sortedKeys.length; i++) {
        this._connections[i] = {}
        this._connections[i].url = this._view.connections[sortedKeys[i]].url;
        this._connections[i].ws = new WebSocket(this._connections[i].url);
        this._connections[i].description = this._view.connections[sortedKeys[i]].description
        this._connections[i].timeSeries = {}
        this._connections[i].valueLabels = {}

    }
    //onlineInitCharts();

    this._initCharts()
    this._startStreams()

    $(window).resize(this._resizeCanvas );
    this._resizeCanvas();
};

// Contants
OnlineLogic.HEADER_ID = "ov-title"
OnlineLogic.CANVAS_GRAPH_CLASS = "canvasGraph"

// Methods

OnlineLogic.prototype._initCharts = function () {
    for (var i = 0; i < this._connections.length;i++) {
        var connection = this._connections[i];
        //Object.each(descriptions, function(sectionName, values) {
        var section = $('.chart.' + TEMPLATE_CLASS).clone().removeClass(TEMPLATE_CLASS).appendTo('#charts');

        section.find('.title').text(connection.description.title);
        var smoothie = new SmoothieChart({
            millisPerPixel: 500,
            grid: {
                fillStyle: '#ffffff',
                sharpLines: true,
                verticalSections: 5,
                strokeStyle: 'rgba(243,191,191,0.45)',
                millisPerLine: 5000
            },
            minValue: 0,
            labels: {
                disabled: true
            }
        });

        smoothie.streamTo(section.find('canvas').get(0), 1000);

        var colors = ['#00cc00', '#ff8000', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'];
        var index = 0;
        Object.each(connection.description.values, function (name, value) {
            var color = colors[index++];
            var timeSeries = new TimeSeries();
            smoothie.addTimeSeries(timeSeries, {
                strokeStyle: color,
                fillStyle: chroma(color).darken().alpha(0.5).css(),
                lineWidth: 3
            });
            connection.timeSeries[value.id] = timeSeries;
            //allTimeSeries[name] = timeSeries;

            var statLine = section.find('.stat.template').clone().removeClass('template').appendTo(section.find('.stats'));
            statLine.attr('title', value.desc).css('color', color);
            statLine.find('.stat-name').text(value.id);
            //allValueLabels[name] = statLine.find('.stat-value');
            connection.valueLabels[value.id] = statLine.find('.stat-value');
        });
    }
}
OnlineLogic.prototype._startStreams = function () {
    for (var i = 0; i < this._connections.length;i++) {
        var connection =this._connections [i];
        connection.ws = new ReconnectingWebSocket(connection.url);
        connection.ws.connection = connection;
        connection.ws.onopen = function () {
            this.lineCount = 0;
        };

        connection.ws.onclose = function () {
        };

        connection.ws.onmessage = function (e) {
            switch (this.lineCount++) {
                case 0: // ignore first line
                    break;

                case 1: // column headings
                    this.colHeadings = e.data.trim().split(/ +/);
                    break;

                default: // subsequent lines
                    var colValues = e.data.trim().split(/ +/);
                    var stats = {};
                    for (var i = 0; i < this.colHeadings.length; i++) {
                        stats[this.colHeadings[i]] = parseInt(colValues[i]);
                    }

                    Object.each(stats, function (name, value) {
                        // Connection is not valid because this variable is modiffied, it is needed to access to the specific connection
                        if (this.connection.timeSeries[name]) {
                            this.connection.timeSeries[name].append(Date.now(), value);
                            this.connection.valueLabels[name].text(value);
                        }
                    }.bind(this));
            }
        };
    }
}
OnlineLogic.prototype._resizeCanvas = function (){
    //Get the canvas & context
    var c = $('.'+OnlineLogic.CANVAS_GRAPH_CLASS);
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();

    //Run function when browser  resize
    $.each(c, function(key, value){
        $(value).attr('width', $(value).parent().width() ); //max width
    })
}
