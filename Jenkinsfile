elifePipeline {
    node('containers-jenkins-plugin') {
        def commit
        def image
        stage 'Checkout', {
            checkout scm
            commit = elifeGitRevision()
            image = "elifesciences/elife-xpub:$commit"
            sh "ln -s .env.ci .env"
        }

        stage 'Build image', {
            // TODO: pull existing docker image if caching is not already effective
            sh "docker build --build-arg CI_COMMIT_SHA=${commit} -t ${image} ."
            //sh "docker push elifesciences/elife-xpub:$commit}"
        }

        stage 'Project tests', {
            def actions = [
                'lint': {
                    sh "docker run --rm ${image} npm run lint"
                },
                'test': {
                    sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm app npm test"
                },
                'test:dependencies': {
                    sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm app npm run test:dependencies"
                },
            ]
            parallel actions
        }
    }
}
