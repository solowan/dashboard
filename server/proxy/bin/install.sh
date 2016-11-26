#! /bin/sh

BASEDIR=`dirname "$0"`/..
BASEDIR=`(cd "$BASEDIR"; pwd)`
cd "$BASEDIR"

mkdir logs

chmod +x bin/*
chmod +x lib/*