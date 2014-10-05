angular.module('Bastion.integration', [
    'ngResource',
    'ui.router',
    'Bastion'
]);

angular.module('Bastion.integration').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('jobs', {
        abstract: true,
        controller: 'JobsController',
        templateUrl: 'integration/views/jobs.html'    
    })
    .state('jobs.index', {
      url: '/jobs',
      views: {
          'table': {
              templateUrl: 'integration/views/jobs-table-full.html'
              }
          }
    });
}]);