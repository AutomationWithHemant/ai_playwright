pipeline {
    agent any
    tools {
        nodejs 'node-lts' // must match the name in Manage Jenkins -> Tools exactly
    }
    environment {
        CI = "true"
        OPENAI_API_KEY = credentials('openai-api-key')
    }
    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'],
               description: 'Playwright browser project to run')
        booleanParam(name: 'INCLUDE_BDD', defaultValue: true,
                     description: 'Also run Cucumber BDD feature scenarios')
    }
    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
    }
    triggers {
        pollSCM('H/5 * * * *') // check GitHub repo for new commits every ~5 minutes
        //cron('H 0 * * *')      // Nightly regression run around midnight (see Topic 4)
         parameterizedCron('''
            TZ=Asia/Kolkata
            # Run Chromium + BDD at 12:15 AM IST every night
            15 0 * * * %BROWSER=chromium;INCLUDE_BDD=true
            # Run Firefox at 1:15 AM IST every night
            15 1 * * * %BROWSER=firefox;INCLUDE_BDD=false
            # Run WebKit at 2:15 AM IST every night
            15 2 * * * %BROWSER=webkit;INCLUDE_BDD=false
        ''')
    }

    stages {
        stage('Install & Clean') {
            steps {
                sh 'rm -rf allure-results allure-report playwright-report'
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        stage('Playwright + Cucumber BDD Tests') {
            steps {
                script {
                    if (params.INCLUDE_BDD) {
                        sh 'npx bddgen'
                        sh "npx playwright test --project=${params.BROWSER} --project=bdd-chromium"
                    } else {
                        sh "npx playwright test --project=${params.BROWSER}"
                    }
                }
            }
        }
        stage('AI Run Summary') {
            when {
                expression { return fileExists('results.json') }
            }
            steps {
                sh 'npx tsx scripts/summarise-run.ts || true'
            }
        }
    }

    post {
        always {
            sh '[ -f categories.json ] && mkdir -p allure-results && cp categories.json allure-results/categories.json || true'

            // 1. Publish Allure Report (automatically maintains build-to-build history & trends!)
            allure([
                includeProperties: false,
                jdk: '',
                commandline: 'allure-cli',
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])

            // 2. Keep your existing Playwright HTML report for side-by-side comparison
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])

            // 3. Archive AI markdown outputs (ai-analysis.md & run-summary.md)
            archiveArtifacts artifacts: 'ai-analysis.md, run-summary.md, healed-locators.jsonl', allowEmptyArchive: true
        }
    }
}
