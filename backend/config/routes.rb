# Rails.application.routes.draw do
# devise_for :users
#   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

#   # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
#   # Can be used by load balancers and uptime monitors to verify that the app is live.
#   #get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
#end


Rails.application.routes.draw do
  # We will put everything under /api/v1 to version our API
  namespace :api do
    namespace :v1 do
      
      # === PUBLIC SIDE ===
      # Endpoints for the Next.js Public User App
      namespace :public do
        # The endpoint to get the "Session Token"
        post 'auth/session', to: 'sessions#create'
        
        # Public movie browsing (Read-Only)
        resources :movies, only: [:index, :show]
      end

      # === ADMIN SIDE ===
      # Endpoints for the Admin Dashboard
      namespace :admin do
        # Admin Authentication
        # # Map Devise to our custom JSON controller
        devise_for :users, 
                   path: '', 
                   path_names: {
                     sign_in: 'login',
                     sign_out: 'logout',
                     registration: 'signup'
                   },
                   controllers: {
                     sessions: 'api/v1/admin/sessions'
                   },
                   defaults: { format: :json }
        

        
        devise_scope :api_v1_admin_user do
           match 'sessions/reset_all', to: 'sessions#reset_all', via: [:delete, :post]
        end
      end
      
    end
  end
end