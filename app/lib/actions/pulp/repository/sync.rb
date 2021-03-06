#
# Copyright 2014 Red Hat, Inc.
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
  module Pulp
    module Repository
      class Sync < Pulp::AbstractAsyncTask

        include Helpers::Presenter

        input_format do
          param :pulp_id
        end

        def invoke_external_task
          sync_options = {}

          if ::Katello.config.pulp.sync_KBlimit
            # set bandwidth limit
            sync_options[:max_speed] ||= ::Katello.config.pulp.sync_KBlimit
          end
          if ::Katello.config.pulp.sync_threads
            # set threads per sync
            sync_options[:num_threads] ||= ::Katello.config.pulp.sync_threads
          end

          output[:pulp_tasks] = pulp_tasks =
              pulp_resources.repository.sync(input[:pulp_id], { override_config: sync_options })
          pulp_tasks
        end

        def run_progress
          presenter.progress
        end

        def run_progress_weight
          10
        end

        def presenter
          Sync::Presenter.new(self)
        end

        def rescue_strategy_for_self
          # There are various reasons the syncing fails, not all of them are
          # fatal: when fail on syncing, we continue with the task ending up
          # in the warning state, but not locking further syncs
          Dynflow::Action::Rescue::Skip
        end

        class Presenter < Helpers::Presenter::Base

          # TODO: in Rails 4.0, the logic is possible to use from ActiveSupport
          include ActionView::Helpers::NumberHelper

          def humanized_output
            if action.external_task
              humanized_details
            end
          end

          def progress
            if sync_task && size_total > 0
              size_done.to_f / size_total
            else
              0.01
            end
          end

          private

          def humanized_details
            ret = []
            ret << _("Cancelled.") if cancelled?

            if pending?
              ret << _("Pending")
            elsif content_started?
              if items_total > 0
                ret << (_("New packages: %s (%s).") % [count_summary, size_summary])
              else
                #if there are no new packages, it could just mean that they have not started downloading yet
                # so only tell the user no new packages if errata have been processed
                if errata_details && errata_details['state'] != 'NOT_STARTED'
                  ret << _("No new packages.")
                else
                  ret << _("Processing metadata.")
                end
              end
            elsif metadata_in_progress?
              ret << _("Processing metadata")
            end

            ret << metadata_error if metadata_error

            if error_details.any?
              ret << n_("Failed to download %s package.", "Failed to download %s packages.",
                        error_details.count) % error_details.count
            end

            ret.join("\n")
          end

          def count_summary
            if content_details[:state] == "IN_PROGRESS"
              "#{items_done}/#{items_total}"
            else
              items_done
            end
          end

          def size_summary
            if content_details[:state] == "IN_PROGRESS"
              "#{number_to_human_size(size_done)}/#{number_to_human_size(size_total)}"
            else
              number_to_human_size(size_total)
            end
          end

          def sync_task
            action.external_task.select{ |task| task['tags'].include?("pulp:action:sync") }.first
          end

          def task_result
            sync_task[:result]
          end

          def task_result_details
            task_result && task_result[:details]
          end

          def task_progress
            sync_task[:progress_report]
          end

          def task_progress_details
            task_progress && task_progress[:yum_importer]
          end

          def task_details
            task_result_details || task_progress_details
          end

          def content_details
            task_details && task_details[:content]
          end

          def error_details
            content_details.nil? ? [] : content_details[:error_details]
          end

          def metadata_details
            task_details && task_details[:metadata]
          end

          def errata_details
            task_details && task_details[:errata]
          end

          def items_done
            items_total - content_details[:items_left]
          end

          def items_total
            content_details[:items_total].to_i
          end

          def size_done
            size_total - content_details[:size_left]
          end

          def size_total
            (content_details && content_details[:size_total]).to_i
          end

          def cancelled?
            task_details.nil? ? false : task_details.values.map{|item| item['state']}.include?('CANCELLED')
          end

          def content_started?
            content_details && content_details[:state] != 'NOT_STARTED'
          end

          def metadata_in_progress?
            metadata_details && metadata_details[:state] == 'IN_PROGRESS'
          end

          def metadata_error
            metadata_details && metadata_details[:error]
          end

          def pending?
            metadata_details.nil? || metadata_details['state'] == 'NOT_RUNNING'
          end

        end

      end
    end
  end
end
