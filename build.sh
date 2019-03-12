#!/bin/sh

message="Please input -t/-p for TEST/PROD environment."
target="exit"

for i in "$@"
do
case $i in
    -t|--test)
        message="Delivered to TEST."
        target="ubuntu@54.186.212.101:/home/ubuntu"
    ;;
    -p|--prod)
        message="Delivered to PROD"
        target="ubuntu@54.186.212.101:/home/ubuntu"
    ;;
esac
done

if test ${target} != "exit"
then
    meteor build --architecture os.linux.x86_64  ../build/LittleNote
    scp -i /Users/weiqiwang/Documents/PEM/LittleNote.pem ../build/LittleNote/LittleNote.tar.gz ${target}
fi

echo ${message}