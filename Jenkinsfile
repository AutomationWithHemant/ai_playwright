pipeline {
    agent any
    
    environment {
        CI = "true" //You have to set this and jenkins will not set it automatically
    }
    parameters {
        choice(name: 'BROWSER', choices: ['chromium','firefox','webkit'],
                description: 'Playwright project to run')
    }
    options {
        timeout(time:30,unit: 'MINUTES')
    }
    triggers {
        pollSCM('H/5 * * * * *') // check github repo for new commits about every 5 minutes
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
            }
        }
        stage('Playwright tests') {
            steps {
                sh "npx playwright test --project=${param.BROWSER}"
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
        }
    }
}