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
import com.c4om.l3p4.statistic.proxy.logic.formulas.FormulaWithTime;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Map;

/**
 * Created by Francisco Huertas on 2/09/15.
 */
public class TimeValue extends Formula {
    private static final Logger LOGGER = LogManager.getLogger(TimeValue.class.getName());

    private String parentId;
    private Long result;

    public TimeValue(String id, Boolean publish,String parentId) {
        super(id, publish);
        this.parentId = parentId;
    }


    @Override
    public boolean solveFormula(Map<String, Formula> solvedFormulas) {
        if (solvedFormulas.containsKey(this.parentId)){
            try {
                FormulaWithTime formulaWithTime = (FormulaWithTime) solvedFormulas.get(this.parentId).getFormula();
                this.result = formulaWithTime.getTime();
                return true;
            } catch (ClassCastException | NullPointerException e) {
                return true;
            }
        } else {

            return false;
        }
    }

    @Override
    public Object getResult() {
        return this.result;
    }
}
