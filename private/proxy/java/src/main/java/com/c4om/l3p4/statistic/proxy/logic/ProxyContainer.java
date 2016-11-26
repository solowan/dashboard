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
package com.c4om.l3p4.statistic.proxy.logic;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Francisco Huertas on 27/08/15.
 */
public class ProxyContainer {
    private static final Logger LOGGER = LogManager.getLogger(ProxyContainer.class.getName());

    private static Map<String,Proxy> servers = new HashMap<>();

    private ProxyContainer(){

    }

    public static void addServer(String id,Proxy server) {
        servers.put(id,server);
    }

    public static boolean containsServer(String id){
        return servers.containsKey(id);
    }

    public static Proxy getProxy(String id){
        return servers.get(id);
    }

    public static Collection<Proxy> getServers(){
        return servers.values();
    }


}

