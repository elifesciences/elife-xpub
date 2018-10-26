elifePipeline {
    node('containers-jenkins-plugin') {
        def commit
        def image
        stage 'Checkout', {
            checkout scm
            commit = elifeGitRevision()
            image = "elifesciences/elife-xpub:$commit"
        }

        stage 'Build image', {
            // TODO: pull existing docker image if caching is not already effective
            sh "docker build --build-arg CI_COMMIT_SHA=${commit} -t ${image} ."
            //sh "docker push elifesciences/elife-xpub:$commit}"
        }

        stage 'Project tests', {
            parallel [
                'lint': {
                    sh "docker run ${image} npm run lint"
                },
            ]
        }
    }
}
