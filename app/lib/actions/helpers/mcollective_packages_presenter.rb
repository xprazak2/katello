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
  module Helpers
    class McollectivePackagesPresenter

      extend Forwardable

      def_delegator :@action, :all_actions

      def initialize(action)
        @action = action
      end

      def task_input
        @action.input
      end

      def task_output
        mcoflow_actions.map(&:output)
      end

      def humanized_output
        task_output.pretty_inspect
      end

      private

      def mcoflow_actions
        all_actions.find_all do |action|
          action.is_a? Mcoflow::Action
        end
      end
    end
  end
end
