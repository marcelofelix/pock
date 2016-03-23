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

  def show
    purchase = Purchase.find(params[:id])
    render json: purchase.to_json(include: [:supplier, :purchase_items])
  end

end
