#!/bin/bash

ip1=$(echo $1 | sed 's/ip1=//')
port1=$(echo $3 | sed 's/port1=//')
ip2=$(echo $2 | sed 's/ip2=//')
port2=$(echo $4 | sed 's/port2=//')


if [ ! -z "$ip1" ] && [ -z "$port1" ] && [ -z "$ip2" ] && [ -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 0.0.0.0/0" | awk '{print$2}'


elif [ -z "$ip1" ] && [ ! -z "$port1" ] && [ -z "$ip2" ] && [ -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "0.0.0.0/0 0.0.0.0/0 .*. spt*.:$port1" | awk '{print$2}'


elif [ ! -z "$ip1" ] && [ ! -z "$port1" ] && [ -z "$ip2" ] && [ -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 0.0.0.0/0 .*. spt*.:$port1" | awk '{print$2}'


elif [ -z "$ip1" ] && [ -z "$port1" ] && [ ! -z "$ip2" ] && [ -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "0.0.0.0/0 $ip2" | awk '{print$2}'


elif [ ! -z "$ip1" ] && [ -z "$port1" ] && [ ! -z "$ip2" ] && [ -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 $ip2" | awk '{print$2}'


elif [ -z "$ip1" ] && [ ! -z "$port1" ] && [ ! -z "$ip2" ] && [ -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$0.0.0.0/0 $ip2 .*. spt*.:$port1" | awk '{print$2}'


elif [ ! -z "$ip1" ] && [ ! -z "$port1" ] && [ ! -z "$ip2" ] && [ -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 $ip2 .*. spt*.:$port1" | awk '{print$2}'


elif [ -z "$ip1" ] && [ -z "$port1" ] && [ -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "0.0.0.0/0 0.0.0.0/0 .*. dpt*.:$port2" | awk '{print$2}'


elif [ ! -z "$ip1" ] && [ -z "$port1" ] && [ -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 0.0.0.0/0 .*. dpt*.:$port2" | awk '{print$2}'


elif [ -z "$ip1" ] && [ ! -z "$port1" ] && [ -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "0.0.0.0/0 0.0.0.0/0 .*. spt*.:$port1 dpt*.:$port2" | awk '{print$2}'


elif [ ! -z "$ip1" ] && [ ! -z "$port1" ] && [ -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 0.0.0.0/0 .*. spt*.:$port1 dpt*.:$port2" | awk '{print$2}'


elif [ -z "$ip1" ] && [ -z "$port1" ] && [ ! -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "0.0.0.0/0 $ip2 .*. dpt*.:$port2" | awk '{print$2}'


elif [ ! -z "$ip1" ] && [ -z "$port1" ] && [ ! -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 $ip2 .*. dpt*.:$port2" | awk '{print$2}'


elif [ -z "$ip1" ] && [ ! -z "$port1" ] && [ ! -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "0.0.0.0/0 $ip2 .*. spt*.:$port1 dpt*.:$port2" | awk '{print$2}'


elif [ ! -z "$ip1" ] && [ ! -z "$port1" ] && [ ! -z "$ip2" ] && [ ! -z "$port2" ]
then
	iptables -t mangle -vnx -L POSTROUTING  | tr -s ' ' | grep "$ip1 $ip2 .*. spt*.:$port1 dpt*.:$port2" | awk '{print$2}'

fi