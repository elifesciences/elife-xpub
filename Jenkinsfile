elifePipeline {
    def commit
    stage 'Checkout', {
        checkout scm
        commit = elifeGitRevision()
    }

    stage 'Project tests', {
        lock('elife-xpub--ci') {
            builderDeployRevision 'elife-xpub--ci', commit
            builderSmokeTests 'elife-xpub--ci', '/srv/elife-xpub'
            //builderProjectTests 'elife-xpub--ci', '/srv/elife-xpub'
        }
    }

    elifeMainlineOnly {
        stage 'Deploy on demo', {
            lock('elife-xpub--demo') {
                builderDeployRevision 'elife-xpub--demo', commit
                builderSmokeTests 'elife-xpub--demo', '/srv/elife-xpub'
            }
        }

        stage 'Approval', {
            elifeGitMoveToBranch commit, 'approved'
        }

        stage 'Merge into master', {
            // will be done in Jenkinsfile.prod when a prod server is created
            elifeGitMoveToBranch commit, 'master'
        }
    }
}
