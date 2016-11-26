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


try {
    var CONFIG_FILE = "./conf/conf.json"
    var LOGS_TYPE = {ALL: 0, ERROR: 5, INFO: 10, DEBUG: 15, NONE: 20}
    var LOGS_TYPE_STR = {"0": "ALL", "5": "ERROR", "10": "INFO", "15": "DEBUG", "20": "NONE"}
    var LOG_LEVEL = LOGS_TYPE.NONE
    var config = require(CONFIG_FILE)
    var fs = require('fs');
    var express = require("express");
    var app     = express();
    var http    = require("http");
    var server  = http.createServer(app);
    var bodyParser = require('body-parser')
    var exec = require('exec');

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

    var callbackCommand = function (res, err, out, code) {
        var result = {'code':code};
        if (code != 0) {
            result.result = err;
            log("RESULT(Err): "+err, LOGS_TYPE.INFO);
        } else {
            result.result = out;
            log("RESULT: "+out, LOGS_TYPE.INFO);
        }

        res.send(JSON.stringify(result))
    }
    log("Start Management module", LOGS_TYPE.INFO);




    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.get(config.web_path,function (req,res) {
        res.send("Hello world!");
    })
    app.post(config.web_path,function (req,res) {
        if (req.body.command != undefined) {
            log("Executing: "+req.body.command, LOGS_TYPE.INFO);
            exec(req.body.command,callbackCommand.bind(this,res))
        } else {
            log("the call don't have command")
            res.send(400)
        }
        //res.send("POST\n");
    })

    server.listen(config.port,function(){
        console.log("Server is running on *:"+config.port+config.web_path);
    })
    return true;

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