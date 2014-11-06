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
    .state('jobs.details.info', {
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
    .state('jobs.details.content-views.new', {
        url: '/content_views/new',
        permission: 'create_content_views',
        collapsed: true,
        views: {
            '@jobs.details': {
                controller: 'JobsDetailsNewContentViewController',
                templateUrl: 'content-views/new/views/content-view-new.html'
            }
        }
    })

    .state('jobs.details.hostgroups', {
        url: '/hostgroups',
        permission: 'edit_jobs',
        collapsed: true,
        controller: 'JobDetailsHostgroupsController',
        templateUrl: 'integration/jobs/details/views/job-details-hostgroups.html'
    })
    .state('jobs.details.tests', {
        abstract: true,
        collapsed: true,
        templateUrl: 'integration/jobs/details/views/job-details-tests.html'
    })
    .state('jobs.details.tests.list', {
        url: '/tests',
        collapsed: true,
        permission: 'view_jobs',
        controller: 'JobDetailsTestsListController',
        templateUrl: 'integration/jobs/details/views/job-details-tests-table.html'
    })
    .state('jobs.details.tests.available', {
        url: '/tests/available',
        collapsed: true,
        permission: 'view_jobs',
        controller: 'JobDetailsTestsAvailController',
        templateUrl: 'integration/jobs/details/views/job-details-tests-table.html'
    })
    .state('jobs.details.tests.new-test', {
        url: '/tests/new',
        collapsed: true, 
        permission: 'create_tests',
        views: {
            '@jobs.details': {
                controller: 'NewTestController',
                templateUrl: 'integration/tests/new/views/new-test-form.html'
            }
        }
    })

    .state('jobs.details.to-environment', {
        url: '/to_environment',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobDetailsToEnvironmentController',
        templateUrl: 'integration/jobs/details/views/job-details-to-environment.html'
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
    .state('tests.new', {
        url: '/tests/new',
        permission: 'create_tests',
        collapsed: true,
        views: {
            'table': {
                templateUrl: 'integration/tests/views/tests-table-collapsed.html'
            },
            'action-panel': {
                controller: 'NewTestController',
                templateUrl: 'integration/tests/new/views/new-test.html'
            },
            'test-form@tests.new': {
                controller: 'NewTestController',
                templateUrl: 'integration/tests/new/views/new-test-form.html'           
            }
        }
    })

    .state('tests.details', {
        abstract: true,
        url: '/tests/:testId',
        permission: 'view_tests',
        collapsed: true,
        views: {
            'table': {
                templateUrl: 'integration/tests/views/tests-table-collapsed.html'
            },
            'action-panel': {
                controller: 'TestDetailsController',
                templateUrl: 'integration/tests/details/views/test-details.html'
            }
        }
    })
    .state('tests.details.info', {
        url: '/info',
        permission: 'edit_tests',
        collapsed: true,
        controller: 'TestDetailsInfoController',
        templateUrl: 'integration/tests/details/views/test-details-info.html'
    })



}]);