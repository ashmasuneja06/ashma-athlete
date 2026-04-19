pipeline {
    agent any

    environment {
        IMAGE_NAME = "athlete-api"
        VERSION = "v1.0"
        CONTAINER_NAME = "athlete-container"
    }

    stages {

        /* -------------------- 1. BUILD -------------------- */
        stage('Build') {
            steps {
                echo "Installing dependencies..."
                bat 'npm install'
            }
        }

        /* -------------------- 2. TEST -------------------- */
        stage('Test') {
            steps {
                echo "Running Jest tests..."
                bat 'npm test'
            }
        }

        /* -------------------- 3. CODE QUALITY (SONARQUBE) -------------------- */
        stage('Code Quality') {
            steps {
                echo "Running SonarQube analysis..."
                withSonarQubeEnv('SonarQube') {
                    bat 'sonar-scanner'
                }
            }
        }

        /* -------------------- 4. SECURITY SCAN -------------------- */
        stage('Security') {
            steps {
                echo "Running security audit..."
                bat 'npm audit --json > security-report.json || exit 0'
            }
        }

        /* -------------------- 5. DOCKER BUILD (DEPLOY PREP) -------------------- */
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat 'docker build -t %IMAGE_NAME%:%VERSION% .'
            }
        }

        /* -------------------- 6. DEPLOY (CONTAINER RUN) -------------------- */
        stage('Deploy') {
            steps {
                echo "Deploying container..."

                // Stop old container if exists (avoid port error)
                bat 'docker stop %CONTAINER_NAME% || exit 0'
                bat 'docker rm %CONTAINER_NAME% || exit 0'

                bat 'docker run -d --name %CONTAINER_NAME% -p 3000:3000 %IMAGE_NAME%:%VERSION%'
            }
        }

        /* -------------------- 7. RELEASE -------------------- */
        stage('Release') {
            steps {
                echo "Tagging release version..."
                bat 'docker tag %IMAGE_NAME%:%VERSION% %IMAGE_NAME%:latest'
            }
        }

        /* -------------------- 8. MONITORING -------------------- */
        stage('Monitoring') {
            steps {
                echo "Checking health endpoint..."
                bat 'curl http://localhost:3000/health || exit 0'
            }
        }
    }

    post {
        success {
            echo "PIPELINE SUCCESS - ALL STAGES COMPLETED"
        }
        failure {
            echo "PIPELINE FAILED - CHECK LOGS"
        }
    }
}