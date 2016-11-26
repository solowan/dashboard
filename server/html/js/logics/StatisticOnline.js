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
 * Created by fhuertas on 6/08/15.
 */
{
    var StatisticsOnline = function (view,scope) {
        this._view = view;
        this._charts = [];
        this._xaxisformat = StatisticsOnline.XAXIS_FORMAT_DIFFERENCE;
        this._default_time     = (this._view.time != undefined)?this._view.time:StatisticsOnline.DEFAULT_TIME;
        this._default_offset   = StatisticsOnline.DEFAULT_TIME_OFFSET;
        this._ticks_separation = (this._view.ticks_separation != undefined)?this._view.ticks_separation:StatisticsOnline.DEFAULT_TICKS_SEPARATION;
        this._deafult_max      = (this._view.max != undefined)?this._view.max:StatisticsOnline.YAXIS_DEFAULT_MAX;
        this._deafult_min      = (this._view.min != undefined)?this._view.min:StatisticsOnline.YAXIS_DEFAULT_MIN;
        this._deafult_mark     = (this._view.mark != undefined)?this._view.mark:StatisticsOnline.YAXIS_DEFAULT_MARK;
        this._default_flex_hight = (this._view.flex_height != undefined)?this._view.flex_height:StatisticsOnline.DEFAULT_FLEX_HIGHT;
        this._default_commands = this._view.commands;
        this._default_command_install = this._view.command_install;

        var sortedKeys = Object.keys(this._view.charts).sort();
        for (var i = 0; i < sortedKeys.length; i++) {

            var xaxisformat = this._xaxisformat;
            var description = this._view.charts[sortedKeys[i]];
            if (description.max == undefined) {description.max = this._deafult_max;}
            if (description.min == undefined) {description.min = this._deafult_min;}
            if (description.graph_time == undefined) {description.graph_time = this._default_time;}
            if (description.offset == undefined) {description.offset = this._default_offset;}
            if (description.mark == undefined){description.mark = this._deafult_mark};
            if (description.ticks_separation == undefined) {description.ticks_separation = this._ticks_separation;}
            if (description.flex_height == undefined) {description.flex_height = this._default_flex_hight;}
            if (description.commands == undefined) {
                description.commands = this._default_commands;
            } else {
                for (var varname in this._default_commands) {
                    if (description.commands[varname] == undefined) {
                        description.commands[varname] = this._default_commands[varname];
                    }
                }

            }
            if (description.command_install == undefined) {description.command_install = this._default_command_install;}


            /*Setting graph options*/

            var chart = new Chart(sortedKeys[i], description,xaxisformat);

            this._charts.push(chart);
        }
        scope.title = this._view.title
        //$("#" + StatisticsOnline.HEADER_ID).text(this._view.title);

        // There are commands?
        if (this._view.available_commands != undefined &&  this._view.available_commands) {
            this.commands();
        }
    };

    StatisticsOnline.prototype.closeRoutine = function () {
        // terminate all threads.
        this._forcedClose = true;
        this._charts.forEach(function (chart) {
            chart.closeWS();
        })

    }


    StatisticsOnline.HEADER_ID = "so-title"
    StatisticsOnline.GRAPH_CLASS = "so-graph-div"
    StatisticsOnline.GRAPH_ID = "so-graph-div-"
    StatisticsOnline.GRAPH_MENU_ID = "so-graph-menu-"
    StatisticsOnline.GRAPH_MENU_CLASS = "so-graph-menu"
    StatisticsOnline.GRAPH_MENU_CSS_TITLE = "so-menu-title"
    StatisticsOnline.GRAPHS_CONTAINER_ID = "so-graphs"
    StatisticsOnline.GRAPTH_TITLE_CLASS = "so-graph-title"
    StatisticsOnline.GRAPTH_LEGEND_CLASS = "so-legend"
    StatisticsOnline.GRAPTH_LEGEND_ENTRY_CLASS = "so-legend-entry"
    StatisticsOnline.GRAPTH_LEGEND_ENTRY_KEY_CLASS = "so-graph-legend-key"
    StatisticsOnline.GRAPTH_LEGEND_ENTRY_VALUE_CLASS = "so-graph-legend-value"
    StatisticsOnline.YAXIS_LABEL_CLASS= "so-axis-label"
    StatisticsOnline.LEGEND_PREFIX = "so-";
    StatisticsOnline.DEFAULT_TIME = "120000"
    StatisticsOnline.DEFAULT_TIME_OFFSET = "1000"
    StatisticsOnline.DEFAULT_TICKS_SEPARATION = "20000"
    StatisticsOnline.CONTEXT_MENU_GRAPH_ID = "so-context-menu-legend-"
    StatisticsOnline.CONTEXT_MENU_LEYEND_ID = "so-context-menu-graph-"
    StatisticsOnline.IP1 = "so-ip1"
    StatisticsOnline.IP2 = "so-ip2"
    StatisticsOnline.PORT1 = "so-port1"
    StatisticsOnline.PORT2 = "so-port2"
    StatisticsOnline.TCP_UDP = "so-tcp-udp"
    StatisticsOnline.BUTTON_BUTTON = "so-button"
    StatisticsOnline.COMMAND_INTERFACE = "so-command-interface"

    StatisticsOnline.XAXIS_FORMAT_DIFFERENCE = 0
    StatisticsOnline.XAXIS_FORMAT_DATE = 1

    StatisticsOnline.YAXIS_DEFAULT_MAX = 20
    StatisticsOnline.YAXIS_DEFAULT_MIN = 0
    StatisticsOnline.YAXIS_DEFAULT_MARK = 10
    StatisticsOnline.DEFAULT_FLEX_HIGHT = false;

    StatisticsOnline.FLOOT_CONTAINER_CLASS = "so-flot-element"

    StatisticsOnline.prototype.loadCharts = function () {
        for (var i = 0; i < this._charts.length; i++) {
            this._charts[i].loadChart()
        }
        $(window).resize(function (){
            var template = $("."+StatisticsOnline.GRAPH_CLASS+"."+TEMPLATE_CLASS).clone();
            $("."+StatisticsOnline.GRAPH_CLASS).remove();
            $("#"+StatisticsOnline.GRAPHS_CONTAINER_ID).append(template);
            for (var i = 0; i < this._charts.length; i++) {
                var series = {series: this._charts[i].series, seriesByKey: this._charts[i].seriesByKey}
                this._charts[i].loadChart();
            }
        }.bind(this))
    }

    StatisticsOnline.prototype.commands = function (){
        $("#"+StatisticsOnline.COMMAND_INTERFACE).css('display',"");
        $("#"+StatisticsOnline.BUTTON_BUTTON).click(function () {
            var ip1 = $("#"+StatisticsOnline.IP1).val();
            var ip2 = $("#"+StatisticsOnline.IP2).val();
            var port1 = $("#"+StatisticsOnline.PORT1).val();
            var port2 = $("#"+StatisticsOnline.PORT2).val();
            var protocol = $("#"+StatisticsOnline.TCP_UDP).val();
            this._charts.forEach(function (chart) {
                command = [];
                if (chart._description.command_install != undefined) {
                    command.push({command: chart._description.command_install + " ip1="+ip1+ " ip2="+ip2+ " port1="+port1 +" port2="+port2 + " protocol=" + protocol});
                }

                for (var varname in chart._description.commands) {
                    command.push({var: varname, command: chart._description.commands[varname]+ " ip1="+ip1+ " ip2="+ip2+ " port1="+port1 +" port2="+port2 + " protocol=" + protocol});
                }

                command.forEach(function (command) {
                    chart._socket.send(JSON.stringify(command));
                })
            });
        }.bind(this))

    }
{
    var Chart = function (id, description,xaxisformat) {
        this._forcedClose = false;
        var colors = chroma.brewer['Set1'];
        colors[5] = "blue";
        this._loopColors = {i:0, colors: colors};
        this._seriesByKey = {};
        this._id = id;
        this._description = description;
        if (this._description.values == undefined) {
            this._description.values = []
            this._hasGraphic = false;
        } else {
            this._hasGraphic = true;
        }
        if (this._description.legend == undefined) {
            this._description.legend = []
        }
        this._options = $.extend(true, {}, Chart.FLOT_OPTIONS);
        this._options.xaxis.ticks = this._options.xaxis.ticks.bind(this)
        this.calculateXAxis();
        this.calculateYAxis(this._description.min,this._description.max);

        var diff = (this._description.max - this._description.min) * 0.005;
        var up = parseInt(this._description.mark) + diff;
        var down = parseInt(this._description.mark) - diff;
        this._options.grid.markings = [
            { yaxis: { from: down, to: up}, color: "#FF0000" }
        ]
        this._options.yaxis.ticks = 10;
        this._xaxisformat = xaxisformat;
        this._plot = undefined;
        this._variables = {};
        this._menuItems = {_separation: "-"};
        this.updateChart();
        this.cleanProcess();

    }
    Chart.prototype.getNextColor = function () {
        var color = this._loopColors.colors[this._loopColors.i++]
        if (this._loopColors.i == this._loopColors.colors.length) {
            this._loopColors.i = 0;
        }
        return color;
    }
    Chart.prototype.addSeries = function (key,series) {
        this._seriesByKey[key] = series;
    }

    Chart.prototype.setAllSeries = function (series) {
        this._seriesByKey = series;
    }

    Chart.prototype.getVariables = function () {
        return this._variables;
    }

    Chart.prototype.getVariable = function (key) {
        return this._variables[key];
    }

    Chart.prototype.getMenuItems = function () {
        return this._menuItems;
    }

    Chart.prototype.getId = function () {
        return this._id;
    }

    Chart.prototype.closeWS = function () {
        this._socket._charts
        this._socket.close(1000,"The sessions has finished");
    }

    Chart.prototype.sendCommand = function (command) {
        this._socket.send(command);
    }


    Chart.prototype.setVariableParams = function (key,chart,legend){
        if (chart != undefined && chart != null) {
            this._variables[key].chart = chart;
        }
        if (legend != undefined && legend != null) {
            this._variables[key].legend = legend;
        }
    }

    Chart.prototype.addVariable = function (key,series,graphKey,legendKey,title) {
        var auxColor = this.getNextColor();
        if (series == undefined) {
            series = {
                data: [],
                color: auxColor,
                lines: {
                    fill: false,
                },
            }

        }
        if (this._variables[key] == undefined) {
            this._variables[key] = {};
            this._variables[key].series = series;
            this._variables[key].chart = false;
            this._variables[key].legend = false;
            this._variables[key].legendColor = auxColor;
            this._variables[key].key = key;
            //this._variables[key].graphColor= auxColor;
        }
        if (graphKey != undefined) {
            this._variables[key].graphKey = graphKey;
        }
        if (legendKey != undefined) {
            this._variables[key].legendKey = legendKey;
        }
        if (title != undefined) {
            this._variables[key].title = title;
        }
        return this._variables;

    }

    Chart.prototype.setLegendColor = function (key,color) {
        if (color != undefined) {
            this._variables[key].legendColor = color;
            if (this._variables[key].graphColor == undefined) {
                this.setGraphColor(key,color)
            }
        }
    }

    Chart.prototype.setGraphColor = function (key,color) {
        if (color != undefined) {
            this._variables[key].graphColor = color;
            this._variables[key].series.color = color
        }
    }

    Chart.prototype.calculateXAxis = function (min,max) {
        this._options.xaxis.max = (max == undefined)?new Date().getTime() - this._description.offset:max;
        this._options.xaxis.min = (min == undefined)?this._options.xaxis.max-this._description.graph_time:min;
        if (this.getPlot() != undefined) {
            this.getPlot().getOptions().xaxes[0].max = this._options.xaxis.max
            this.getPlot().getOptions().xaxes[0].min = this._options.xaxis.min;
            this.getPlot().setupGrid();
        }
    }

    Chart.prototype.getPlot = function (){
        return this._plot;
    }

    Chart.prototype.getDescription = function () {
        return this._description;
    }
    Chart.prototype.getActiveSeriesForChart = function () {
        var keys = Object.keys(this.getVariables());
        //var series = []
        var seriesObject = {};
        for (var i = 0; i < keys.length;i++) {
            var variable = this.getVariable(keys[i]);
            if (variable.chart) {
                //series.push(variable.series)
                if (variable.graphKey != undefined) {
                    seriesObject[variable.graphKey] = variable.series;
                } else {
                    seriesObject[variable.key] = variable.series;
                }
            }
        }
        var series = $.map(seriesObject,function (value,index) {
            //value.key = index;
            return [value];
        })
        // Reordenar antes de devolver
        if (series.length == 0) {
            return [Chart.VOID_SERIES]
        }

        return series;
    }

    Chart.prototype.updateChart = function (){
        if (this.getPlot() != undefined) {
            this.refreshChart()
        }
        if (!this._forcedClose) {
            setTimeout(this.updateChart.bind(this),100);

        }
    }

    Chart.prototype.updateMenu = function () {
        if (this._graphMenuNeedUpdate) {
            this._graphMenuNeedUpdate = false;
            this.refreshGraphMenu();
        }
        if (this._legendMenuNeedUpdate) {
            this._legendMenuNeedUpdate = false;
            this.refreshLegendMenu();
        }
        if (!this._forcedClose) {
            setTimeout(this.updateMenu.bind(this),200);
        }

    }

    Chart.prototype.getGraphOptions = function () {
        return this._options;
    }

    Chart.prototype.setDomContainer = function (dom) {
        this._domContainer = dom;
        this._flotDomeContainer = this._domContainer.find("."+StatisticsOnline.FLOOT_CONTAINER_CLASS)
    }

    Chart.prototype.getDomContainer = function (){
        return this._domContainer;
    }

    Chart.prototype.getFlotContainer = function () {
        return this._flotDomeContainer;
    }

    Chart.prototype.setWebSocket = function (uri,force) {
        if (this._socket == undefined || force) {
            if (this._socket) {
                this._socket.close()
            }
            this._socket = new ReconnectingWebSocket(uri)
            this._socket.onmessage = function (e) {
                var msg = JSON.parse(e.data)
                // XXXX
                this.newMessage(msg);
            }.bind(this)

        }
    }


    Chart.prototype.newMessage = function (msg) {
        $.each(msg.content,function (key,value){
            // Legend
            var id = this.getLegendId(key);
            //$(document.getElementById(id)).find("."+StatisticsOnline.GRAPTH_LEGEND_ENTRY_VALUE_CLASS).text(value);

            // chart

            if (this.getVariable(key) == undefined ) {
                this.addVariable(key);
            }
            var parsed = parseFloat(value)
            if (!isNaN(parsed)) {
                // Is the first
                if (this.getVariable(key).series.data.length == 0){
                    this.getVariable(key).series.data.splice(0,0,[new Date().getTime() ,parsed])
                    this.createMenuContextGraph();
                } else {
                    this.getVariable(key).series.data.splice(0,0,[new Date().getTime() ,parsed])
                }

            }
            if (this.getVariable(key).legendValue == undefined) {
                this.getVariable(key).legendValue = value;
                this.createMenuContextLegend();
            } else {
                this.getVariable(key).legendValue = value;
            }
            this.updateLegend(key);
        }.bind(this))
}

    Chart.prototype.updateLegend = function (key) {
        if (key == undefined) {
            var keys = this.getVariableKeys();
            keys.forEach(function (key) {
                this.updateLegend(key);
            }.bind(this))
        } else {
            var variable = this.getVariable(key)
            var id = this.getLegendId(key);
            $(document.getElementById(id)).find("."+StatisticsOnline.GRAPTH_LEGEND_ENTRY_VALUE_CLASS).text(variable.legendValue);
        }
    }

    Chart.prototype.refreshChart = function () {
        this.calculateXAxis();
        var series = this.getActiveSeriesForChart();
        if (this.getDescription().flex_height) {
            var min = series
                .map(function (entry) {
                    return entry.data
                }).reduce(function (series1,series2){
                   return series1.concat(series2)
                }).map(function (entry) {
                    return parseFloat(entry[1]);
                }).concat([parseFloat(this.getDescription().min)]).reduce(function(prev,actual) {
                    return (prev< actual)?prev:actual;
                })
            var max = series
                .map(function (entry) {
                    return entry.data
                }).reduce(function (series1,series2){
                    return series1.concat(series2)
                }).map(function (entry) {
                    return parseFloat(entry[1]);
                }).concat([parseFloat(this.getDescription().max)]).reduce(function(prev,actual) {
                    return (prev> actual)?prev:actual;
                })


            this.calculateYAxis(min,max);
        }
        this.getPlot().setData(series)
        this.getPlot().draw();

        return true;
    }

    Chart.prototype.calculateYAxis = function (min, max) {
        this._options.yaxis.max = max;
        this._options.yaxis.min = min;
        if (this.getPlot() != undefined) {
            this.getPlot().getOptions().yaxes[0].min = min;
            this.getPlot().getOptions().yaxes[0].max = max;

            var diff = (this.getPlot().getOptions().yaxes[0].max - this.getPlot().getOptions().yaxes[0].min) * 0.005;
            diff = diff.toFixed(2)

            if (this.getDescription().mark != undefined) {
                var up = parseInt(this.getDescription().mark) + parseFloat(diff);
                var down = parseInt(this.getDescription().mark) - parseFloat(diff);
                this.getPlot().getOptions().grid.markings = [
                    { yaxis: { from: down, to: up}, color: "#FF0000" }
                ]

            }

            this.getPlot().setupGrid();
        }
    }


    Chart.VOID_SERIES = {
        data: [],
    }

    Chart.prototype.getVariableKeys = function () {
        return Object.keys(this.getVariables());
    }

    Chart.prototype.cleanProcess = function () {
        var keys = this.getVariableKeys();
        keys.each(function (key) {
            this.getVariable(key).series.data = this.getVariable(key).series.data.filter(function (value){
                return this._options.xaxis.min < value[0];
            }.bind(this))
        }.bind(this))
        if (!this._forcedClose) {
            setTimeout(this.cleanProcess.bind(this),1000);
        }
    }

    Chart.prototype.generateLegend = function (template) {
        if (template == undefined) {
            template = $("."+StatisticsOnline.GRAPH_CLASS+"."+TEMPLATE_CLASS);
        }
        this.getDomContainer().find("."+StatisticsOnline.GRAPTH_LEGEND_CLASS).remove()
        var legendContainer = template.find("."+StatisticsOnline.GRAPTH_LEGEND_CLASS).clone();
        this.getDomContainer().append(legendContainer);
        var legendEntryTemplate = legendContainer.find("."+StatisticsOnline.GRAPTH_LEGEND_ENTRY_CLASS+"."+TEMPLATE_CLASS).removeClass(TEMPLATE_CLASS);


        var legends = this.getVariableKeys()
            .filter(function (key) {
                return this.getVariable(key).legend
            }.bind(this))
        legends.sort(function (legend1,legend2) {
            var key1 = this.getVariable(legend1).legendKey;
            var key2 = this.getVariable(legend2).legendKey;
            if (key1 != undefined && key2 != undefined) {
                return key1.localeCompare(key2);

            }
            if (key1 == undefined && key2 != undefined) {
                return 1;
            }
            if (key1 != undefined && key2 == undefined) {
                return -1;
            }


            key1 = this.getVariable(legend1).graphKey;
            key2 = this.getVariable(legend2).graphKey;
            if (key1 != undefined && key2 != undefined) {
                return key1.localeCompare(key2);

            }
            if (key1 == undefined && key2 != undefined) {
                return 1;
            }
            if (key1 != undefined && key2 == undefined) {
                return -1;
            }

            key1 = this.getVariable(legend1).key;
            key2 = this.getVariable(legend2).key;
            if (key1 != undefined && key2 != undefined) {
                return key1.localeCompare(key2);

            }
            if (key1 == undefined && key2 != undefined) {
                return 1;
            }
            if (key1 != undefined && key2 == undefined) {
                return -1;
            }


        }.bind(this))
        legends.forEach(function (key) {
            var variable = this.getVariable(key);
            var description = this.getDescription().legend[variable.legendKey];
            if (description == undefined) {
                description = this.getDescription().values[variable.graphKey];
            }
            if (description == undefined) {
                description = {}
                description.color = variable.legendColor;
                description.id = variable.key;
                description.text = variable.key;

            }

            var legendEntry = legendEntryTemplate.clone().removeClass(TEMPLATE_CLASS).attr('id',this.getLegendId(description.id));
            var text = (description.text == undefined)?description.key:description.text;

            legendEntry.find("."+StatisticsOnline.GRAPTH_LEGEND_ENTRY_KEY_CLASS).text(text)
            if (description.color){
                legendEntry.css('color',description.color);
            }
                legendContainer.append(legendEntry);

        }.bind(this))

    }

    Chart.prototype.findLegendDescription = function (id){
        for (var key in this.getDescription().legend) {
            if (key == id) {
                return this.getDescription().legend[key]
            }
        }
        return undefined;
    }

    Chart.prototype.hasGraphic = function (){
        return this._hasGraphic;
    }


    Chart.prototype.loadChart = function () {
        var template = $("."+StatisticsOnline.GRAPH_CLASS+"."+TEMPLATE_CLASS);
        var graphsContainer = $("#"+StatisticsOnline.GRAPHS_CONTAINER_ID);
        // deep clone

        var graphContainer = template.clone().removeClass(TEMPLATE_CLASS);
        graphContainer.attr('id',StatisticsOnline.GRAPH_ID+this.getId());
        this.setDomContainer(graphContainer);
        if (this.getDescription().label) {
            graphContainer.find("."+StatisticsOnline.YAXIS_LABEL_CLASS).text(this.getDescription().label)
        }

        if (this.getDescription().values == undefined || this.getDescription().values.length == 0){
            graphContainer.find('.'+StatisticsOnline.FLOOT_CONTAINER_CLASS).css('display','none');
        } else {
            this._graphOrden = Object.keys(this.getDescription().values).sort();
            var activeSeries = this.getActiveSeriesForChart();
            graphContainer.find('.'+StatisticsOnline.FLOOT_CONTAINER_CLASS).css('display','');
            if (this.getDescription().flex_height == "true") {

                var min = this.getDescription().min;
                var max = this.getDescription().max;
                $.each(activeSeries,function (key,series) {
                    for (j = 0; j < series.data.length; j++) {
                        if (series.data[j][1] > max) {
                            max = series.data[j][1]
                        } else if (series.data[j][1] < min) {
                            min = series.data[j][1]
                        }
                    }
                })
                this._options.yaxis.max = max;
                this._options.yaxis.min = min;
            }


            for (var j = 0; j < this._graphOrden.length; j++) {
                var key = this.getDescription().values[this._graphOrden [j]].id;
                //if (this.getDescription().values[sortedKeys[j]].color == undefined) {
                //    this.getDescription().values[sortedKeys[j]].color = this.getNextColor();
                //}
                var variableSeries = {
                    data: [],
                    color: undefined,
                    lines: {
                        fill: this.getDescription().values[this._graphOrden [j]].fill === "true",
                    },
                }
                this.addVariable(key,variableSeries,this._graphOrden [j]);
                this.setGraphColor(key,this.getDescription().values[this._graphOrden [j]].color)
                this.setVariableParams(key,true,false);

            }
        }

        // Legend after graph because the legend color is static and it can be after, graph color cannot be after
        this._legendOrden = Object.keys(this.getDescription().legend).sort();
        for (var j = 0; j < this._legendOrden.length;j++) {
            if (this.getDescription().legend[this._legendOrden[j]].color == undefined) {
                this.getDescription().legend[this._legendOrden[j]].color = this.getNextColor();
            }
            var legendKey = this.getDescription().legend[this._legendOrden[j]].id;
            var legendSeries = {
                data: [],
                color: this.getDescription().legend[this._legendOrden[j]].color,
                lines: {
                    fill: this.getDescription().legend[this._legendOrden[j]].fill === "true",
                },
            }
            this.addVariable(legendKey,legendSeries,undefined,this._legendOrden[j],this.getDescription().legend[this._legendOrden[j]].text)
            this.setLegendColor(legendKey,this.getDescription().legend[this._legendOrden[j]].color)
            this.setVariableParams(legendKey,undefined,true);
        }

        this.generateLegend(template);

        this.setWebSocket(this.getDescription().url,false);

        setTimeout(function () {
            if (this.getDescription().values.length != 0) {
                this._plot = $.plot(this.getFlotContainer(), this.getActiveSeriesForChart(), this.getGraphOptions());
            }
            this.createMenuContextGraph();
            this.createMenuContextLegend();
            this.updateMenu();
            this.updateLegend();
        }.bind(this),1);

        graphContainer.find("."+StatisticsOnline.GRAPTH_TITLE_CLASS).text(this.getDescription().title)

        var nChilds = graphsContainer.children('.'+StatisticsOnline.GRAPH_CLASS).not('.'+TEMPLATE_CLASS).length;
        /*nChilds > 0 && */
        if (nChilds % 2 == 0){
            graphsContainer.append('<div class="clearfix"></div>');
        }
        graphsContainer.append(graphContainer);
        context.init({preventDoubleContext: false});
        context.settings({compress: true});

    }

    Chart.prototype.getLegendId = function (key) {
        return StatisticsOnline.LEGEND_PREFIX + this.getId() + "-"+key;
    }

    Chart.CONTEXT_MENU_BASE_GRAPH = {
        visibleIndex : 1,
        hiddenIndex: 3,
        data: [
            {header: 'Graph options'},
            {text: 'Variables showed', subMenu: []},
            {divider: true},
            {text: 'Variables hidden',subMenu: []},
        ]
    }
    Chart.CONTEXT_MENU_BASE_LEGEND = {
        visibleIndex : 1,
        hiddenIndex: 3,
        data: [
            {header: 'Legend options'},
            {text: 'Variables showed', subMenu: []},
            {divider: true},
            {text: 'Variables hidden',subMenu: []},
        ]
    }

    Chart.prototype.createMenuContextLegend = function () {
        var keys = this.getVariableKeys();

        var menu = $.extend(true,{},Chart.CONTEXT_MENU_BASE_LEGEND);

        keys.filter(function (value) {
            return this.getVariable(value).legend
        }.bind(this)).each(function (key) {
            var item = {
                text : key,
                color : this.getVariable(key).legendColor,
                action : function (key,e) {
                    this.getVariable(key).legend = false;
                    this.generateLegend();
                    this.createMenuContextLegend()
                }.bind(this,key),
            }
            menu.data[menu.visibleIndex].subMenu.add(item);
        }.bind(this))

        keys.filter(function (value) {
            return !this.getVariable(value).legend &&
                this.getVariable(value).legendValue != undefined
        }.bind(this)).each(function (key) {
            var item = {
                text : key,
                color : this.getVariable(key).legendColor,
                action : function (key,e) {
                    this.getVariable(key).legend = true;
                    this.createMenuContextLegend()
                    this.generateLegend();

                }.bind(this,key),
            }
            menu.data[menu.hiddenIndex].subMenu.add(item);
        }.bind(this))
        menu.id = StatisticsOnline.CONTEXT_MENU_LEYEND_ID + this.getId();

        this._legendMenu = menu;
        this._legendMenuNeedUpdate = true;
        return menu;
    }
    Chart.prototype.createMenuContextGraph = function () {
        var keys = this.getVariableKeys();

        var menu = $.extend(true,{},Chart.CONTEXT_MENU_BASE_GRAPH);

        keys.filter(function (value) {
            return this.getVariable(value).chart &&
                this.getVariable(value).series.data.length > 0 &&
                !isNaN(parseFloat(this.getVariable(value).series.data[0]))
        }.bind(this)).each(function (key) {
            var item = {
                text : key,
                color : this.getVariable(key).series.color,
                action : function (key,e) {
                    this.getVariable(key).chart = false;
                    this.createMenuContextGraph()
                }.bind(this,key),
            }
            menu.data[menu.visibleIndex].subMenu.add(item);
        }.bind(this))

        keys.filter(function (value) {
            return !this.getVariable(value).chart &&
                this.getVariable(value).series.data.length > 0 &&
                !isNaN(parseFloat(this.getVariable(value).series.data[0]))
        }.bind(this)).each(function (key) {
            var item = {
                text : key,
                color : this.getVariable(key).series.color,
                action : function (key,e) {
                    this.getVariable(key).chart = true;
                    this.createMenuContextGraph()
                }.bind(this,key),
            }
            menu.data[menu.hiddenIndex].subMenu.add(item);
        }.bind(this))
        menu.id = StatisticsOnline.CONTEXT_MENU_GRAPH_ID + this.getId();
        this._graphMenu = menu;
        this._graphMenuNeedUpdate = true;
        return menu;
    }

    Chart.prototype.refreshLegendMenu = function (menu) {
        if (menu == undefined){
            menu = this._legendMenu;
        }
        context.destroy('#'+StatisticsOnline.GRAPH_ID+this.getId()+' .so-legend')
        context.attach('#'+StatisticsOnline.GRAPH_ID+this.getId()+' .so-legend',menu)

    }

    Chart.prototype.refreshGraphMenu = function (menu) {
        if (menu == undefined){
            menu = this._graphMenu;
        }
        context.destroy('#'+StatisticsOnline.GRAPH_ID+this.getId()+' .so-flot-element')
        context.attach('#'+StatisticsOnline.GRAPH_ID+this.getId()+' .so-flot-element',menu)
    }


    Chart.FLOT_OPTIONS = {
        yaxis: {
            min: StatisticsOnline.YAXIS_DEFAULT_MIN,
            ticks: 10,
            max: StatisticsOnline.YAXIS_DEFAULT_MAX
        },
        xaxis: {
            mode: 'time',
            max:(new Date().getTime()-StatisticsOnline.DEFAULT_TIME_OFFSET),
            min:(new Date().getTime()-StatisticsOnline.DEFAULT_TIME-StatisticsOnline.DEFAULT_TIME_OFFSET),
            ticks: function (axis) {
                if (this._xaxisformat == StatisticsOnline.XAXIS_FORMAT_DATE) {
                    return []
                } else {
                    var date = new Date(axis.max)
                    var actual = axis.max;
                    var end = axis.min;
                    var sDate = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" +
                        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" +
                        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
                    var ticks = [[actual, "0"]];
                    actual -= this.getDescription().ticks_separation;
                    var i = 0;
                    while (actual > end) {
                        i += parseInt(this.getDescription().ticks_separation / 1000);
                        var sec = i % 60;
                        var cad = sec +"s"
                        if (i >= 60){
                            var min = parseInt(i / 60);
                            cad = min + "m "+cad
                        }
                        cad = "["+cad+"]"
                        ticks.push([actual, cad])
                        actual -= this.getDescription().ticks_separation
                    }
                    return ticks

                }
            },

        },
        grid: {
            backgroundColor: "#ffffff",
            tickColor: "#585858",
            /*Red line*/
            markings:[
                { yaxis: { from: 9.90, to: 10.10}, color: "#FF0000" }
            ]
        }

    }



}


}
