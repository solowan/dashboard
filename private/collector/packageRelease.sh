rm -Rf releases/latest
cp -r development releases/latest
cd releases/latest
rm -Rf node_modules
rm -f collector.iml .gitignore
VERSION=`grep version package.json | cut -d":" -f2 | cut -d"\"" -f2`

tar -czf ../${VERSION}.tar.gz *

npm install
