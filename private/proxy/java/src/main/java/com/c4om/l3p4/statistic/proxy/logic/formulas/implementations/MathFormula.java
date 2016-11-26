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
import org.apache.commons.jexl2.Expression;
import org.apache.commons.jexl2.JexlContext;
import org.apache.commons.jexl2.JexlEngine;
import org.apache.commons.jexl2.MapContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by Francisco Huertas on 2/09/15.
 */
public class MathFormula extends FormulaWithTime {
    private static final Logger LOGGER = LogManager.getLogger(MathFormula.class.getName());
    private static final JexlEngine jexl = new JexlEngine();

    static {
        jexl.setCache(512);
        jexl.setLenient(false);
        jexl.setSilent(false);
    }

    private String sFormula;
    private Map<String,String> varAlias;
    private Expression formula;

    private Object result;


    public MathFormula(String id, Boolean publish,String formula,Map<String,String> varAlias) {
        super(id, publish,new Date().getTime());
        this.sFormula = formula;
        this.varAlias = varAlias;
        this.formula = jexl.createExpression(sFormula);
    }


    @Override
    public boolean solveFormula(Map<String, Formula> solvedFormulas) {
        List<String> solvedVars = varAlias.keySet().stream().filter(key-> solvedFormulas.containsKey(key)).collect(Collectors.toList());
        if (varAlias.size() != solvedVars.size()){
            return false;
        } else {
            try {
                JexlContext context = new MapContext();
                solvedVars.forEach(var->
                        context.set(varAlias.get(var),solvedFormulas.get(var).getResult().toString())
                );
                result = this.formula.evaluate(context);
                setTime(new Date().getTime());
            } catch (Exception e) {
                return false;
                /*The operation cannot be done*/
            }
            return true;
        }
    }

    @Override
    public Object getResult() {
        return result;
    }
}
