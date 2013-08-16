module Katello
  module Concerns
    module HostsAndHostgroupsHelperExtension
      extend ActiveSupport::Concern

      included do
        def os_media
          return [] if @operatingsystem.blank?
          if params[:kt_environment_id]
            unless params[:content_view_id].blank?
              @operatingsystem.media.with_environment(params[:kt_environment_id]).with_content_view(params[:content_view_id])
            end
          else
            @operatingsystem.media.without_content_views
          end
        end
      end

    end
  end
end
