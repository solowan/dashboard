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

import java.util.Date;
import java.util.Map;

/**
 * Created by Francisco Huertas on 7/09/15.
 */
public class ResetAtValue extends FormulaWithTime {
    private static final Logger LOGGER = LogManager.getLogger(ResetAtValue.class.getName());
    private enum Operation {
        GT, LT, LE,GE, EQ, NE
    }

    private Integer resetValue;
    private Operation operation;
    private String parentId;
    private ValueWithTime lastFormula;
    private Long lastTime;

    /*
     * Operations >, <, >=, <=, =, !=
     */
    public ResetAtValue(String id, Boolean publish,  String parentId, String resetValue) {
        super(id, publish, 0L);
        extractOperationAndValue(resetValue);
        this.parentId = parentId;
    }

    @Override
    public boolean solveFormula(Map<String, Formula> solvedFormulas) {
        if (solvedFormulas.containsKey(this.id)) {
            return true;
        } else if (solvedFormulas.containsKey(parentId)) {
            Formula formula = solvedFormulas.get(parentId);
            Object actualValue = formula.getResult();
            boolean result = (ResetAtValue.operate(this.operation,resetValue,actualValue));
            if (result){
                try {
                    lastTime = ((FormulaWithTime) formula).getTime();
                } catch (ClassCastException e) {
                    lastTime = new Date().getTime();
                }
                lastFormula = new ValueWithTime(id,publish,lastTime,formula.getResult());
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Object getResult() {
        if (lastFormula != null) {
            return lastFormula.getResult();
        }
        return null;
    }

    private void  extractOperationAndValue(String resetValue) {
        resetValue = resetValue.trim();
        Operation op = null;
        for (int i = 0; i < resetValue.length();i++) {
            switch (resetValue.charAt(i)){
                case ' ':
                    break;
                case '<':
                    op = Operation.LT;
                    break;
                case '>':
                    op = Operation.GT;
                    break;
                case '=':
                    if (op == null){
                        op = Operation.EQ;
                    } else if(op == Operation.GT){
                        op = Operation.GE;
                    } else if(op == Operation.GT){
                        op = Operation.LE;
                    }
                    operation = op;
                    this.resetValue = Integer.valueOf(resetValue.substring(i+1));
                    return;
                case '!':
                    operation = Operation.NE;
                    this.resetValue = Integer.valueOf(resetValue.substring(i+1));
                    return;
                default:
                    if (op != null) {
                        operation = op;
                    } else {
                        operation = Operation.EQ;
                    }
                    this.resetValue = Integer.valueOf(resetValue.substring(i));
                    return;
            }
        }
    }

    public static boolean operate(Operation op, Object v1, Object v2) {

        switch (op){
            case GT:
                try {
                    Integer op1 = Integer.valueOf(v1.toString());
                    Integer op2 = Integer.valueOf(v2.toString());
                    return op1 < op2;
                } catch (NumberFormatException e) {
                    return false;
                }
            case GE:
                try {
                    Integer op1 = Integer.valueOf(v1.toString());
                    Integer op2 = Integer.valueOf(v2.toString());
                    return op1 <= op2;
                } catch (NumberFormatException e) {
                    return false;
                }
            case LT:
                try {
                    Integer op1 = Integer.valueOf(v1.toString());
                    Integer op2 = Integer.valueOf(v2.toString());
                    return op1 > op2;
                } catch (NumberFormatException e) {
                    return false;
                }
            case LE:
                try {
                    Integer op1 = Integer.valueOf(v1.toString());
                    Integer op2 = Integer.valueOf(v2.toString());
                    return op1 >= op2;
                } catch (NumberFormatException e) {
                    return false;
                }
            case NE:
                try {
                    return !Double.valueOf(v1.toString()).equals(Double.valueOf(v2.toString()));
                } catch (NumberFormatException e){
                    return !v1.equals(v2);
                }
            case EQ:
                try {
                    return Double.valueOf(v1.toString()).equals(Double.valueOf(v2.toString()));
                } catch (NumberFormatException e){
                    return v1.equals(v2);
                }

            default:
                return false;
        }

    }

     @Override
    public Formula getFormula(){
         return lastFormula;
     }

    @Override
    public Long getTime(){
        return lastFormula.getTime();
    }

    @Override
    public String toString(){
        return lastFormula.toString();
    }

}
