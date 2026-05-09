# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ActorsController < BaseController
        before_action :set_actor, only: [ :show, :update, :destroy ]
        load_and_authorize_resource class: Actor

        def index
          @actors = Actor.all
          @actors = @actors.ransack(params[:q]).result if params[:q].present?
          @actors = apply_sort(@actors, default_column: :last_name, default_direction: :asc)
          @actors = paginate(@actors)

          render_success({
            actors: ActorSerializer.render_as_hash(@actors),
            meta: pagination_meta(@actors)
          })
        end

        def show
          render_success({ actor: ActorSerializer.render_as_hash(@actor) })
        end

        def create
          @actor = Actor.new(actor_params)
          @actor.save!
          render_success({ actor: ActorSerializer.render_as_hash(@actor) }, status: :created)
        end

        def update
          @actor.update!(actor_params)
          render_success({ actor: ActorSerializer.render_as_hash(@actor) })
        end

        def destroy
          @actor.destroy!
          render json: { message: "Actor deleted successfully" }, status: :ok
        end

        private

        def set_actor
          @actor = Actor.find(params[:id])
        end

        def actor_params
          params.require(:actor).permit(:first_name, :last_name, :gender, :date_of_birth, :nationality, :image_url)
        end
      end
    end
  end
end
