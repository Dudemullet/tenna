grunt watch &
pid[0]=$!
node server &
pid[1]=$!
trap "kill ${pid[0]} ${pid[1]}; exit 1" SIGINT
wait