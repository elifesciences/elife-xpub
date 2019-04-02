#!/bin/bash
set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 INSTANCE_NAME"
    echo "Example: $0 pr-42"
    echo "Will return a public URL of the elife-xpub--\$INSTANCE_NAME Helm release"
    exit 1
fi

release_name="elife-xpub--${1}"
# TODO: hardcoded ip of a node
node_ip=3.95.170.47
node_port=$(sudo -u elife -H kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services "$release_name")
echo "http://$node_ip:$node_port"
