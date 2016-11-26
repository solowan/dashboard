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

import com.c4om.l3p4.statistic.proxy.webSocket.client.ClientSocket;
import com.c4om.l3p4.statistic.proxy.logic.formulas.Formula;
import com.c4om.l3p4.statistic.proxy.webSocket.server.ServerServlet;
import com.c4om.l3p4.statistic.proxy.webSocket.server.SocketHandler;
import com.google.common.collect.Lists;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import java.io.PrintWriter;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Francisco Huertas on 28/08/15.
 */
public class Proxy {
    private static final Logger LOGGER = LogManager.getLogger(Proxy.class.getName());
    private static final PrintWriter LOGGER_WRITER = org.apache.logging.log4j.io.IoBuilder.forLogger().setLevel(Level.ALL).buildPrintWriter();


    private Map<String,String> paths;
    private Map<String,ClientSocket> connections;
    private Map<String,List<SocketHandler>> sockets;
    private Map<String, Map<String,Formula>> formulas;

    private Integer port;

    private String id;

    private Server server;

    public Proxy(String id,Integer port) {
        this(id);
        this.port = port;

    }

    public Proxy(String id) {
        this.id = id;
        paths = new HashMap<>();
        connections = new HashMap<>();
        sockets = new HashMap<>();
        formulas = new HashMap<>();
    }

    public void setPort (Integer port){
        this.port = port;
    }

    public void setPath(String id, String path) {
        paths.put(id,path);
        formulas.put(id, new HashMap<>());
    }

    public void setClient(String id, String uri, Boolean allowCommands) throws URISyntaxException {
        ClientSocket client = new ClientSocket(uri, allowCommands);
        connections.put(id,client);
    }

    public void configure(){
        paths.keySet().stream().filter(key->!connections.containsKey(key)).forEach(key->{
            LOGGER.log(Level.WARN, "The path ("+paths.get(key)+") doesn't have a connection associated. It will be ignored");
            paths.remove(key);
            formulas.remove(key);
        });
        connections.keySet().stream().filter(key->!paths.containsKey(key)).forEach(key -> {
            LOGGER.log(Level.WARN, "The connection (" + connections.get(key) + ") doesn't have a path associated. It will be ignored");
            connections.remove(key);
        });

        connections.keySet().forEach(key-> sockets.put(key, Lists.newArrayList()));

        this.server = new Server();
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(this.port);
        server.addConnector(connector);
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");


        server.setHandler(context);
        paths.forEach((key, value) -> {
            ClientSocket client = connections.get(key);
            try {
                ServletHolder holderEvents = new ServletHolder(new ServerServlet(sockets.get(key),client));
                context.addServlet(holderEvents, value);
                client.configure(sockets.get(key),formulas.get(key));


            } catch (URISyntaxException e) {
                LOGGER.log(Level.ERROR, "A client cannot connect" + client.getUri(), e);
                connections.remove(key);
                paths.remove(key);
                sockets.remove(key);
            }
        });
    }


    public void startServer() {
        try {
            connections.values().forEach(socket -> socket.connect());
            server.start();
            server.dump(LOGGER_WRITER);
            LOGGER.log(Level.INFO, "Starting server. Port=" + port + ", Path(s)=" + paths);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getId(){
        return this.id;
    }

    public void setFormula(String path, String id, Formula formula){
        formulas.get(path).put(id,formula);
    }
    public Formula getFormula(String path, String id){
        return formulas.get(path).get(id);
    }

}
