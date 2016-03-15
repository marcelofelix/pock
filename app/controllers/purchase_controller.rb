class PurchaseController < ApplicationController

  skip_before_action :verify_authenticity_token
  def index
    render json: Purchase.all
  end

  def import
    binding.pry
  end
end
