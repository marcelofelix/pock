class PurchaseController < ApplicationController

  def index
    render json: Purchase.order('created_at DESC').all
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
