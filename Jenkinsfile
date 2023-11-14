pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.32.3-jammy' } }
   environment {
      HOME = '.'
      CORE_PORTAL_DEPLOYMENTS_REPO = 'git@github.com:TACC/Core-Portal-Deployments.git'

   }
   stages {
      stage('Checkout Core Portal Deployments Code') {
         steps {
            script {
               // Clone Core Portal Deployments repo into a subdirectory
               dir('core-portal-deployments') {
                  git branch: 'main',
                     credentialsId: "4895fa1e-c4c2-4152-b1d7-a05f16c78130",
                     url: "${CORE_PORTAL_DEPLOYMENTS_REPO}"
               }
            }
        }
      }

      stage('Read and transform portal config file') {
         steps {
            script {

               // Displaying the contents of the current directory and the config directory
               sh "ls -l"
               sh "ls -l core-portal-deployments/${params.Portal}/camino"

               // Copying the portal configuration file to the local workspace
               def sourceFilePath = "core-portal-deployments/${params.Portal}/camino"
               def destinationFilePath = 'settings'

               sh "cp ${sourceFilePath}/${params.Environment}.settings_custom.py ${destinationFilePath}/custom_portal_settings.py"
               sh "cp ${sourceFilePath}/${params.Environment}.env ${destinationFilePath}/.env.portal"

               // Running a Python script to process and output the portal settings as JSON
               sh "python3 utils/pythonHelper.py"

               echo "Using the following portal settings:"
               sh "cat settings/custom_portal_settings.json"
               sh "cat settings/.env.portal"
            }
         }
      }

      stage('install playwright') {
         steps {
            sh 'npm i -D @playwright/test'
            sh 'npx playwright install'
         }
      }

      stage('e2e-tests') {
         steps {
            withCredentials([usernamePassword(credentialsId: 'portal_tests_user', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
               sh 'npx playwright test --list'
               sh 'USERNAME=$USERNAME PASSWORD=$PASSWORD npx playwright test --project=setup'
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
         junit(
            allowEmptyResults: true,
            testResults: 'playwright-report/results.xml'
         )
         cleanWs()
      }
   }
}