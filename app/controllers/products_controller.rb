class ProductsController < ActionController::Base

  def index
    render json: Product.all.order(:name)
  end

  def show
    product = Product.find_by ean: params[:id]
    render json: product
  end

  def create
    product = Product.new(product_param)
    product.supplier = supplier
    product.save
    movement product, 0
    render json: product
  end

  def update
    product = Product.find(params[:id])
    product.supplier = supplier
    old_value = product.count
    product.update!(product_param)
    new_value = product.count
    movement product, old_value
    render json: product
  end

  private

  def product_param
    params.require(:product).permit(:name, :cost, :price, :count, :ean, :supplier_id)
  end

  def supplier
    Supplier.find(product_param[:supplier_id])
  end

  def movement product, old_value
    new_value = product.count
    if new_value != old_value and new_value != 0
      movement = Movement.new
      movement.product = product
      movement.count = old_value > new_value ? old_value - new_value : new_value - old_value
      movement.type = old_value > new_value ? :S : :E
      movement.save
    end
  end

end
