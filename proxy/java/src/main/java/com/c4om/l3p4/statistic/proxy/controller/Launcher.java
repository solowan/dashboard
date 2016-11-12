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
package com.c4om.l3p4.statistic.proxy.controller;

import com.c4om.l3p4.statistic.proxy.configuration.Args;
import com.c4om.l3p4.statistic.proxy.configuration.Configuration;
import com.c4om.l3p4.statistic.proxy.logic.ProxyContainer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Created by Francisco Huertas on 25/08/15.
 */
public class Launcher {




    private static final Logger LOGGER = LogManager.getLogger(Launcher.class.getName());
    public static void main (String []args) {


        Args.loadArts(args);

        Configuration.loadProperties(Args.getConfigPath());

//        ServersContainer.getProxy("0").getClient("o1_in").connect();

        ProxyContainer.getServers().forEach(server -> {
            server.configure();
            new Thread(()->server.startServer()).start();
        });

    }
}
