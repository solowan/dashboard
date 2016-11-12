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
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.*;

import java.io.IOException;

/**
 * Created by Francisco Huertas on 28/08/15.
 */
@WebSocket
public class SocketHandler {

    private static final Logger LOGGER = LogManager.getLogger(SocketHandler.class.getName());

    private Session session;
    private ClientSocket collector;

    public SocketHandler(ClientSocket collector){
        super();
        this.collector = collector;

    }

    @OnWebSocketConnect
    public void onConnect(Session session) {
        session.setIdleTimeout(-1);
        LOGGER.info("Connected to websocket");
        this.session = session;
    }

    @OnWebSocketMessage
    public void onMessage(String message) {
        LOGGER.info("Message: "+message);
        try {
            if (collector.allowCommands()) {
                collector.getRemote().sendString(message);
            }
        } catch (IOException e) {
            LOGGER.log(Level.ERROR,"The message cannot be sent");
        }

    }

    @OnWebSocketError
    public void onError(Throwable error) {
        LOGGER.error("Error: ", error);
        session.close();
    }

    @OnWebSocketClose
    public void onClose(int statusCode, String reason) {
        LOGGER.warn("WebSocket Closed: "+statusCode+" - "+reason);
    }

    public Session getSession(){
        return session;
    }
}