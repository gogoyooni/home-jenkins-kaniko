pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            inheritFrom 'kube-agent'  // Pod Template에서 설정한 이름
            serviceAccount 'jenkins-admin'  // 기존에 생성한 서비스 계정 지정
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
                    - sleep
                    args:
                    - 99d
                    tty: true
                    securityContext:
                      runAsUser: 1000
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
        stage('Test Kubernetes Connection') {
            steps {
                container('kubectl') {
                    script {
                        sh """
                            echo "Testing kubectl connection..."
                            kubectl version --client
                            kubectl get pods
                        """
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