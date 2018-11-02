# Build a Docker image and tag it with xpub/git-mirror
function build() {
  docker build -t xpub/git-mirror:latest ../
}

# Push the docker container
function push() {
  docker push xpub/git-mirror:latest
}

# Run the mirroring job in a docker container
function docker-run() {
  ssh_dir=$HOME/Projects/elife/.ssh
  docker run \
  --name mirror \
  -e TARGET=https://github.com/elifesciences/elife-xpub.git \
  -e MIRROR=git@gitlab.com:elifesciences/elife-xpub.git \
  -e GITLAB_PERSONAL_ACCESS_TOKEN \
  -e GITLAB_PROJECT_ID \
  -v $ssh_dir:/root/.ssh \
  -d xpub/git-mirror:latest
}
