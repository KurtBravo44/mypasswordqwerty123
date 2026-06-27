pipeline {
    agent {
        docker {
            image 'alpine:latest'
        }
    }
    stages {
        stage('test') {
		    steps {
                sh 'ls -la'
                sh 'pwd'
                sh '''
                   echo "Hello!" 
                '''
            }
        }
    }
}
