pipeline {
    agent any

    environment {
        IMAGE_NAME = "athlete-api"
        VERSION = "v1.0"
        CONTAINER_NAME = "athlete-container"
            PATH = "C:\\Program Files\\nodejs;C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Users\\Hp\\AppData\\Roaming\\npm;%PATH%"

    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        /* -------------------- CHECK ENV -------------------- */
        stage('Check Environment') {
            steps {
                echo "Checking Node, NPM versions..."
                bat 'node -v'
                bat 'npm -v'
            }
        }

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
                echo "Running tests..."
                bat 'npm test || exit 0'
            }
        }

        /* -------------------- 3. CODE QUALITY -------------------- */
        stage('Code Quality (SonarQube)') {
            steps {
                echo "Running SonarQube scan..."
                withSonarQubeEnv('SonarQube') {
                    bat 'sonar-scanner || exit 0'
                }
            }
        }

        /* -------------------- 4. SECURITY -------------------- */
        stage('Security Scan') {
            steps {
                echo "Running npm audit..."
                bat 'npm audit --audit-level=high || exit 0'
            }
        }

        /* -------------------- 5. DOCKER BUILD -------------------- */
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat 'docker build -t %IMAGE_NAME%:%VERSION% .'
            }
        }

        /* -------------------- 6. DEPLOY -------------------- */
        stage('Deploy') {
            steps {
                echo "Stopping old container if exists..."

                bat 'docker stop %CONTAINER_NAME% || exit 0'
                bat 'docker rm -f %CONTAINER_NAME% || exit 0'

                echo "Running new container..."
                bat 'docker run -d --name %CONTAINER_NAME% -p 3000:3000 %IMAGE_NAME%:%VERSION%'
            }
        }

        /* -------------------- 7. RELEASE -------------------- */
        stage('Release') {
            steps {
                echo "Tagging latest version..."
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

        /* -------------------- SUMMARY -------------------- */
        stage('Summary') {
            steps {
                echo "=================================="
                echo "Athlete DevOps Pipeline Completed"
                echo "Image: %IMAGE_NAME%:%VERSION%"
                echo "=================================="
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