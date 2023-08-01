pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.32.3-jammy' } }
   environment {
      HOME = '.'
   }
   stages {
      stage('install playwright') {
         steps {
            sh 'npm i -D @playwright/test'
            sh 'npx playwright install'
         }
      }
      stage('e2e-tests') {
         steps {
            withCredentials([usernamePassword(credentialsId: 'portal_tests_user', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
               sh 'echo "username is $USERNAME"'
               sh 'npx playwright test --list'
               sh 'USERNAME=$USERNAME PASSWORD=$PASSWORD npx playwright test'
            }
         }
      }
   }
   post {
      always {
         publishHTML([
            allowMissing: true, 
            alwaysLinkToLastBuild: true, 
            keepAll: true, 
            reportDir: 'playwright-report', 
            reportFiles: 'index.html', 
            reportName: 'Playwright Test Report', 
            reportTitles: ''
         ])
      }
   }
}