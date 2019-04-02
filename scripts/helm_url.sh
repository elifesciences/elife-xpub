#!/bin/bash
set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 INSTANCE_NAME"
    echo "Example: $0 pr-42"
    echo "Will return a public URL of the elife-xpub--\$INSTANCE_NAME Helm release"
    exit 1
fi

release_name="elife-xpub--${1}"
first_node_address=$(sudo -u elife -H kubectl get nodes -o json | jq -r '.items[0].status.addresses[] | select(.type=="ExternalDNS").address')
node_port=$(sudo -u elife -H kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services "$release_name")
echo "http://$first_node_address:$node_port"
