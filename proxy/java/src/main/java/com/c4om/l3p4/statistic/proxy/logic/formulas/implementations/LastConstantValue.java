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
 * Created by Francisco Huertas on 7/09/15.
 */
public class LastConstantValue extends FormulaWithTime {
    private static final Logger LOGGER = LogManager.getLogger(LastConstantValue.class.getName());

    private String parentId;
    private Formula lastFormula;
    private Formula prevFormula;
    private Long lastTime;

    public LastConstantValue(String id, Boolean publish, String parent) {
        super(id, publish, 0L);
        this.parentId = parent;
        lastFormula = null;
        lastTime = null;
    }

    @Override
    public boolean solveFormula(Map<String, Formula> solvedFormulas) {
        if (solvedFormulas.containsKey(this.id)) {
            return true;
        } else if (solvedFormulas.containsKey(parentId)) {
            Formula formula = solvedFormulas.get(parentId);
            Object actualValue = formula.getResult();
            if (prevFormula == null || actualValue.equals(prevFormula.getResult())){
                lastFormula = formula;
            }
            prevFormula = formula;
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Object getResult() {
        if (lastFormula!= null) {
            return lastFormula.getResult();
        } else {
            return null;
        }
    }

    @Override
    public Formula getFormula(){
        return lastFormula;
    }

    @Override
    public Long getTime(){
        try {
            FormulaWithTime formulaWithTime = (FormulaWithTime) lastFormula;
            return formulaWithTime.getTime();
        } catch (ClassCastException ex) {
            return lastTime;
        }
    }
}
