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
package com.c4om.l3p4.statistic.proxy.configuration;

import com.c4om.l3p4.statistic.proxy.logic.formulas.implementations.*;
import com.c4om.l3p4.statistic.proxy.logic.Proxy;
import com.c4om.l3p4.statistic.proxy.logic.ProxyContainer;
import com.c4om.l3p4.statistic.proxy.logic.formulas.*;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

/**
 * Created by Francisco Huertas on 25/08/15.
 */
public class Configuration {
    private static final Logger LOGGER = LogManager.getLogger(Configuration.class.getName());

    public static final String CONFIGURATION_FILENAME = "proxy.xml";

    private static final String SERVERS = "servers";
    private static final String ID = "id";
    private static final String PARENT_ID = "parentId";
    private static final String PORT = "port";
    private static final String PATHS = "paths";
    private static final String PATH = "path";
    private static final String FORMULAS = "formulas";
    private static final String PUBLISH = "publish";
    private static final String STEP = "step";
    private static final String PREV_VALUE = "value.prev";
    private static final String VALUE_RESET = "value.reset";
    private static final String VALUE_CONSTANT = "value.constant";
    private static final String MATH_FORMULA = "mathFormula";
    private static final String RENAME_FORMULA = "value.rename";
    private static final String TIME_BEFORE = "value.before";
    private static final String TIME_VALUE = "value.time";
    private static final String TIME_ATTR = "time";
    private static final String FORMULA = "formula";
    private static final String VAR = "var";
    private static final String ALIAS = "alias";
    private static final String PATTERN = "pattern";
    private static final String RESET_AT = "atValue";

    private static final String CLIENT = "client";
    private static final String ALLOW_COMMANDS = "allow-commands";
    private static final String CLIENT_PARAMETER_URI = "uri";

    private static Document configuration;

    public static void loadProperties(String configPath) {
        SAXBuilder saxBuilder = new SAXBuilder();

        File file = new File(configPath);
        try {
            configuration = saxBuilder.build(file);
            Element root = configuration.getRootElement();
            Element servers = root.getChild(SERVERS);
            servers.getChildren().forEach(server -> {
                String serverId = server.getAttributeValue(ID);
                Integer serverPort = Integer.valueOf(server.getChildText(PORT));
                Proxy proxy = new Proxy(serverId, serverPort);

                Element paths = server.getChild(PATHS);
                paths.getChildren().forEach(path -> {
                    String idPath = path.getAttributeValue(ID);
                    String sPath = path.getAttributeValue(PATH);
                    String client = path.getAttributeValue(CLIENT);
                    Boolean allowCommands = "true".equals(path.getAttributeValue(ALLOW_COMMANDS));
                    proxy.setPath(idPath, sPath);
                    try {
                        proxy.setClient(idPath, client,allowCommands);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException("The configuration file cannot be read. This is a not correct URI=" + client, e);
                    }
                    List<Element> formulas;
                    try {
                        formulas = path.getChild(FORMULAS).getChildren();
                    } catch (NullPointerException e) {
                        formulas = Lists.newArrayList();
                    }
                    formulas.forEach(elementFormula -> {
                        String type = elementFormula.getName();
                        String formulaId = elementFormula.getAttributeValue(ID);
                        Boolean publish = ("true".equals(elementFormula.getAttributeValue(PUBLISH)));
                        Formula formula = null;
                        String parentId = null;
                        switch (type) {
                            case PREV_VALUE:
                                try {
                                    Integer steps = Integer.valueOf(elementFormula.getAttributeValue(STEP));
                                    parentId = elementFormula.getAttributeValue(PARENT_ID);
                                    formula = new PrevValue(formulaId, publish, parentId, steps);
                                } catch (NumberFormatException e) {
                                    throw new RuntimeException("A Step value is not a integer value.", e);
                                }
                                break;
                            case MATH_FORMULA:
                                Map<String, String> vars = Maps.newHashMap();
                                String sFormula = elementFormula.getChildText(FORMULA);
                                elementFormula.getChildren(VAR).forEach(var -> vars.put(var.getAttributeValue(ID), var.getAttributeValue(ALIAS)));
                                formula = new MathFormula(formulaId, publish, sFormula, vars);
                                break;
                            case TIME_VALUE:
                                parentId = elementFormula.getAttributeValue(PARENT_ID);
                                formula = new TimeValue(formulaId, publish, parentId);
                                break;
                            case RENAME_FORMULA:
                                parentId = elementFormula.getAttributeValue(PARENT_ID);
                                String pattern = elementFormula.getAttributeValue(PATTERN);
                                formula = new RenameFormula(formulaId, publish, parentId, pattern);
                                break;
                            case TIME_BEFORE:
                                try {
                                    parentId = elementFormula.getAttributeValue(PARENT_ID);
                                    Long time = Long.valueOf(elementFormula.getAttributeValue(TIME_ATTR));
                                    formula = new BeforeValue(formulaId, publish, time, parentId);
                                } catch (NumberFormatException e) {
                                    LOGGER.log(Level.ERROR, "The time format is not correct. Use a long in milliseconds", e);
                                }
                                break;
                            case VALUE_RESET:
                                try {
                                    String resetValue = elementFormula.getAttributeValue(RESET_AT);
                                    parentId = elementFormula.getAttributeValue(PARENT_ID);
                                    formula = new ResetAtValue(formulaId, publish, parentId, resetValue);
                                } catch (NumberFormatException e) {
                                    LOGGER.log(Level.ERROR, "The reset value is not correct. Use a Integer value", e);
                                }
                                break;
                            case VALUE_CONSTANT:
                                parentId = elementFormula.getAttributeValue(PARENT_ID);
                                formula = new LastConstantValue(formulaId,publish,parentId);
                                break;
                        }
                        if (formula != null) {
                            proxy.setFormula(idPath, formulaId, formula);
                        }
                    });
                });
                ProxyContainer.addServer(proxy.getId(), proxy);
            });
        } catch (JDOMException | IOException | NumberFormatException e) {
            throw new RuntimeException("The configuration file cannot be read. Path="+configPath,e);
        }
    }
}
