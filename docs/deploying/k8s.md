# Setting up and using Kubernetes

## Install `kubectl`

There are [many ways to install kubctl](https://kubernetes.io/docs/tasks/tools/install-kubectl/). You may also wish to refer to the commands in the formula too:
https://github.com/elifesciences/builder-base-formula/blob/master/elife/kubectl.sls

On Ubuntu I used snap:

```
sudo snap install kubectl --classic
```

Test the client installation of `kubectl`:

```
kubectl version
```

This should report the client version. But don't worry if there are errors for the server version as this is not configured yet.

### Install aws-iam-authenticator

Change the cwd to the place you wish to install and follow the following:

```
cd ~/.local/bin
wget https://amazon-eks.s3-us-west-2.amazonaws.com/1.10.3/2018-07-26/bin/linux/amd64/aws-iam-authenticator
chmod +x aws-iam-authenticator
aws-iam-authenticator
```

### Make sure your `awscli` is the correct version

The version of `awscli` should be >= 1.16

Check by running, and update if needed:

```
aws --version
```

### Update your local config to use the AWS cluster

```
aws eks update-kubeconfig --name kubernetes--demo --role-arn arn:aws:iam::512686554592:role/kubernetes--demo--AmazonEKSUserRole
```

### Test everything works

You should now get both the client and server version correctly when running:

```
kubectl version
```

The following command should list the pods in the cluster.

```
kubectl get pods
```

## Install `helm`

Helm can be downloaded and installed into an appropriate directory, thus:

```
cd ~/.local/bin
wget https://storage.googleapis.com/kubernetes-helm/helm-v2.11.0-linux-amd64.tar.gz
tar xvf helm-v2.11.0-linux-amd64.tar.gz
ln -s linux-amd64/helm .
```

Test by running:

```
helm ls
```

Then check a particular pod (in this case `elife-xpub--pr-985`) with:

```
export POD=elife-xpub--pr-985
helm status ${POD}
```

Now we can get the host and port to gain access to the pod with:

```
export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services ${POD})
export NODE_IP=35.172.178.78 # TODO: use DNS
```

You should now be able to get access to the running application with:

```
curl http://${NODE_IP}:${NODE_PORT}
```
