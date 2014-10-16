angular.module('Bastion.integration').factory('Job',
    ['BastionResource', 'CurrentOrganization',
    function (BastionResource, CurrentOrganization) {

        return BastionResource('/api/organizations/:organizationId/jobs/:id/:action',
         {id: '@id', organizationId: CurrentOrganization}, {
          
          update: {method: 'PUT'}
          
        });
    }]
);