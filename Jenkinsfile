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
                    volumeMounts:
                    - mountPath: /root/.kube
                      name: kube-config
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
                    sh """
                    # 현재 사용자 확인
                    whoami
                    # 홈 디렉토리 확인
                    echo \$HOME
                    # kubeconfig 파일 확인
                    ls -la /root/.kube/
                    
                    kubectl get pods
                    echo "DOCKER_IMAGE=${DOCKER_IMAGE}, DOCKER_TAG=${DOCKER_TAG}"
                    sed -i 's|\${DOCKER_IMAGE}|${DOCKER_IMAGE}|g' k8s/deployment.yaml
                    sed -i 's|\${DOCKER_TAG}|${DOCKER_TAG}|g' k8s/deployment.yaml
                    kubectl apply -f k8s/deployment.yaml
                """
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