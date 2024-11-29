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
                    - sleep
                    args:
                    - "3600"
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
        stage('Test Kubernetes Connection') {
                steps {
                    kubernetesDeploy configs: "k8s/deployment.yaml", kubeconfigId: 'mykubeconfig'
                    sh "echo 'test'" 
                }
            }
    }
    


    post {
        always {
            cleanWs()  // 워크스페이스 정리
        }
    }

}