angular.module('Bastion.integration').factory('Job',
    ['BastionResource', function (BastionResource) {

        return BastionResource('/api/jobs/:id/:action', {id: '@id'}, {
          
          update: {method: 'PUT'}
          
        });
    }]
);