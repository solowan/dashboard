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

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Created by Francisco Huertas on 26/08/15.
 */
public class Args {
    private static final Logger LOGGER = LogManager.getLogger(Args.class.getName());

    private static final String ATTR_CONFIG_PATH = "--config";

    private static String configPath = "";
    public static void loadArts(String [] args) {
        configPath = System.getProperty("confdir") + "/" + Configuration.CONFIGURATION_FILENAME;
        for (int i = 0; i < args.length-1; i++) {
            switch (args[i]) {
                case ATTR_CONFIG_PATH:
                    configPath = args[i+1];
                    i++;
                    break;
            }
        }
        LOGGER.log(Level.INFO,"Property File="+configPath);
    }

    public static String getConfigPath (){
        return configPath;
    }
}
