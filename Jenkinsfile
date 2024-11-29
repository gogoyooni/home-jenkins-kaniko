pipeline {
    agent {
        kubernetes {
            yaml '''
                kind: Pod
                spec:
                  serviceAccountName: jenkins-admin
                  containers:
                  - name: kaniko
                    image: gcr.io/kaniko-project/executor:debug
                    command:
                    - /busybox/cat
                    tty: true
                    volumeMounts:
                    - name: docker-config
                      mountPath: /kaniko/.docker
                  - name: kubectl
                    image: bitnami/kubectl:latest
                    command:
                    - cat
                    tty: true
                  volumes:
                  - name: docker-config
                    secret:
                      secretName: docker-credentials
                      items:
                        - key: .dockerconfigjson
                          path: config.json
                  - name: kube-config
                    secret:
                      secretName: kube-config    # kubectl 설정을 위한 시크릿
            '''
        }
    }
    
    environment {
        DOCKER_IMAGE = "taeyoondev/kaniko-home-test"
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build and Push Docker Image') {
            steps {
                container('kaniko') {
                    script {
                        sh '''
                            /kaniko/executor \
                            --context=${WORKSPACE} \
                            --dockerfile=${WORKSPACE}/Dockerfile \
                            --destination=${DOCKER_IMAGE}:${DOCKER_TAG}
                        '''
                    }
                }
            }
        }

         stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    withCredentials([file(credentialsId: 'mykubeconfig', variable: 'KUBECONFIG')]) {
                        script {
                            // 환경변수 치환을 위한 sed 명령어 사용
                            sh """                               
                                echo "DOCKER_IMAGE=${DOCKER_IMAGE}, DOCKER_TAG=${DOCKER_TAG}"
                            """
                    }
                }
            }
        }
    }
}

    post {
        always {
            cleanWs()  // 워크스페이스 정리
        }
    }
}