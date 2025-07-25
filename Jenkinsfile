pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.49.1-noble' } }
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
                     credentialsId: "wma-portals-github",
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
            withCredentials([
               usernamePassword(credentialsId: 'portal_tests_user', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
               string(credentialsId: 'PORTALS_TEST_USER_MFA_SECRET', variable: 'MFA_SECRET')
            ]) {
               script {
                  if (params.Run_Type == 'Limited') {
                     sh 'npx playwright test --list --project=limited --project=unauthorized'
                     sh 'USERNAME=$USERNAME PASSWORD=$PASSWORD MFA_SECRET=$MFA_SECRET npx playwright test --project=limited --project=unauthorized'
                  } else {
                     sh 'npx playwright test --list --project=default --project=unauthorized'
                     sh 'USERNAME=$USERNAME PASSWORD=$PASSWORD MFA_SECRET=$MFA_SECRET npx playwright test --project=default --project=unauthorized'
                  }
               }
            }
         }
      }
   }
   post {
      always {
         script {
            def testResults = junit(
               allowEmptyResults: true,
               testResults: 'playwright-report/results.xml'
            )
            
            def buildStatus = currentBuild.result ?: 'SUCCESS'
            def statusEmoji = buildStatus == 'SUCCESS' ? ':white_check_mark:' : ':x:'
            def statusText = buildStatus == 'SUCCESS' ? 'PASSED' : 'FAILED'
            
            // Get run type for the message
            def runType = params.Run_Type ?: 'Default'

            def message = """
                  ${statusEmoji} *Core Portal E2E Tests - ${statusText}*
                  - *Portal:* ${params.Portal}
                  - *Environment:* ${params.Environment}
                  - *Run Type:* ${runType}
                  - *Tests:* Total: ${testResults.totalCount}, Passed: ${testResults.passCount}, Failed: ${testResults.failCount}, Skipped: ${testResults.skipCount}

                  <https://jenkins.portals.tacc.utexas.edu/job/Core_Portal_E2E_Tests/${currentBuild.number}/testReport/|View Test Report>
            """.stripIndent()
            
            slackSend(
               channel: "wma-e2e-slack-notifications", 
               message: message
            )
         }
         
         cleanWs()
      }
   }
}
