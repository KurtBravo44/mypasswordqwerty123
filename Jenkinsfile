pipeline {
    agent {
        docker {
            image 'alpine:latest'
            args '-u root'
        }
    }
    stages {
        stage('test') {
            steps {
                sh 'apk update'
                sh 'apk add --no-cache openssh-client'
            }
        }
        stage('SSH') {
            steps {
                withCredentials([
                    string(credentialsId: 'IP', variable: 'ip'),
                    string(credentialsId: 'user', variable: 'user')
                ]) {
                    sshagent(['prod']){
                        sh """
                            ssh -o StrictHostKeyChecking=no ${user}@${ip} "
                            ls &&
                            pwd
                            "
                        """
                    }
                }   
            }
        }
    }
}
