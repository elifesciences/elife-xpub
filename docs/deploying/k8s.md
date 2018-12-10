# Setting up and using Kubernetes

This documentation is to help the developer debugging a particular pod related to a PR.

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

Change the cwd to the place you wish to install, in this example `~/.local/bin`. This directory must be on your `PATH`. Then download:

```
cd ~/.local/bin
wget [url from aws docs, see link below]
chmod +x aws-iam-authenticator
aws-iam-authenticator
```

[For more information refer to the AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/configure-kubectl.html)

### Make sure your `awscli` version is supported

The version of `awscli` should be >= 1.16

Check by running, and update if needed:

```
aws --version
```

### Update your local config to use the AWS cluster

This will change, but for an IAM user to be able to assume this role, it needs to be whitelisted at https://github.com/elifesciences/terraform-eks/blob/master/user-roles.tf

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
