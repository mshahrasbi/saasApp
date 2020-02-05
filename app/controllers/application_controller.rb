class ApplicationController < ActionController::Base
    before_action :authenticate_tenant!, raise: false
end
