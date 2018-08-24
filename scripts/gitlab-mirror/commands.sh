function build() {
  docker build -t xpub/git-mirror:latest .
}

function docker-run() {
  ssh_dir=$HOME/Projects/elife/.ssh
  docker run \
  --name mirror \
  -v $ssh_dir:/root/.ssh \
  -it xpub/git-mirror:latest \
  https://github.com/elifesciences/elife-xpub.git \
  git@gitlab.com:elifesciences/elife-xpub.git
}

function run() {
  ./mirror \
    https://github.com/elifesciences/elife-xpub.git \
    git@gitlab.com:elifesciences/elife-xpub.git
}

function push() {
  docker push xpub/git-mirror:latest
}

build && docker-run
