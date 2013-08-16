module Katello
  module Concerns
    module MediumExtensions
      extend ActiveSupport::Concern

      included do
        belongs_to :environment, :class_name => "Katello::KTEnvironment", :foreign_key => :kt_environment_id
        belongs_to :content_view

        def self.without_content_views
          where(:content_view_id => nil)
        end

        def self.with_content_view(content_view_id)
          where(:content_view_id => [nil, content_view_id])
        end

        def self.with_environment(environment_id)
          where(:kt_environment_id => [nil, environment_id])
        end
      end

      def self.create_medium(args)
        repositories = args.fetch(:repositories)
        organization = args.fetch(:organization)
        operatingsystems = args.fetch(:operatingsystems)
        environment = args.fetch(:environment)
        content_view = args.fetch(:content_view)

        repositories.each do |repository|
          repository.distributions.each do |distribution|
            create({
              :name => [environment.label, content_view.label, distribution.id].join('-'),
              :path => repository.full_path,
              :os_family => 'Redhat',
              :content_view_id => content_view.id,
              :operatingsystems => operatingsystems,
              :organization_ids => [organization.id],
              :environment_id => environment.id
            })
          end
        end

      end

      private

      def self.create(args)
        params = {
          :name => args.fetch(:name),
          :path => args.fetch(:path),
          :os_family => args.fetch(:os_family),
          :content_view_id => args.fetch(:content_view_id),
          :operatingsystems => args.fetch(:operatingsystems),
          :organization_ids => args.fetch(:organization_ids),
          :kt_environment_id => args.fetch(:environment_id)
        }

        media = Medium.new(params)
        media.save!
      end

    end
  end
end
