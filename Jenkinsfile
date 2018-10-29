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
            sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml build"
            //sh "docker push elifesciences/elife-xpub:$commit}"
        }

        stage 'Project tests', {
            def actions = [
                'lint': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm --name elife-xpub_app_lint app npm run lint"
                    }, 'lint', commit)
                },
                'test': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm --name elife-xpub_app_test app npm test"
                    }, 'test', commit)
                },
                // TODO: not sure this can run in parallel with `test`?
                'test:browser': {
                    try {
                        withCommitStatus({
                            sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test PGDATABASE=test_browser docker-compose -f docker-compose.ci.yml run --rm --name elife-xpub_app_test_browser app bash -c './scripts/wait-for-it.sh postgres:5432 && npm run test:browser -- --screenshots /tmp/screenshots --screenshots-on-fails'"
                        }, 'test:browser', commit)
                    } finally {
                        archiveArtifacts artifacts: "build/screenshots/*", allowEmptyArchive: true
                    }
                },
                'test:dependencies': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm --name elife-xpub_app_test_dependencies app npm run test:dependencies"
                    }, 'test:dependencies', commit)
                },
            ]
            try {
                parallel actions
            } finally {
                sh "docker-compose -f docker-compose.ci.yml down -v"
            }
        }
    }
}
