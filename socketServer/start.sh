#! /bin/sh


SH_DIR=
x=`echo $0 | grep "^/"`
if test "${x}"; then
        SH_DIR=$(dirname $0)
else
        SH_DIR=$(dirname `pwd`/$0)
fi
cd $SH_DIR



set -v 
forever stop index.js
forever start -s index.js
