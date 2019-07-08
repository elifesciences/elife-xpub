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
            // may have been written by a container in which this repository was mounted as a volume
            sh "sudo rm -rf .config"
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
                  try {
                      withCommitStatus({
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres"
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test app npx pubsweet migrate"
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test app npm test"
                      }, 'test', commit)
                  } finally {
                      sh "docker ps -a"
                      sh "mkdir -p build/postgres-logs && sh -c \"docker logs elife-xpub_postgres_1 > build/postgres-logs/unit-postgres-output.txt\""
                      sh "sh -c \"docker cp elife-xpub_postgres_1:/var/lib/postgresql/data/logs/. build/postgres-logs/\""
                      archiveArtifacts artifacts: "build/postgres-logs/**/*", allowEmptyArchive: true
                      sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml down -v"
                      sh "sudo rm -rf ./build/* || true"
                  }
                },
                'test:dependencies': {
                    withCommitStatus({
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
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres"
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh -t 15 postgres:5432'"
                parallel actions
            } finally {
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml down -v"
            }
        }

    }

    elifeMainlineOnly {
        stage 'Downstream', {
            build job: '/dependencies/dependencies-elife-xpub-deployment-update-xpub', wait: false, parameters: [string(name: 'commit', value: commit)]
        }
    }
}
