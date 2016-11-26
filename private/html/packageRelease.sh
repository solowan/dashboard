echo "- Removing the previus version folder. (The compress file will not be deleted)"
echo "rm -Rf relesases/latest"
rm -Rf releases/latest
echo "- Copy the current version to the latest folder"
echo "cp -r development releases/latest"
cp -r development releases/latest
cd releases/latest
echo "- Removing the proyect files"
echo "cd releases/latest;rm -f *.iml .gitignore"
rm -f *.iml
rm -f .gitignore
echo "- Creating the new verion compress file"
VERSION=`cat VERSION`
echo "tar -czf releases/${VERSION}.tar.gz releases/latest/*"
tar -czf ../${VERSION}.tar.gz *

