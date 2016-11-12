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
 * Created by fhuertas on 21/09/15.
 */
// Management class
{
    var Management = function (view) {

        this._view = view;
        this._connections = {}
        this._activeConnection = undefined;
        $("#"+Management.TITLE).text(view.title)
        //this._description = view.description;
        var templatesDom= $("#"+Management.TEMPALTES);
        $("#"+Management.ALL_BTN).click(function (e) {
            var active = $(e.target).hasClass("active");
            $("#"+Management.SERVER_LIST_TAG).children().toggleClass("active",!active)
        }.bind(this))

        var serverItemDomTemplate = templatesDom.find("."+Management.SERVER_ITEM_TAG);
        var serversListContainer = $("#"+Management.SERVER_LIST_TAG);
        var keysSet = Object.keys(this._view.servers).sort();
        var outputTemplate =  templatesDom.find("#"+Management.OUTPUT_CONSOLE)


        keysSet.each(function (key) {
            var outputConnection = outputTemplate.clone().removeClass(TEMPLATE_CLASS).attr('id',Management.OUTPUT_CONSOLE+key).addClass(Management.DISPLAY_HIDDEN);
            var connection = {text : this._view.servers[key].text, url: this._view.servers[key].url,id : key, enable : false,console:outputConnection}
            outputConnection.text(connection.text+"$");
            $("#"+Management.OUTPUT_CONTAINER).append(outputConnection);




            var serverItemDom = serverItemDomTemplate.clone().removeClass(TEMPLATE_CLASS)
            serverItemDom.find('span').text(this._view.servers[key].text)
            serverItemDom.find('span').attr('value',key)
            serverItemDom.attr('title',this._view.servers[key].url)
            serverItemDom.attr('value',key)
            //serverItemDom.on('click',function (e){
            serverItemDom.on('click',function (e){
                if (this._connections[$(e.target).attr('value')].enable == undefined) {
                    this._connections[$(e.target).attr('value')].enable = !($(e.target).hasClass("active"));
                } else {
                    this._connections[$(e.target).attr('value')].enable = !this._connections[$(e.target).attr('value')].enable;
                }
                this._connections[$(e.target).attr('value')].console.toggleClass(Management.DISPLAY_HIDDEN,!this._connections[$(e.target).attr('value')].enable)
            }.bind(this))
            serversListContainer.append(serverItemDom);
            // Ejemplo de nuevo boton controlador
            //$("#nuevoBoton").on('click',(function(){
            //    // Por que es campo de texto
            //    var valor1 = $("#id-texto").val();
            //    this.submitString("ls -la");
            //}.bind(this)))
            this._connections[key] = connection
        }.bind(this))


        $("#"+Management.FORM).on('submit',function (e) {
            this.submit();
            e.preventDefault();
        }.bind(this))
        $("#"+Management.SUBMIT_BUTTON).click(function () {
            this.submit();
        }.bind(this))

    }


    Management.prototype.submit = function () {
        var keysSet = Object.keys(this._connections).sort();
        keysSet.each(function (key) {
                var connection = this._connections[key]
            if (connection.enable) {
                $.post(connection.url,{command:$("#"+Management.INPUT_CONSOLE).val()},function(sData){
                    var data = JSON.parse(sData);
                    var myConsole = $("#"+Management.OUTPUT_CONSOLE+key);

                    myConsole.text(connection.text + "$ "+$("#"+Management.INPUT_CONSOLE).val()+"\n"+data.result)
                    if (data.code == 0) {
                        myConsole.removeClass(Management.ERROR_CLASS)
                    } else {
                        myConsole.addClass(Management.ERROR_CLASS)
                    }
                    //console.log(data)
                }.bind(this));
            }

        }.bind(this))
    }

    Management.prototype.submitString = function (command) {
        var keysSet = Object.keys(this._connections).sort();
        keysSet.each(function (key) {
            var connection = this._connections[key]
            if (connection.enable) {
                $.post(connection.url,{command:command},function(sData){
                    var data = JSON.parse(sData);
                    var myConsole = $("#"+Management.OUTPUT_CONSOLE+key);

                    myConsole.text(connection.text + "$ "+$("#"+Management.INPUT_CONSOLE).val()+"\n"+data.result)
                    if (data.code == 0) {
                        myConsole.removeClass(Management.ERROR_CLASS)
                    } else {
                        myConsole.addClass(Management.ERROR_CLASS)
                    }
                }.bind(this));
            }

        }.bind(this))
    }

    Management.TITLE = "mng-title"
    Management.SELECT_TAG = "mng-select-tag"
    Management.SERVER_LIST_TAG = "mng-servers-list"
    Management.SERVER_ITEM_TAG = "mng-server-item"
    Management.TEMPALTES = "mng-templates"
    Management.FORM = "mng-form"
    Management.SUBMIT_BUTTON = "mng-submit-button"
    Management.OUTPUT_CONSOLE = "mng-output-"
    Management.OUTPUT_CONTAINER = "mng-output-container"
    Management.ERROR_CLASS = "mng-error"
    Management.INPUT_CONSOLE= "mng-input"
    Management.ALL_BTN= "mng-all-button"
    Management.DISPLAY_HIDDEN= "mng-hidden"
}
