class SellController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    date = Time.zone.parse(params[:date])
    render json: Sell.where(created_at: (date.midnight..date.end_of_day)).order(updated_at: :desc)
  end

  def create
    sell = Sell.new
    sell.status = :open
    sell.save
    render json: sell
  end

  def show
    render json: Sell.find(params[:id]).to_json(include: [:sell_items])
  end

  def add
    sell = Sell.find params[:id]
    product = Product.find params[:product_id]
    item = sell << product
    sell.save
    render json: item
  end

  def update_item
    sell = Sell.find params[:id]
    update = params[:item]
    item = sell.sell_items.find{|i| i.id == update[:id]}
    item.save
    if not item.nil?
      item.price = update[:price]
      item.count = update[:count]
      item.discount = update[:discount]
      item.save
      sell.save
    end
    render json: item
  end

  def remove_item
    sell_item = SellItem.find params[:id]
    sell_item.delete
    sell_item.sell.save
    render nothing: true
  end

  def update
    sell = Sell.find params[:id]
    update = params[:sell]
    sell.payment = update[:payment]
    sell.discount = update[:discount]
    sell.status = update[:status]
    sell.save
    render json: sell
  end

  private

  def item_param
    params.require(:item).permit(:ean, :name, :price, :product_id)
  end
end
