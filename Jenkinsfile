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
            dockerComposeBuild(commit)
        }

        stage 'Project tests', {
            def actions = [
                'lint': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_lint app npm run lint"
                    }, 'lint', commit)
                },
                'test': {
                    withCommitStatus({
                        sh "hostname; docker ps -a"
                        sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres"
                        sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
                        sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test app npm test"
                    }, 'test', commit)
                },
                'test:dependencies': {
                    withCommitStatus({
                        sh "hostname; docker ps -a"
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test_dependencies app npm run test:dependencies"
                    }, 'test:dependencies', commit)
                },
            ]

            def folder
            elifePullRequestOnly { prNumber ->
                folder = "${prNumber}"
            }
            elifeMainlineOnly {
                folder = 'develop'
            }
            actions['styleguide'] = {
                def targetUrl = "https://s3.amazonaws.com/ci-elife-xpub-styleguide/${folder}/index.html"
                withCommitStatus(
                    {
                        try {
                            sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --name elife-xpub_app_style_guide app npm run build:styleguide"
                            sh "docker cp elife-xpub_app_style_guide:/home/xpub/_build_styleguide ${folder}"
                            sh "aws s3 cp --recursive ${folder} s3://ci-elife-xpub-styleguide/${folder}"
                            echo "Styleguide URL: $targetUrl"
                        } catch (e) {
                            sh "docker-compose -f docker-compose.yml -f docker-compose.ci.yml down -v"
                        }
                    },
                    [
                        'name': 'styleguide',
                        'commit': commit,
                        'targetUrl': targetUrl,
                    ]
                )
            }

            try {
                sh "hostname; docker ps -a"
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres"
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
                parallel actions
            } finally {
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml down -v"
            }
        }

        stage 'Browser Tests', {
            try {
                sh "hostname; docker ps -a"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_clobber_db app bash -c 'npx pubsweet setupdb --clobber --username test --password password --email test@example.com'"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d app api-dummy"
                withCommitStatus({
                    sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run -p 10081:10081 --rm --name elife-xpub_app_test_browser test_browser"
                }, 'test:browser', commit)
            } finally {
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml down -v"
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

    elifeMainlineOnly {
        stage 'Downstream', {
            build job: '/dependencies/dependencies-elife-xpub-deployment-update-xpub', wait: false, parameters: [string(name: 'commit', value: commit)]
        }
    }
}
