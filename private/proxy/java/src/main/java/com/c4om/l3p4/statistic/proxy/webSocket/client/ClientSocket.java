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
package com.c4om.l3p4.statistic.proxy.webSocket.client;

import com.c4om.l3p4.statistic.proxy.logic.formulas.Formula;
import com.c4om.l3p4.statistic.proxy.logic.formulas.implementations.ValueWithTime;
import com.c4om.l3p4.statistic.proxy.webSocket.server.SocketHandler;
import com.google.common.collect.Lists;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.api.WebSocketException;
import org.eclipse.jetty.websocket.client.WebSocketClient;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * Created by Francisco Huertas on 28/08/15.
 */
public class ClientSocket extends WebSocketAdapter {
    private static final Logger LOGGER = LogManager.getLogger(ClientSocket.class.getName());

    private final String MESSAGE_KEY_CONTENT ="content";
    private final String MESSAGE_KEY_TIME ="time";


    private boolean _allowCommands;
    private List<SocketHandler> clientsConnected;
    private List<Future<Session>> futSessions;
    private List<Session> serverSessions;
    private String sUri;
    private URI uri;
    private Map<String, Formula> formulas;


    public ClientSocket (String uri, boolean allowCommands) {
        this.sUri = uri;
        this.futSessions = Lists.newArrayList();
        this.serverSessions = Lists.newArrayList();
        this._allowCommands = allowCommands;
    }

    public void configure(List<SocketHandler> clientsConnected, Map<String, Formula> formulas) throws URISyntaxException {
        this.clientsConnected = clientsConnected;
        this.uri = new URI(sUri);
        this.formulas =formulas;

    }

    public void connect (){
        WebSocketClient client = new WebSocketClient();
        try {
            client.start();
//            futSessions.add(client.connect(this,uri));
            Future<Session> futSession = client.connect(this,uri);
            new Thread(()->{
                while(!futSession.isDone() && !futSession.isCancelled()) {
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
//                        LOGGER.log()
                    }

                }
                if (futSession.isDone()) {
                    try {
                        serverSessions.add(futSession.get());
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } catch (ExecutionException e) {
                        LOGGER.log(Level.ERROR,"Unresolved Address: "+this.sUri,e);
                        System.exit(0);
                    }
                }else if(futSession.isCancelled()){

                }
            }).start();

        } catch (Exception e) {
            LOGGER.log(Level.ERROR, "A client cannot connect, " + this.sUri, e);
        }


    }

    @Override
    public void onWebSocketText(String message)
    {
        Map<String,Formula> solvedFormulas = new HashMap<>();
        super.onWebSocketText(message);
        Long time = new Date().getTime();
        JSONObject receivedMessage = new JSONObject(message);
        receivedMessage.keySet().forEach(key -> {
            solvedFormulas.put(key, new ValueWithTime(key, true, time, receivedMessage.get(key)));
        });
        int numSolvedFormulas = 0;
        int prevSolvedFormulas = -1;
        while (prevSolvedFormulas != numSolvedFormulas) {
            prevSolvedFormulas = numSolvedFormulas;
            formulas.forEach((key,formula)-> {
                if (!solvedFormulas.containsKey(key)) {
                    Boolean result = formula.solveFormula(solvedFormulas);
                    if (result) {
                        solvedFormulas.put(key,formula);
                    }
                }
            });
            numSolvedFormulas = solvedFormulas.size();
        }


        JSONObject jsonMessage = new JSONObject();
        jsonMessage.put(MESSAGE_KEY_CONTENT, new JSONObject());
        JSONObject content = jsonMessage.getJSONObject(MESSAGE_KEY_CONTENT);
        jsonMessage.put(MESSAGE_KEY_TIME,time);
        solvedFormulas.entrySet().stream()
                .filter(entry->entry.getValue().isPublish())
                .forEach(entry->content.put(
                        entry.getKey(),entry.getValue().getResult())
                );
        List<SocketHandler> toRemove = Lists.newArrayList();

        this.clientsConnected.forEach(socket -> {
            try {
//                LOGGER.log(Level.DEBUG,jsonMessage.toString());
                if (socket.getSession().isOpen()) {
                    socket.getSession().getRemote().sendString(jsonMessage.toString());
                } else {
                    LOGGER.log(Level.DEBUG,"A socket is closed. "+socket.toString());
                    toRemove.add(socket);

                }
            } catch (IOException | WebSocketException | ConcurrentModificationException  e) {
                LOGGER.log(Level.ERROR, "A message cannot be sent. Client=" + socket.getSession(), e);
            }
        });
        toRemove.forEach(socket->this.clientsConnected.remove(socket));

    }

    public boolean allowCommands() {
        return _allowCommands;
    }

    public String getUri(){
        return this.sUri;
    }
}
