# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ReviewersController < BaseController
        before_action :set_reviewer, only: [ :show, :update, :destroy ]
        load_and_authorize_resource class: Reviewer

        def index
          @reviewers = Reviewer.order(name: :asc)
          @reviewers = paginate(@reviewers)

          render_success({
            reviewers: ReviewerSerializer.render_as_hash(@reviewers),
            meta: pagination_meta(@reviewers)
          })
        end

        def show
          render_success({ reviewer: ReviewerSerializer.render_as_hash(@reviewer) })
        end

        def create
          @reviewer = Reviewer.new(reviewer_params)
          @reviewer.save!
          render_success({ reviewer: ReviewerSerializer.render_as_hash(@reviewer) }, status: :created)
        end

        def update
          @reviewer.update!(reviewer_params)
          render_success({ reviewer: ReviewerSerializer.render_as_hash(@reviewer) })
        end

        def destroy
          @reviewer.destroy!
          render json: { message: "Reviewer deleted successfully" }, status: :ok
        end

        private

        def set_reviewer
          @reviewer = Reviewer.find(params[:id])
        end

        def reviewer_params
          params.require(:reviewer).permit(:name, :website_url)
        end
      end
    end
  end
end
