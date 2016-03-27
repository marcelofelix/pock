class ProductsController < ActionController::Base

  def index
    render json: Product.all
  end

  def show
    product = Product.find(params[:id])
    render json: product
  end

  def create
    product = Product.new(product_param)
    product.save
    movement product, 0
    render json: product
  end

  def update
    product = Product.find(params[:id])
    old_value = product.count
    product.update!(product_param)
    new_value = product.count
    movement product, old_value
    render json: product
  end

  private

  def product_param
    params.require(:product).permit(:name, :price, :count, :ean)
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
