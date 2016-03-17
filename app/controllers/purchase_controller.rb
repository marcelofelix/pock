class PurchaseController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    render json: Purchase.all
  end

  def import
    file = params[:file]
    nfe = Nokogiri::XML(file.read)
    ApplicationHelper::NFe.new(nfe).import
    render nothing: true
  end

end
