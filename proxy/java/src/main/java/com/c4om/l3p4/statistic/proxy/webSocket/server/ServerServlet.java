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
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.List;

/**
 * Created by Francisco Huertas on 28/08/15.
 */
public class ServerServlet extends WebSocketServlet {
    private static final Logger LOGGER = LogManager.getLogger(ServerServlet.class.getName());
    private final List<SocketHandler> sessionList;
    private ClientSocket collector;


    public ServerServlet(List<SocketHandler> sessionList, ClientSocket collector) {
        this.sessionList= sessionList;
        this.collector = collector;
    }

    @Override
    public void configure(WebSocketServletFactory factory) {
        factory.setCreator(new SocketCreator(sessionList,collector));
    }

}
