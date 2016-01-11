'use strict';

angular.module('classCaptureApp')
  .value('MIN_PASSWORD_LENGTH', 5)
  .value('EMAIL_DOMAIN_NAME', 'illinois.edu')
  .controller('LoginCtrl', ($scope, _, $state, $rootScope, authService, MIN_PASSWORD_LENGTH, EMAIL_DOMAIN_NAME) => {
    authService.getLoggedInUser()
    .then(user => {
        $state.go('^.home'); // move to logged in users home screen
    });

    $scope.EMAIL_DOMAIN_NAME = EMAIL_DOMAIN_NAME;
    $scope.MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH;

    $scope.email = '';
    $scope.password = '';
    $scope.badLogin = false;
    $scope.forms = {
        login: {
            info: {
                email: '',
                password: ''
            }
        },
        register: {
            info: {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                confirmPassword: ''
            }
        }
    };

    $scope.alertMessages = [];

    $scope.validCredentials = (form, {email, password, confirmPassword}) => {
        confirmPassword = confirmPassword || password;
        return _.isEmpty(form.$error) && _.endsWith(email, EMAIL_DOMAIN_NAME) && password.length >= MIN_PASSWORD_LENGTH && password === confirmPassword;
    };

    $scope.login = () => {
        authService.login($scope.forms.login.info)
        .then(user => {
            $state.go('front.home');
        })
        .catch(err => {
            $scope.badLogin = true;
        });
    };

    $scope.register = () => {
        var registrationInfo = _.omit($scope.forms.register.info, 'confirmPassword');
        authService.register(registrationInfo)
        .then(user => {
            $state.go('front.home');
        })
        .catch(err => {
            $scope.alertMessages = [];

            if (err.data.error === 'E_VALIDATION') {
                // We know its a validation error, provide some feedback to user
                _.forEach(err.data.invalidAttributes, (reasons, attr) => {
                    var newMessages = _.pluck(reasons, 'message');
                    $scope.alertMessages = $scope.alertMessages.concat(newMessages);
                });
            }
            
            $scope.badLogin = true;
        });
    };
  });
