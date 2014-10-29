angular.module('Bastion.integration', [
    'ngResource',
    'ui.router',
    'Bastion'
]);

angular.module('Bastion.integration').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('jobs', {
        abstract: true,
        controller: 'JobsController',
        templateUrl: 'integration/jobs/views/jobs.html'    
    })
    .state('jobs.index', {
      url: '/jobs',
      permission: 'view_jobs',
      views: {
          'table': {
              templateUrl: 'integration/jobs/views/jobs-table-full.html'
              }
          }
    })
    .state('jobs.new', {
        url: '/jobs/new',
        permission: 'create_jobs',
        collapsed: true,
        views: {
            'table': {
                templateUrl: 'integration/jobs/views/jobs-table-collapsed.html'
            },
            'action-panel': {
                controller: 'NewJobController',
                templateUrl: 'integration/jobs/new/views/new-job.html'
            },
            'job-form@jobs.new': {
                controller: 'NewJobController',
                templateUrl: 'integration/jobs/new/views/new-job-form.html'
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
                  templateUrl: 'integration/jobs/views/jobs-table-collapsed.html'
            },
            'action-panel': {
                  controller: 'JobDetailsController',
                  templateUrl: 'integration/jobs/details/views/job-details.html' 
            }
        }
    })
    .state('jobs.details.info',{
        url: '/info',
        permission: 'edit_jobs',
        collapsed: true,
        controller: 'JobDetailsInfoController',
        templateUrl: 'integration/jobs/details/views/job-details-info.html'
    })
    .state('jobs.details.content-views', {
        url: '/content_views',
        permission: 'edit_jobs',
        collapsed: true,
        controller: 'JobDetailsContentViewsController',
        templateUrl: 'integration/jobs/details/views/job-details-content-views.html'
    })
    .state('jobs.details.hostgroups',{
        url: '/hostgroups',
        permission: 'edit_jobs',
        collapsed: true,
        controller: 'JobDetailsHostgroupsController',
        templateUrl: 'integration/jobs/details/views/job-details-hostgroups.html'
    })

    .state('tests', {
        abstract: true,
        controller: 'TestsController',
        templateUrl: 'integration/tests/views/tests.html'
    })
    .state('tests.index', {
        url: '/tests',
        permission: 'view_tests',
        views: {
            'table': {
                templateUrl: 'integration/tests/views/tests-table-full.html'
            }
        }
    })

}]);