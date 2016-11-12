rm -dfr releases/latest
rm -Rf releases/proxy-latest.tar.gz
cd java
mvn clean
mvn install

VERSION=`ls ./target/*.tar.gz | awk -F 'proxy[\-]' '{print $2}' 2>/dev/null | awk -F '[\.]tar' '{print$1}' 2> /dev/null`

cd ..
cp java/target/proxy-${VERSION}.tar.gz releases/
cp java/target/proxy-${VERSION}.tar.gz releases/proxy-latest.tar.gz

mkdir -p releases/latest
cd releases/latest
tar -zxvf ../proxy-${VERSION}.tar.gz

cd ../..
mkdir -p java/target/jsw/statistics-proxy-service/logs
chmod +x java/target/jsw/statistics-proxy-service/bin/*
cp java/src/main/resources/proxy.xml java/target/jsw/statistics-proxy-service/conf/
