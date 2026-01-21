// AWS Amplify v6 Configuration for CampusQuick

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_UaA7SlujK',
      userPoolClientId: '4ph9lbse0sblru0u39m4squf0m',
      signUpVerificationMethod: 'code'
    }
  }
};

export default awsconfig;