Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # ── Admin namespace (JWT protected) ──────────────────────────────
      namespace :admin do
        devise_for :users,
                   path: "",
                   path_names: {
                     sign_in: "login",
                     sign_out: "logout",
                     registration: "signup"
                   },
                   controllers: {
                     sessions: "api/v1/admin/sessions"
                   },
                   defaults: { format: :json }

        devise_scope :api_v1_admin_user do
          match "sessions/reset_all", to: "sessions#reset_all", via: [ :delete, :post ]
        end

        # Core resources
        resources :movies do
          collection do
            post :tmdb_search
            post :tmdb_import
            post :tmdb_preview
          end
          resources :ratings, only: [ :index, :create, :update, :destroy ]
        end

        resources :actors
        resources :directors
        resources :genres
        resources :categories
        resources :qualities
        resources :reviewers
        resources :disks
        resources :disk_formats
        resources :users, only: [ :index, :show, :create, :update, :destroy ]
        resource :dashboard, only: [ :show ]
        resource :upload, only: [ :create ]
      end

      # ── Public namespace (read-only, no auth required) ───────────────
      namespace :public do
        namespace :auth do
          resource :session, only: [ :create ]
        end

        resources :movies, only: [ :index, :show ] do
          collection do
            get :recent
            get :random
          end
        end

        resources :categories, only: [ :index, :show ]
        resources :genres,     only: [ :index, :show ]
        resources :actors,     only: [ :index, :show ]
        resources :directors,  only: [ :index, :show ]
        resources :disks,      only: [ :index, :show ]

        get "search", to: "search#index"
        get "stats",  to: "stats#show"
      end
    end
  end

  get "up" => "health#show", as: :rails_health_check
end
