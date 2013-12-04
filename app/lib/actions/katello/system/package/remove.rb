#
# Copyright 2013 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Actions
  module Katello
    module System
      module Package
        class Remove < Actions::EntryAction

          include Helpers::Presenter

          def plan(system, packages)
            action_subject(system, :packages => packages)
            plan_action(Pulp::Consumer::ContentUninstall,
                        consumer_uuid: system.uuid,
                        type: 'rpm',
                        args: packages)
          end

          def humanized_name
            _("Remove package")
          end

          def presenter
            return @presenter if @presenter
            @presenter = Helpers::PulpPackagesPresenter.new(self, Pulp::Consumer::ContentUninstall)
          end

          def humanized_input
            args = task_input[:packages] || task_input[:groups] || []
            [args.join(", ")] + Helpers::Humanizer.new(self).input
          end

          def cli_example
            if task_input[:organization].nil? ||
                  task_input[:system].nil? ||
                  task_input[:packages].nil?
              return ""
            end
        <<-EXAMPLE
katello system packages --org '#{task_input[:organization][:name]}'\\
                        --name '#{task_input[:system][:name]}'\\
                        --remove '#{task_input[:packages].join(',')}'
        EXAMPLE
          end

        end
      end
    end
  end
end
