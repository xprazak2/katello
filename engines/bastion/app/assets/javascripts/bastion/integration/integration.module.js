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
      permission: 'view_jobs',
      views: {
          'table': {
              templateUrl: 'integration/views/jobs-table-full.html'
              }
          }
    })
    .state('jobs.new', {
        url: '/jobs/new',
        permission: 'create_jobs',
        collapsed: true,
        views: {
            'table': {
                templateUrl: 'integration/views/jobs-table-collapsed.html'
            },
            'action-panel': {
                controller: 'NewJobController',
                templateUrl: 'integration/new/views/new-job.html'
            },
            'job-form@jobs.new': {
                controller: 'NewJobController',
                templateUrl: 'integration/new/views/new-job-form.html'
            }
        }
    })

    .state('jobs.details', {
        abstract: true,
        url: '/jobs/:jobId',
        permission: 'view_jobs',
        collapsed: true,
        views: {
            'table': {
                  templateUrl: 'integration/views/jobs-table-collapsed.html'
            },
            'action-panel': {
                  controller: 'JobDetailsController',
                  templateUrl: 'integration/details/views/job-details.html' 
            }
        }
    })
    .state('jobs.details.info',{
      url: '/info',
      permission: 'view_jobs',
      collapsed: true,
      controller: 'JobDetailsInfoController',
      templateUrl: 'integration/details/views/job-details-info.html'
    })
}]);