/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 **/

describe('Factory: Organization', function() {
    var $httpBackend,
        task,
        Organization,
        organizations, flushAfterFunction = true;

    beforeEach(module('Bastion.organizations', 'Bastion.test-mocks'));

    beforeEach(module(function($provide) {
        organizations = {
            records: [
                { name: 'ACME', id: 1},
                { name: 'ECME', id: 2}
            ],
            total: 2,
            subtotal: 2
        };

        task = {id: 'task_id'};
        $provide.value('CurrentOrganization', 'ACME');
    }));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        Organization = $injector.get('Organization');
    }));

    afterEach(function() {
        if (flushAfterFunction) {
            $httpBackend.flush();
        };

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('provides a way retrieve an organization', function() {
        $httpBackend.expectGET('/api/v2/organizations').respond(organizations);
        Organization.queryPaged(function(organizations) {
            expect(organizations.records.length).toBe(2);
        });
    });

    it('provides a way to auto attach available subscriptions to systems', function() {
        $httpBackend.expectPOST('/api/v2/organizations/ACME/autoattach_subscriptions').respond(task);
        Organization.autoAttachSubscriptions({id: 'ACME'}, function(results) {
            expect(results.id).toBe(task.id);
        });
    });

    it('provides a way to get repo discover', function() {
        $httpBackend.expectPOST('/api/v2/organizations/ACME/repo_discover').respond(task);
        Organization.repoDiscover({ id: 'ACME' , url: '/foo'});
    });

    it('provides a way to cancel repo discover', function() {
        $httpBackend.expectPOST('/api/v2/organizations/ACME/repo_discover').respond(task);
        Organization.repoDiscover({ id: 'ACME' , url: '/foo'});
    });

    it('provides a way to get an org', function() {
        $httpBackend.expectGET('/api/v2/organizations/ACME').respond(organizations.records[0]);

        Organization.get({ id: 'ACME' }, function(response) {
            expect(response.id).toBe(1);
        });
    });

    it("provides a way to get the organizations's readableEnvironments", function() {
        var pathIndex, envIndex, readableEnvs,
            envs = [
            {
                "environments": [
                    {   "id": 1,
                        "name": "Library",
                        "prior": null,
                        "permissions": {
                            "readable": true,
                        }
                    },
                    {
                        "id": 2,
                        "name": "new-env",
                        "prior": {
                            "name": "Library",
                            "id": 1
                        },
                        "permissions": {
                            "readable": true,
                        }
                    },
                ]
            },
            {
                "environments": [
                    {
                        "id": 1,
                        "name": "Library",
                        "prior": null,
                        "permissions": {
                            "readable": true,
                        }
                    },
                    {
                        "id": 5,
                        "name": "new-path",
                        "prior": {
                            "name": "Library",
                            "id": 1
                        },
                        "permissions": {
                            "readable": false,
                        }
                    }
                ]
            }
        ];

        //testing the transform
        // from [{environments : [{id, name, permissions: {readable : true}}]}]
        // to [[{id, name, select: true}]]
        $httpBackend.expectGET('/api/v2/organizations/ACME/environments/paths').respond(envs);
        readableEnvs = Organization.readableEnvironments({"id":"ACME"});
        $httpBackend.flush ();
        flushAfterFunction = false;
        expect(readableEnvs.length).toBe(2);

        for (pathIndex = 0; pathIndex < readableEnvs.length; ++pathIndex) {
            for (envIndex = 0; envIndex < readableEnvs[pathIndex].length; ++envIndex) {
                expect(readableEnvs[pathIndex][envIndex].id).toBe(envs[pathIndex].environments[envIndex].id);
                expect(readableEnvs[pathIndex][envIndex].name).toBe(envs[pathIndex].environments[envIndex].name);
                expect(readableEnvs[pathIndex][envIndex].select).toBe(envs[pathIndex].environments[envIndex].permissions.readable);
            }
        }

    });
});
