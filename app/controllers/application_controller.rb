class ApplicationController < ActionController::Base
  http_basic_authenticate_with name: "#{ENV['POCK_USER']}", password: "#{ENV['POCK_PASSWORD']}"
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }

  def angular
    render 'layouts/application'
  end
end
