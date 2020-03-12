Rails.application.routes.draw do

  resources :artifacts
  # we want the 'projects' routes be under 'tenants' routes: -->  rake routes | grep projects  
  # this will show nested routes we want for our project.
  resources :tenants do
    resources :projects
  end

  resources :members
  get 'home/index'
  root :to => "home#index"
    
  # *MUST* come *BEFORE* devise's definitions (below)
  as :user do   
    match '/user/confirmation' => 'confirmations#update', :via => :put, :as => :update_user_confirmation
  end

  devise_for :users, :controllers => { 
    :registrations => "milia/registrations",
    :confirmations => "confirmations",
    :sessions => "milia/sessions", 
    :passwords => "milia/passwords", 
  }


  # remove the next line, since milia will write its own version of this.
  # root 'home#index'
  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
