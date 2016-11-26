#! /bin/sh

SERVICE_PATH=/var/proxy/java

JAVA_HOME=/usr/local/java/jdk1.7.0_17
PATH=$PATH:$HOME/bin:$JAVA_HOME/bin
JRE_HOME=/usr/local/java/jre1.7.0_17
PATH=$PATH:$HOME/bin:$JRE_HOME/bin
#export JAVA_HOME
#export JRE_HOME
#export PATH



start() {
    cd $SERVICE_PATH
    java -version
    echo "start"
}

stop() {
    echo "stop"

}

status(){
    echo "estatus"

}

case "$1" in
  start)
	start
	;;
  stop)
	stop
	;;
  restart)
    echo "Restart service"
    start
    stop
	;;
  status)
	status
	;;
  *)
	echo "Usage: $0 {start|stop|restart|status}" >&2
	exit 3
	;;
esac

exit 0
