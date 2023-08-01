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
            sh 'npx playwright test --list'
            sh 'npx playwright test'
         }
      }
   }
}