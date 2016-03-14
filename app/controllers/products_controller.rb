class ProductsController < ActionController::Base

  def index
    render json: Product.all
  end

  def show
    product = Product.find_by({ean: params[:id]})
    render json: product
  end

  def create
    product = Product.new(product_param)
    product.save
    render json: product
  end

  def update
    product = Product.find(params[:id])
    product.update!(product_param)
    render json: product
  end

  private

  def product_param
    params.require(:product).permit(:name, :price, :count, :ean)
  end

end
