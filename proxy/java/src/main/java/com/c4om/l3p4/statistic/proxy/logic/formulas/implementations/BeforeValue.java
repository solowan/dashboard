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

import java.util.Date;
import java.util.Map;
import java.util.Queue;

/**
 * Created by Francisco Huertas on 3/09/15.
 */
public class BeforeValue extends FormulaWithTime {
    private static final Logger LOGGER = LogManager.getLogger(BeforeValue.class.getName());

    private Queue<Pair<Long, Formula>> values;
    private String parentId;
    private Long lapseTime;

    public BeforeValue(String id, Boolean publish, Long time,String parentId) {
        super(id, publish, time);
        this.parentId = parentId;
        this.lapseTime = time;
        values = Queues.newArrayDeque();

    }

    @Override
    public boolean solveFormula(Map<String, Formula> solvedFormulas) {
        if (solvedFormulas.containsKey(parentId)) {
            Long time;
            Formula formula = solvedFormulas.get(parentId);
            try {
                time = ((FormulaWithTime)formula).getTime();
            } catch (ClassCastException e) {
                time = new Date().getTime();
            }
            values.add(Pair.of(time,formula));
            Long limitTime = time - this.lapseTime;
            while (values.size() > 0 && values.peek().getKey() < limitTime) {
                values.poll();
            }
            return true;

        }
        return false;
    }

    @Override
    public Object getResult() {
        if (values.isEmpty()) {
            return null;
        }
        return values.peek().getValue().getResult();
    }

    @Override
    public Long getTime() {
        if (values.isEmpty()) {
            return null;
        }
        return values.peek().getKey();

    }

    @Override
    public Formula getFormula(){
        if (values.isEmpty()) {
            return null;
        }
        return values.peek().getValue();
    }
}
