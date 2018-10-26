elifePipeline {
    node('containers-jenkins-plugin') {
        def commit
        def image
        stage 'Checkout', {
            checkout scm
            commit = elifeGitRevision()
            image = "elifesciences/elife-xpub:$commit"
            sh "ln -sf .env.ci .env"
        }

        stage 'Build image', {
            // TODO: pull existing docker image if caching is not already effective
            sh "docker build --build-arg CI_COMMIT_SHA=${commit} -t ${image} ."
            //sh "docker push elifesciences/elife-xpub:$commit}"
        }

        stage 'Project tests', {
            sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml up -d postgres"
            sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm app bash -c "until echo > /dev/tcp/postgres/5432; do sleep 1; done"
            def actions = [
                'lint': {
                    withCommitStatus({
                        sh "docker run --rm ${image} npm run lint"
                    }, 'lint', commit)
                },
                'test': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm app npm test"
                    }, 'test', commit)
                },
                // TODO: not sure this can run in parallel with `test`?
                'test:browser': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.ci.yml up -d"
                        sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.ci.yml exec app npm run test:browser -- --screenshots /tmp/screenshots --screenshots-on-fails"
                        // TODO: archive screenshots
                    }, 'test:browser', commit)
                },
                'test:dependencies': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm app npm run test:dependencies"
                    }, 'test:dependencies', commit)
                },
            ]
            parallel actions
        }
    }
}
