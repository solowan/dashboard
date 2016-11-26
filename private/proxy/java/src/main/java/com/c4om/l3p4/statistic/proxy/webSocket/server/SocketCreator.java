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
package com.c4om.l3p4.statistic.proxy.webSocket.server;

import com.c4om.l3p4.statistic.proxy.webSocket.client.ClientSocket;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeRequest;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeResponse;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;

import java.util.List;

/**
 * Created by Francisco Huertas on 28/08/15.
 */
public class SocketCreator implements WebSocketCreator {
    private static final Logger LOGGER = LogManager.getLogger(SocketCreator.class.getName());

    private List<SocketHandler> sessionList;
    private ClientSocket collector;

    public SocketCreator(List<SocketHandler> sessionList, ClientSocket collector) {
        this.sessionList = sessionList;
        this.collector = collector;
    }

    @Override
    public Object createWebSocket(ServletUpgradeRequest req, ServletUpgradeResponse resp) {
        SocketHandler socket = new SocketHandler(collector);

        sessionList.add(socket);
        return socket;
    }
}
