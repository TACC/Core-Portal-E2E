pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.32.3-jammy' } }
   environment {
      HOME = '.'
   }
   withCredentials([usernamePassword(credentialsId: 'portal_tests_user', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
      stages {
         stage('install playwright') {
            steps {
               sh 'npm i -D @playwright/test'
               sh 'npx playwright install'
            }
         }
         stage('e2e-tests') {
            steps {
               sh 'echo "username is $USERNAME"'
               sh 'npx playwright test --list'
               sh 'npx playwright test USERNAME=$USERNAME PASSWORD=$PASSWORD'
            }
         }
      }
   }
}