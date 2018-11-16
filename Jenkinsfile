elifePipeline {
    def commit
    node('containers-jenkins-plugin') {
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
                            sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test PGDATABASE=test_browser docker-compose -f docker-compose.ci.yml run --rm --name elife-xpub_app_test_browser app bash -c 'npm run test:browser -- --screenshots /tmp/screenshots --screenshots-on-fails'"
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
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml up -d postgres"
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
                parallel actions
            } finally {
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.ci.yml down -v"
            }
        }

        stage 'Push image', {
            sh "docker push elifesciences/elife-xpub:${commit}"
            elifeMainlineOnly {
                sh "docker tag elifesciences/elife-xpub:${commit} elifesciences/elife-xpub:latest"
                sh "docker push elifesciences/elife-xpub:latest"
            }
        }
    }

    elifePullRequestOnly { prNumber ->
        stage 'Deploy for review', {
            checkout scm
            sh "scripts/helm_deploy.sh pr-${prNumber} ${commit}"
            def reviewUrl = sh(script: "scripts/helm_url.sh pr-${prNumber}", returnStdout: true).trim()
            echo "Review url: $reviewUrl"
            elifeGithubCommitStatus(
                commit,
                'success',
                'continuous-integration/jenkins/deploy-for-review',
                'Deploy for review URL (experimental)',
                reviewUrl
            )
        }
    }
}
