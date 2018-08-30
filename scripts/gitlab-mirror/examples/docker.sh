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
  -v $ssh_dir:/root/.ssh \
  -d xpub/git-mirror:latest \
  https://github.com/elifesciences/elife-xpub.git \
  git@gitlab.com:elifesciences/elife-xpub.git
}
