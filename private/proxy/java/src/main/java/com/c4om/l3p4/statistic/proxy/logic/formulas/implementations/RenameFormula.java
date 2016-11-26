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
package com.c4om.l3p4.statistic.proxy.logic.formulas.implementations;

import com.c4om.l3p4.statistic.proxy.logic.formulas.Formula;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Map;

/**
 * Created by Francisco Huertas on 3/09/15.
 */
public class RenameFormula extends Formula {
    private static final Logger LOGGER = LogManager.getLogger(RenameFormula.class.getName());

    private String parentId;
    private Formula solvedFormula = null;
    private String pattern;
    // ${VALUE}
    private static final String PATTERN_KEY = "\\$\\{VALUE\\}";

    public RenameFormula(String id, Boolean publish,String parentId, String pattern) {
        super(id, publish);
        this.parentId = parentId;
        this.pattern = pattern;
    }


    @Override
    public boolean solveFormula(Map<String, Formula> solvedFormulas) {
        if (solvedFormulas.containsKey(parentId)) {
            solvedFormula = solvedFormulas.get(parentId);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Object getResult() {
        if (solvedFormula == null || solvedFormula.getFormula() == null) {
            return null;
        } else {
            return  pattern.replaceAll(PATTERN_KEY,solvedFormula.getResult().toString());
        }
    }



}
