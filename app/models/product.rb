class Product < ActiveRecord::Base
  belongs_to :supplier

  def to_item
    item = SellItem.new
    item.ean = self.ean
    item.total = 0
    item.price = self.price
    item.status = :active
    item.count = 1
    item.product_id = self.id
    item.name = self.name
    item;
  end
end
