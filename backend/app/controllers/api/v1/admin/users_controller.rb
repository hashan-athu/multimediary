# frozen_string_literal: true

module Api
  module V1
    module Admin
      class UsersController < BaseController
        before_action :set_user, only: [ :show, :update, :destroy ]
        before_action :authorize_super_admin!, only: [ :destroy ]

        def index
          authorize! :read, User
          @users = User.order(created_at: :desc)
          @users = paginate(@users)

          render_success({
            users: UserSerializer.render_as_hash(@users),
            meta: pagination_meta(@users)
          })
        end

        def show
          authorize! :read, @user
          render_success({ user: UserSerializer.render_as_hash(@user) })
        end

        def update
          authorize! :update, @user
          if @current_user == @user && @user.super_admin? && user_params[:role] != "super_admin"
            return render json: { error: "Super admin cannot demote themselves" }, status: :unprocessable_entity
          end

          @user.update!(user_params)
          render_success({ user: UserSerializer.render_as_hash(@user) })
        end

        def destroy
          @user.destroy!
          render json: { message: "User deleted successfully" }, status: :ok
        end

        private

        def set_user
          @user = User.find(params[:id])
        end

        def user_params
          # brakeman:ignore:MassAssignment - intentional: this endpoint exists solely to change roles
          params.require(:user).permit(:role)
        end

        def authorize_super_admin!
          unless @current_user&.super_admin?
            render json: { error: "Forbidden", message: "Only super admins can delete users" }, status: :forbidden
          end
        end
      end
    end
  end
end
