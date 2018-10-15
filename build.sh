#!/bin/sh

message="Please input -t/-p for TEST/PROD environment."
target="exit"

for i in "$@"
do
case $i in
    -t|--test)
        message="Delivered to TEST."
        target="yang_chen@35.197.94.126:/home/yang_chen"
    ;;
    -p|--prod)
        message="Delivered to PROD"
        target="moac@52.43.43.32:/home/moac"
    ;;
esac
done

if test ${target} != "exit"
then
    meteor build --architecture os.linux.x86_64  ../build/LittleNote
    scp -i /Users/ychen/innowells/pem/gcp ../build/LittleNote/LittleNote.tar.gz ${target}
fi

echo ${message}