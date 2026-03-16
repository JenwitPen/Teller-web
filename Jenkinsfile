pipeline {
    agent any
    tools {
        nodejs 'node20' // Ensure this matches your Jenkins Global Tool Configuration
    }
    environment {
        DOCKER_IMAGE = "teller-web"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        APP_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Application') {
            steps {
                   // คัดลอก .env.dev มาเป็น .env เพื่อให้ Vite ใช้ค่าจากไฟล์นี้ตอน Build
                sh 'cp .env.dev .env'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Test Run & Health Check') {
            steps {
                script {
                    try {
                        sh "docker rm -f teller-web-preview || true"
                        sh "docker run -d --name teller-web-preview -p 8081:80 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        
                        echo "Waiting for web server to start..."
                        sh "sleep 5"
                        sh "curl -f http://localhost:8081"
                        echo "Health check passed!"
                    } catch (Exception e) {
                        echo "Health check failed! Fetching logs..."
                        sh "docker logs teller-web-preview"
                        throw e
                    } finally {
                        sh "docker stop teller-web-preview || true"
                        sh "docker rm teller-web-preview || true"
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    echo "Deploying ${DOCKER_IMAGE}:${DOCKER_TAG}..."
                    
                    sh "docker rm -f teller-web-container || true"
                    sh "docker run -d --name teller-web-container --restart unless-stopped -p ${APP_PORT}:80 ${DOCKER_IMAGE}:latest"
                    
                    echo "Deployment Successful! Web App is running on port ${APP_PORT}."
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        success {
            echo "CI/CD Pipeline for Teller Web finished successfully!"
        }
        failure {
            echo "CI/CD Pipeline failed. Check Jenkins logs."
        }
    }
}
