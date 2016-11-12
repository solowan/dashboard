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
package com.c4om.l3p4.statistic.proxy.logic.formulas;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Created by Francisco Huertas on 2/09/15.
 */
public abstract class FormulaWithTime extends Formula {
    private static final Logger LOGGER = LogManager.getLogger(FormulaWithTime.class.getName());

    private Long time;

    public FormulaWithTime(String id, Boolean publish, Long time) {
        super(id, publish);
        this.time = time;
    }

    public Long getTime(){
        return this.time;
    }

    protected void setTime(Long time) {
        this.time = time;
    }

    public String toString() {
        return getResult().toString();
    }
}
