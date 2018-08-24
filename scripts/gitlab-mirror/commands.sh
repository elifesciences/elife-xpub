function build() {
  docker build -t xpub/gitlab-mirror:latest .
}

function docker-run() {
  ssh_dir=$HOME/Projects/elife/.ssh
  docker run \
  --name mirror \
  -v $ssh_dir:/root/.ssh \
  -it xpub/gitlab-mirror:latest \
  https://github.com/elifesciences/elife-xpub.git \
  git@gitlab.com:elifesciences/elife-xpub.git
}

function run() {
  ./mirror \
    https://github.com/elifesciences/elife-xpub.git \
    git@gitlab.com:elifesciences/elife-xpub.git
}

build && docker-run
