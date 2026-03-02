pipeline {
    agent any

    tools {
        nodejs 'Node25.5'
    }

    triggers {
        githubPush()
    }

    environment {
        GITHUB_REPO  = 'Gonzagut99/ptc-admin'
        GITHUB_TOKEN = credentials('github-status-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHA = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    githubStatus('pending', 'CI pipeline started')
                }
            }
        }

        stage('Install') {
            steps {
                sh 'npm i -g pnpm && pnpm install --frozen-lockfile'
            }
        }

        stage('Lint') {
            steps {
                sh 'npx biome check .'
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm run build'
            }
        }
    }

    post {
        success {
            githubStatus('success', 'CI pipeline passed')
        }
        failure {
            githubStatus('failure', 'CI pipeline failed')
        }
    }
}

def githubStatus(String state, String description) {
    sh """
        curl -s -X POST \
            -H "Authorization: token ${GITHUB_TOKEN}" \
            -H "Content-Type: application/json" \
            -d '{"state":"${state}","description":"${description}","context":"jenkins/ci"}' \
            "https://api.github.com/repos/${GITHUB_REPO}/statuses/${GIT_COMMIT_SHA}"
    """
}
