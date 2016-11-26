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
import com.google.common.collect.Queues;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;

/**
 * Created by Francisco Huertas on 2/09/15.
 */
public class PrevValue extends Formula {
    private static final Logger LOGGER = LogManager.getLogger(PrevValue.class.getName());
    private Integer steps;
    private String parentId;

    private Queue<Pair<Long, Formula>> values;

    public PrevValue(String id, Boolean publish, String parentId, Integer steps) {
        super(id, publish);
        this.parentId = parentId;
        this.steps = steps+1;
        values = Queues.newArrayDeque();
    }

    public void addValue(FormulaWithTime value) {
        values.add(Pair.of(value.getTime(),value));
        while (values.size() > steps) {
            values.poll();
        }

    }
    public void addValue(Formula value, Long time) {
        values.add(Pair.of(time, value));
        while (values.size() > steps) {
            values.poll();
        }
    }

    public Pair<Long, Formula> oldValue() {
        return values.peek();
    }


    @Override
    public boolean solveFormula(Map<String, Formula> solvedFormulas) {
        try {
            if (solvedFormulas.containsKey(this.id)) {
                return true;
            } else if (solvedFormulas.containsKey(parentId)) {
                Formula formula = solvedFormulas.get(parentId);
                try {
                    FormulaWithTime formulaWithTime = (FormulaWithTime) formula;
                    addValue(formulaWithTime);
                } catch (ClassCastException e) {
                    addValue(formula, new Date().getTime());
                }
                return true;
            } else {
                return false;
            }
        } catch (NoSuchElementException e){
            return false;
        }
    }

    @Override
    public Object getResult() {
        if (values.size() < steps) {
            return null;
        } else {
            return values.peek().getValue().getResult();
        }
    }

    @Override
    public Formula getFormula(){
        if (values.size() < steps) {
            return null;
        } else {
            return values.peek().getValue();
        }
    }
}
