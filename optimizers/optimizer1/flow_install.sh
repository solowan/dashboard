#!/bin/bash

ip1=$(echo $1 | sed 's/ip1=//')
port1=$(echo $3 | sed 's/port1=//')
ip2=$(echo $2 | sed 's/ip2=//')
port2=$(echo $4 | sed 's/port2=//')
protocol=$(echo $5 | sed 's/protocol=//')

if [ ! -z "$protocol" ]
then
	parameters_LtoR="$parameters_LtoR -p $protocol"
	parameters_RtoL="$parameters_RtoL -p $protocol"
fi
if [ ! -z "$ip1" ]
then
	parameters_LtoR="$parameters_LtoR -s $ip1"
	parameters_RtoL="$parameters_RtoL -d $ip1"
fi
if [ ! -z "$port1" ]
then
	parameters_LtoR="$parameters_LtoR --sport $port1"
	parameters_RtoL="$parameters_RtoL --dport $port1"
fi
if [ ! -z "$ip2" ]
then
	parameters_LtoR="$parameters_LtoR -d $ip2"
	parameters_RtoL="$parameters_RtoL -s $ip2"
fi
if [ ! -z "$port2" ]
then
	parameters_LtoR="$parameters_LtoR --dport $port2"
	parameters_RtoL="$parameters_RtoL --sport $port2"
fi

# Clean iptables rules
iptables -t mangle -F

# Install rules from left side (Optimizer 1 side) to right side (Optimizer 2 side)
iptables -t mangle -I PREROUTING $parameters_LtoR
iptables -t mangle -I POSTROUTING $parameters_LtoR

# Install rules from right side (Optimizer 2 side) to left side (Optimizer 1 side)
iptables -t mangle -I PREROUTING $parameters_RtoL
iptables -t mangle -I POSTROUTING $parameters_RtoL
