class SupplierController < ApplicationController
  def index
    render json: Supplier.all
  end
end
