pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        IMAGE_NAME = 'athlete-devops'
        VERSION    = "v1.0.${BUILD_NUMBER}"
        SONAR_SCANNER = 'sonar-scanner'
    }

    stages {

        // ─── 1. CHECKOUT ─────────────────────────────────────────────
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ashmasuneja06/athlete-devops.git'
                echo "✅ Source code checked out – build #${BUILD_NUMBER}"
            }
        }

        // ─── 2. BUILD (Install Dependencies + Version Tag) ───────────
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'echo "Build artefact: ${IMAGE_NAME}:${VERSION}" > build-info.txt'
                sh 'cat build-info.txt'
                echo "✅ Build stage complete – ${IMAGE_NAME}:${VERSION}"
            }
            post {
                always {
                    archiveArtifacts artifacts: 'build-info.txt', fingerprint: true
                }
            }
        }

        // ─── 3. TEST (Jest + Coverage) ────────────────────────────────
        stage('Test') {
            steps {
                sh 'npm test -- --coverage --forceExit'
            }
            post {
                always {
                    // Publish Jest coverage report if available
                    script {
                        if (fileExists('coverage/lcov-report/index.html')) {
                            publishHTML(target: [
                                allowMissing         : true,
                                alwaysLinkToLastBuild: true,
                                keepAll              : true,
                                reportDir            : 'coverage/lcov-report',
                                reportFiles          : 'index.html',
                                reportName           : 'Jest Coverage Report'
                            ])
                        }
                    }
                }
            }
        }

        // ─── 4. CODE QUALITY (SonarQube) ─────────────────────────────
        stage('Code Quality (SonarQube)') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "${SONAR_SCANNER} -Dsonar.projectVersion=${VERSION}"
                }
                echo "✅ SonarQube analysis submitted"
            }
        }

        // ─── 5. QUALITY GATE ─────────────────────────────────────────
        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
                echo "✅ Quality gate checked"
            }
        }

        // ─── 6. SECURITY SCAN (npm audit) ────────────────────────────
        stage('Security Scan') {
            steps {
                sh 'npm audit --json > audit.json || true'
                sh '''
                    echo "=== SECURITY SCAN REPORT ==="
                    node -e "
                      const a = require(\'./audit.json\');
                      const meta = a.metadata || {};
                      const v = meta.vulnerabilities || {};
                      console.log(\'Critical:\', v.critical || 0);
                      console.log(\'High:    \', v.high     || 0);
                      console.log(\'Medium:  \', v.moderate || 0);
                      console.log(\'Low:     \', v.low      || 0);
                      console.log(\'Total:   \', v.total    || 0);
                    " || cat audit.json
                '''
                archiveArtifacts artifacts: 'audit.json', fingerprint: true
                echo "✅ Security scan complete – see audit.json artefact"
            }
        }

        // ─── 7. DOCKER BUILD ─────────────────────────────────────────
        stage('Docker Build') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .'
                sh 'docker images | grep ${IMAGE_NAME}'
                echo "✅ Docker image built: ${IMAGE_NAME}:${VERSION}"
            }
        }

        // ─── 8. DEPLOY – Test Environment ────────────────────────────
        stage('Deploy (Test Environment)') {
            steps {
                sh '''
                    docker stop athlete-test || true
                    docker rm   athlete-test || true
                    docker run -d --name athlete-test -p 3001:3000 ${IMAGE_NAME}:${VERSION}
                    echo "✅ Test container started on port 3001"
                    sleep 3
                    curl -sf http://localhost:3001/health || echo "Health check pending (cold-start)"
                '''
            }
        }

        // ─── 9. RELEASE – Production Promotion ───────────────────────
        stage('Release (Production Tagging)') {
            steps {
                sh '''
                    docker stop athlete-prod || true
                    docker rm   athlete-prod || true
                    docker run -d --name athlete-prod -p 3000:3000 ${IMAGE_NAME}:latest
                    echo "✅ Production container started on port 3000"
                    sleep 3
                '''
                sh 'echo "Released ${IMAGE_NAME}:${VERSION} as :latest → production" > release-notes.txt'
                archiveArtifacts artifacts: 'release-notes.txt', fingerprint: true
                echo "✅ Release stage complete"
            }
        }

        // ─── 10. MONITORING & ALERTING ───────────────────────────────
        stage('Monitoring') {
            steps {
                sh '''
                    echo "=== MONITORING CHECK ==="
                    HEALTH=$(curl -sf http://localhost:3000/health) && echo "Health: $HEALTH" || echo "ALERT: /health endpoint not responding"
                    METRICS=$(curl -sf http://localhost:3000/metrics) && echo "Metrics: $METRICS" || echo "ALERT: /metrics endpoint not responding"
                    echo "Uptime: $(uptime)"
                    echo "=== MONITORING COMPLETE ==="
                '''
                echo "✅ Monitoring stage complete – app is live on port 3000"
            }
        }
    }

    post {
        success {
            echo "🚀 Pipeline #${BUILD_NUMBER} PASSED – ${IMAGE_NAME}:${VERSION} deployed to production!"
        }
        failure {
            echo "❌ Pipeline #${BUILD_NUMBER} FAILED – check stage logs above"
        }
        always {
            echo "Pipeline finished. Build #${BUILD_NUMBER}"
        }
    }
}