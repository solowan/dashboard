#!/usr/bin/nodejs
/*  Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
var h = 0;

var CONFIG_FILE = "./conf/conf.json"
var LOGS_TYPE = {ALL: 0, ERROR: 5, INFO: 10, DEBUG: 15, NONE: 20}
var LOGS_TYPE_STR = {"0": "ALL", "5": "ERROR", "10": "INFO", "15": "DEBUG", "20": "NONE"}
var LOG_LEVEL = LOGS_TYPE.NONE
var config = require(CONFIG_FILE)
var fs = require('fs');
var log = function (msg, level) {
    if (level == undefined) {
        level = LOGS_TYPE.NONE
    }
    var date = new Date().toISOString()
    var i = 0;
    var lines;
    if (msg.split != undefined) {
        lines = msg.split("\n");
    } else {
        lines = [msg];
    }
    lines.forEach(function (msgLine) {
        if (msgLine.trim() != "") {
            if (level <= LOG_LEVEL) {
                var pad = "00";
                var n = '' + i;
                var result = (pad + n).slice(-pad.length);
                fs.appendFileSync(config.logfile, date + "(" + (result) + ";" + LOGS_TYPE_STR[level] + "): " + msgLine + "\n");
                i++
            }
        }
    });
}

try {
    log("Start collector", LOGS_TYPE.INFO);

    var http = require('http');
    var WebSocketServer = require('ws').Server;
    var exec = require('exec');

    var server = http.createServer();

    config.serverConnections.forEach(function (serverConnection) {
        serverConnection.wss = new WebSocketServer({
            path: serverConnection.path,
            server: server
        })
        serverConnection.wss.on('connection',function (ws) {
            ws.on('message',function(msg){
                try {
                    var jsonMsg = JSON.parse(msg);
                    if (jsonMsg.var != undefined && jsonMsg.command != undefined){
                        log("NewCommand, PATH="+serverConnection.path+" var: "+jsonMsg.var +", command:"+jsonMsg.command ,LOGS_TYPE.DEBUG)
                        serverConnection.commands[jsonMsg.var] = {}
                        serverConnection.commands[jsonMsg.var].command = jsonMsg.command;

                    } else if (jsonMsg.command != undefined) {
                        exec(jsonMsg.command,function (err, out, code) {
                            if (err instanceof Error) {
                                log(jsonMsg.command+"(ERROR) :"+ err.stack,LOGS_TYPE.DEBUG)
                            } else {
                                log(jsonMsg.command+" :"+ out,LOGS_TYPE.DEBUG)
                            }
                        })
                    }
                } catch (ex) {
                    log("Invalid command format: "+msg+". Err msg: "+ex.stack)
                }
            })
        })

    })
    server.listen(config.port)

    var callbackCommand = function (key, result,err, out, code) {
        if (err instanceof Error) {
            console.log(err.stack)
        }
        else if (out != "") {
            result[key] = out.trim();
        } else {
            delete result[key];
        }
    }


    config.serverConnections.forEach(function (serverConnection) {
        serverConnection.result = {};
    });

    var collectStats = function () {
        config.serverConnections.forEach(function (serverConnection) {
            Object.keys(serverConnection.commands).forEach(function (key) {
                try {
                    var command = serverConnection.commands[key];
                    exec(command.command,callbackCommand.bind(this,key,serverConnection.result))

                } catch (ex) {
                    log("A message con not be sent. ERROR"+ex.erno+". MSG: "+ex+"\n"+ex.stack,LOGS_TYPE.ERROR)
                }
            })
        })
        setTimeout(collectStats,config.timeout/2);
    }
    collectStats();

    var sendStats = function () {
        config.serverConnections.forEach(function (serverConnection) {
            if (Object.keys(serverConnection.result).length != 0) {
                log(serverConnection.path + ": " + JSON.stringify(serverConnection.result), LOGS_TYPE.DEBUG);

                serverConnection.wss.clients.forEach(function (client) {
                    client.send(JSON.stringify(serverConnection.result));

                })
            }

        })
        setTimeout(sendStats, config.timeout);
    }
    sendStats();


} catch (e) {
    log("Error exception: "+ e.stack,LOGS_TYPE.ERROR)
    process.exit(1)
}


process.on('uncaughtException', function(err) {
    log("Uncaught exception: "+err.erno+". MSG: "+err+"\n"+err.stack,LOGS_TYPE.ERROR)
    process.exit(1);
});
process.on( "SIGTERM", function() {
    log("Exit with kill command(SIGTERM)",LOGS_TYPE.INFO);
    process.exit(0);
} );
return;